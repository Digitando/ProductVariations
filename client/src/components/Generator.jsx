import { useEffect, useMemo, useRef, useState } from 'react'
import * as promptCatalogModule from '@shared/promptCatalog.cjs'
import '../styles/Generator.css'

const promptCatalog = 'default' in promptCatalogModule ? promptCatalogModule['default'] : promptCatalogModule

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const PROMPTS_BY_ID = promptCatalog.promptsById || {}
const GENDER_DEFINITIONS = promptCatalog.genders || []
const STANDALONE_DEFINITIONS = promptCatalog.standaloneCategories || []
const CATEGORY_LOOKUP = promptCatalog.categoryLookup || {}
const STANDALONE_LOOKUP = promptCatalog.standaloneLookup || {}

const getCategoryDefinition = (genderId, categoryId) => {
  if (!genderId || !categoryId) {
    return null
  }
  return CATEGORY_LOOKUP[`${genderId}:${categoryId}`] || null
}

const getStandaloneDefinition = (categoryId) => {
  if (!categoryId) {
    return null
  }
  return STANDALONE_LOOKUP[categoryId] || null
}

function buildSummaryLabel({ genderLabel, categoryLabel, accessoryLabel }) {
  if (accessoryLabel) {
    return accessoryLabel
  }
  if (genderLabel && categoryLabel) {
    return `${genderLabel} - ${categoryLabel}`
  }
  return categoryLabel || genderLabel || ''
}

function Generator({ onSessionComplete, onViewImage, token, coins = 0, onCoinsChange, onRequestTopUp }) {
  const handleViewImage = (src, alt) => {
    if (typeof onViewImage === 'function') {
      onViewImage({ src, alt })
    }
  }

  const [productScope, setProductScope] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedGenderId, setSelectedGenderId] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [generatedImages, setGeneratedImages] = useState([])
  const [sourceImage, setSourceImage] = useState('')
  const [descriptions, setDescriptions] = useState([])
  const [status, setStatus] = useState({ step: '', message: '', loading: false, error: '' })
  const selectionSnapshotRef = useRef({ scope: '', genderId: '', categoryId: '' })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const hasResults = useMemo(
    () => generatedImages.length > 0 || descriptions.length > 0,
    [generatedImages.length, descriptions.length],
  )

  const coinsRequired = useMemo(() => Math.max(selectedPromptIds.length, 1), [selectedPromptIds.length])
  const hasEnoughCoins = coins >= coinsRequired

  const resetOutputs = () => {
    setGeneratedImages([])
    setDescriptions([])
    setSourceImage('')
  }

  const updateStatus = (partial) => {
    setStatus((prev) => ({ ...prev, ...partial }))
  }

  const genderOptions = useMemo(
    () =>
      GENDER_DEFINITIONS.map((gender) => ({
        id: gender.id,
        label: gender.label,
        hasPrompts: gender.categories.some((category) => category.hasPrompts),
        categories: gender.categories,
      })),
    [],
  )

  const accessoryOptions = useMemo(
    () =>
      STANDALONE_DEFINITIONS.map((category) => ({
        id: category.id,
        label: category.label,
        hasPrompts: category.hasPrompts,
      })).sort((a, b) => a.label.localeCompare(b.label)),
    [],
  )

  const selectedGender = useMemo(
    () => genderOptions.find((option) => option.id === selectedGenderId) || null,
    [genderOptions, selectedGenderId],
  )

  const standaloneCategory = useMemo(
    () => (productScope === 'accessory' ? getStandaloneDefinition(selectedCategoryId) : null),
    [productScope, selectedCategoryId],
  )

  const activeCategory = useMemo(() => {
    if (productScope === 'accessory') {
      return standaloneCategory
    }
    if (productScope === 'apparel') {
      return getCategoryDefinition(selectedGenderId, selectedCategoryId)
    }
    return null
  }, [productScope, standaloneCategory, selectedGenderId, selectedCategoryId])

  const activeCategoryLabel = useMemo(
    () =>
      buildSummaryLabel({
        genderLabel: selectedGender?.label || '',
        categoryLabel: standaloneCategory ? '' : activeCategory?.label || '',
        accessoryLabel: standaloneCategory?.label || '',
      }),
    [activeCategory, selectedGender, standaloneCategory],
  )

  const activePromptGroups = activeCategory?.groups || []
  const availablePromptCount = activeCategory?.prompts?.length || 0

  const selectedPromptDetails = useMemo(
    () => selectedPromptIds.map((id) => PROMPTS_BY_ID[id]).filter(Boolean),
    [selectedPromptIds],
  )

  const stepMeta = {
    scope: {
      title: 'Product type',
      description: 'Choose whether you want to generate apparel looks or accessories renders.',
    },
    gender: {
      title: 'Model reference',
      description: 'Pick the model fit for apparel looks.',
    },
    focus: {
      title: 'Product focus',
      description: 'Select the garment zone or accessory to visualise.',
    },
    prompts: {
      title: 'Prompt cues',
      description: 'Pick the creative directions for the generated shots.',
    },
    upload: {
      title: 'Upload & generate',
      description: 'Review your inputs, add the photo, and create assets.',
    },
  }

  const stepOrder = useMemo(
    () => (productScope === 'accessory' ? ['scope', 'focus', 'prompts', 'upload'] : ['scope', 'gender', 'focus', 'prompts', 'upload']),
    [productScope],
  )

  useEffect(() => {
    setCurrentStepIndex((prev) => {
      const maxIndex = Math.max(stepOrder.length - 1, 0)
      return prev > maxIndex ? maxIndex : prev
    })
  }, [stepOrder])

  const currentStepId = stepOrder[currentStepIndex] || stepOrder[0]
  const focusHasTemplates = Boolean(activeCategory) && availablePromptCount > 0
  const isScopeComplete = productScope === 'apparel' || productScope === 'accessory'
  const isGenderComplete = productScope === 'accessory' ? true : Boolean(selectedGenderId)
  const isFocusComplete = Boolean(selectedCategoryId) && focusHasTemplates
  const hasPromptSelection = selectedPromptIds.length > 0
  const isReadyToGenerate =
    Boolean(productScope) &&
    (productScope === 'accessory' || Boolean(selectedGenderId)) &&
    Boolean(selectedCategoryId) &&
    hasPromptSelection &&
    Boolean(imageFile) &&
    focusHasTemplates &&
    hasEnoughCoins
  const canAdvanceCurrentStep = (() => {
    switch (currentStepId) {
      case 'scope':
        return isScopeComplete
      case 'gender':
        return isGenderComplete
      case 'focus':
        return isFocusComplete
      case 'prompts':
        return hasPromptSelection
      default:
        return false
    }
  })()
  const stepDescriptors = stepOrder.map((id, index) => ({
    id,
    title: stepMeta[id].title,
    description: stepMeta[id].description,
    status: index < currentStepIndex ? 'complete' : index === currentStepIndex ? 'current' : 'upcoming',
  }))

  useEffect(() => {
    const previous = selectionSnapshotRef.current

    if (previous.scope !== productScope) {
      selectionSnapshotRef.current = { scope: productScope, genderId: '', categoryId: '' }
      if (!productScope) {
        return
      }
      setSelectedGenderId('')
      setSelectedCategoryId('')
      setSelectedPromptIds([])
      resetOutputs()
      setStatus((prev) => ({ ...prev, step: '', message: '', error: '' }))
      setCurrentStepIndex(0)
      return
    }

    if (productScope === 'apparel' && previous.genderId !== selectedGenderId) {
      selectionSnapshotRef.current = { scope: productScope, genderId: selectedGenderId, categoryId: '' }
      setSelectedCategoryId('')
      setSelectedPromptIds([])
      resetOutputs()
      setStatus((prev) => ({ ...prev, step: '', message: '', error: '' }))
      setCurrentStepIndex((prev) => {
        const focusIndex = stepOrder.indexOf('focus')
        return focusIndex === -1 ? prev : Math.min(prev, focusIndex)
      })
      return
    }

    if (previous.categoryId !== selectedCategoryId) {
      selectionSnapshotRef.current = { scope: productScope, genderId: selectedGenderId, categoryId: selectedCategoryId }
      setSelectedPromptIds([])
      resetOutputs()
      setStatus((prev) => ({ ...prev, step: '', message: '', error: '' }))
      return
    }

    selectionSnapshotRef.current = { scope: productScope, genderId: selectedGenderId, categoryId: selectedCategoryId }
  }, [productScope, selectedGenderId, selectedCategoryId, stepOrder])

  const handleScopeSelect = (scope) => {
    if (productScope === scope) {
      return
    }
    updateStatus({ error: '' })
    setProductScope(scope)
  }

  const handleSelectGender = (genderId) => {
    if (selectedGenderId === genderId) {
      return
    }
    if (productScope !== 'apparel') {
      setProductScope('apparel')
    }
    updateStatus({ error: '' })
    setSelectedGenderId(genderId)
    setSelectedCategoryId('')
  }

  const handleSelectCategory = (categoryId, scope) => {
    updateStatus({ error: '' })

    if (scope === 'gendered') {
      if (productScope !== 'apparel') {
        setProductScope('apparel')
      }
      if (!selectedGenderId) {
        updateStatus({ error: 'Choose male or female product pictures first.' })
        return
      }
    } else if (scope === 'standalone') {
      if (productScope !== 'accessory') {
        setProductScope('accessory')
      }
    }

    setSelectedCategoryId(categoryId)
  }

  const stepErrorMessages = {
    scope: 'Select whether you need apparel looks or accessories first.',
    gender: 'Choose male or female product pictures first.',
    focus: 'Select a product focus to continue.',
    prompts: 'Select at least one prompt direction.',
  }

  const handleStepClick = (index) => {
    if (index > currentStepIndex || status.loading) {
      return
    }
    setCurrentStepIndex(index)
    updateStatus({ error: '' })
  }

  const handleNext = () => {
    if (!canAdvanceCurrentStep) {
      const message = stepErrorMessages[currentStepId]
      if (message) {
        updateStatus({ error: message })
      }
      return
    }
    updateStatus({ error: '' })
    setCurrentStepIndex((prev) => Math.min(prev + 1, stepOrder.length - 1))
  }

  const handleBack = () => {
    if (currentStepIndex === 0) {
      return
    }
    updateStatus({ error: '' })
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleFileChange = (evt) => {
    const file = evt.target.files?.[0]
    if (!file) {
      setImageFile(null)
      setImagePreview('')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(String(e.target?.result || ''))
    }
    reader.readAsDataURL(file)
  }

  const togglePrompt = (promptId) => {
    const isPromptInActiveCategory = Boolean(
      activeCategory?.prompts?.some((prompt) => prompt.id === promptId),
    )

    if (!isPromptInActiveCategory) {
      return
    }

    updateStatus({ error: '' })
    setSelectedPromptIds((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((value) => value !== promptId)
      }

      return [...prev, promptId]
    })
  }

  const buildApiUrl = (path) => `${API_BASE_URL}${path}`

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    if (!token) {
      updateStatus({ error: 'Your session expired. Please log back in to generate assets.', loading: false })
      return
    }

    if (!productScope) {
      updateStatus({ error: 'Select whether you need apparel looks or accessories first.' })
      return
    }

    if (productScope === 'apparel' && !selectedGenderId) {
      updateStatus({ error: 'Choose male or female product pictures first.' })
      return
    }

    if (!selectedCategoryId) {
      updateStatus({ error: 'Select a product focus to continue.' })
      return
    }

    if (!activeCategory || availablePromptCount === 0) {
      updateStatus({ error: 'Prompt templates for this selection are not available yet.' })
      return
    }

    if (!imageFile) {
      updateStatus({ error: 'Upload a product photo to continue.' })
      return
    }

    if (!hasEnoughCoins) {
      updateStatus({
        error: `You need ${coinsRequired} coin${coinsRequired === 1 ? '' : 's'} to run this batch. Top up your balance to continue.`,
      })
      if (typeof onRequestTopUp === 'function') {
        onRequestTopUp()
      }
      return
    }

    if (selectedPromptIds.length === 0) {
      updateStatus({ error: 'Select at least one prompt direction.' })
      return
    }

    resetOutputs()

    updateStatus({
      step: 'images',
      message: 'Generating editorials and close-ups...',
      loading: true,
      error: '',
    })

    try {
      const imageForm = new FormData()
      imageForm.append('image', imageFile)
      imageForm.append('prompts', JSON.stringify(selectedPromptIds))

      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

      const imageResponse = await fetch(buildApiUrl('/api/generate-images'), {
        method: 'POST',
        body: imageForm,
        headers: authHeaders,
      })

      if (imageResponse.status === 401) {
        updateStatus({ error: 'Your session has expired. Please log in again.', loading: false })
        return
      }

      if (imageResponse.status === 402) {
        const errorBody = await imageResponse.json().catch(() => ({}))
        const message =
          errorBody?.error ||
          `You need ${coinsRequired} coin${coinsRequired === 1 ? '' : 's'} for this generation. Top up your wallet.`
        updateStatus({ error: message, loading: false })
        if (typeof onRequestTopUp === 'function') {
          onRequestTopUp()
        }
        return
      }

      if (!imageResponse.ok) {
        const errorBody = await imageResponse.json().catch(() => ({}))
        throw new Error(errorBody.error || 'Image generation request failed')
      }

      const {
        images,
        sourceImage: sourceImageUrl,
        prompts: promptMetadata,
        coins: remainingCoins,
        coinsCharged,
      } = await imageResponse.json()
      setGeneratedImages(Array.isArray(images) ? images : [])
      setSourceImage(typeof sourceImageUrl === 'string' ? sourceImageUrl : '')

      if (typeof remainingCoins === 'number' && typeof onCoinsChange === 'function') {
        onCoinsChange(remainingCoins)
      }

      updateStatus({
        step: 'descriptions',
        message: 'Visuals ready. Writing product descriptions...',
        loading: true,
      })

      const referenceImagePayload =
        typeof imagePreview === 'string'
          ? imagePreview.includes(',')
            ? (imagePreview.split(',')[1] || '').trim()
            : imagePreview.trim()
          : ''

      const descriptionBody = {
        prompts: selectedPromptIds,
        referenceImage: sourceImageUrl || referenceImagePayload,
        referenceImageFallback: referenceImagePayload,
        imageCount: images.length,
      }

      const descriptionResponse = await fetch(buildApiUrl('/api/generate-descriptions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(descriptionBody),
      })

      if (descriptionResponse.status === 401) {
        updateStatus({ error: 'Your session has expired. Please log in again.', loading: false })
        return
      }

      if (!descriptionResponse.ok) {
        const errorBody = await descriptionResponse.json().catch(() => ({}))
        throw new Error(errorBody.error || 'Description generation request failed')
      }

      const descriptionPayload = await descriptionResponse.json()
      const parsedDescriptions = descriptionPayload.descriptions || []
      setDescriptions(parsedDescriptions)

      updateStatus({
        step: 'done',
        message:
          typeof remainingCoins === 'number'
            ? `All assets generated successfully. You have ${remainingCoins} coin${remainingCoins === 1 ? '' : 's'} remaining${
                typeof coinsCharged === 'number' && coinsCharged > 0
                  ? ` after spending ${coinsCharged} coin${coinsCharged === 1 ? '' : 's'}.`
                  : '.'
              }`
            : 'All assets generated successfully.',
        loading: false,
      })

      if (onSessionComplete) {
        onSessionComplete({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          prompts: promptMetadata || selectedPromptDetails,
          sourceImage: typeof sourceImageUrl === 'string' ? sourceImageUrl : '',
          generatedImages: Array.isArray(images) ? images : [],
          descriptions: parsedDescriptions,
        })
      }
    } catch (error) {
      console.error(error)
      updateStatus({
        error: error instanceof Error ? error.message : 'Something went wrong',
        loading: false,
      })
    }
  }

  const handleReset = () => {
    setProductScope('')
    setImageFile(null)
    setImagePreview('')
    setSelectedGenderId('')
    setSelectedCategoryId('')
    setSelectedPromptIds([])
    resetOutputs()
    setCurrentStepIndex(0)
    selectionSnapshotRef.current = { scope: '', genderId: '', categoryId: '' }
    updateStatus({ step: '', message: '', loading: false, error: '' })
  }

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'generated-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image. Please try again.')
    }
  }

  const downloadAllImages = async () => {
    if (generatedImages.length === 0) return

    updateStatus({ loading: true, message: 'Preparing bulk download...' })

    try {
      const JSZip = await import('jszip')
      const zip = new JSZip.default()

      for (let i = 0; i < generatedImages.length; i++) {
        const imageUrl = generatedImages[i]
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        zip.file(`variation-${i + 1}.png`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'product-variations.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      updateStatus({ loading: false, message: 'Bulk download completed!' })
    } catch (error) {
      console.error('Bulk download failed:', error)
      updateStatus({
        loading: false,
        error: 'Failed to download images. Please try individual downloads.',
      })
    }
  }

  const apparelCategories = useMemo(() => {
    if (!selectedGender) {
      return []
    }
    const order = ['upper', 'lower', 'footwear']
    return selectedGender.categories
      .filter((category) => order.includes(category.id))
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }, [selectedGender])

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Photo-first Garment Generator</h1>
          <p>
            Upload a single garment photo, choose as many editorial prompt directions as you want, and let OpenRouter craft
            faithful model and product imagery plus e-commerce copy.
          </p>
        </div>
        <div className="generator__header-actions">
          <div className="generator__coins">
            <span>Coins</span>
            <strong>{coins}</strong>
          </div>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              if (typeof onRequestTopUp === 'function') {
                onRequestTopUp()
              }
            }}
            disabled={typeof onRequestTopUp !== 'function'}
          >
            Buy coins
          </button>
          <button type="button" className="secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <form className="generator" onSubmit={handleSubmit}>
          <div className={`coin-alert${hasEnoughCoins ? '' : ' coin-alert--warning'}`}>
            <div>
              <span>Coins required</span>
              <strong>{coinsRequired}</strong>
            </div>
            <div>
              <span>Coins after run</span>
              <strong>{Math.max(coins - coinsRequired, 0)}</strong>
            </div>
            {!hasEnoughCoins && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  if (typeof onRequestTopUp === 'function') {
                    onRequestTopUp()
                  }
                }}
              >
                Top up coins
              </button>
            )}
          </div>
          <ol className="funnel-stepper" role="list">
            {stepDescriptors.map((step, index) => {
              const isDisabled = index > currentStepIndex
              const ariaLabel = step.description
                ? `${step.title}. ${step.description}`
                : step.title
              return (
                <li key={step.id} className={`funnel-step funnel-step--${step.status}`}>
                  <button
                    type="button"
                    className="funnel-step__button"
                    onClick={() => handleStepClick(index)}
                    disabled={isDisabled}
                    aria-label={ariaLabel}
                  >
                    <span className="funnel-step__index">{index + 1}</span>
                    <span className="funnel-step__title">{step.title}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="funnel-content">
            {currentStepId === 'scope' && (
              <div className="selector-group">
                <h2>What do you need?</h2>
                <p className="selector-note">Choose between apparel looks or accessories renders.</p>
                <div className="selector-row" role="radiogroup" aria-label="Product type">
                  {[
                    { id: 'apparel', label: 'Apparel looks' },
                    { id: 'accessory', label: 'Accessories' },
                  ].map((option) => {
                    const isSelected = productScope === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`selector-btn${isSelected ? ' selector-btn--selected' : ''}`}
                        onClick={() => handleScopeSelect(option.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="selector-btn__label">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {currentStepId === 'gender' && (
              <div className="selector-group">
                <h2>Model reference</h2>
                <p className="selector-note">Pick a model fit so we can frame the apparel correctly.</p>
                <div className="selector-row" role="radiogroup" aria-label="Model reference">
                  {genderOptions.map((option) => {
                    const isSelected = option.id === selectedGenderId
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`selector-btn${isSelected ? ' selector-btn--selected' : ''}`}
                        onClick={() => handleSelectGender(option.id)}
                        aria-pressed={isSelected}
                        disabled={!option.hasPrompts}
                      >
                        <span className="selector-btn__label">{option.label}</span>
                        {!option.hasPrompts && <span className="selector-btn__tag">Coming soon</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {currentStepId === 'focus' && (
              <div className="selector-group">
                <h2>Product focus</h2>
                <p className="selector-note">Load tailored prompt cues for the item you need.</p>

                {productScope === 'apparel' ? (
                  selectedGender ? (
                    <div className="selector-subgroup">
                      <span className="selector-subheading">{selectedGender.label} apparel</span>
                      <div className="selector-row" role="radiogroup" aria-label="Apparel categories">
                        {apparelCategories.map((category) => {
                          const isSelected = selectedCategoryId === category.id
                          return (
                            <button
                              key={`${selectedGender.id}-${category.id}`}
                              type="button"
                              className={`selector-btn${isSelected ? ' selector-btn--selected' : ''}`}
                              onClick={() => handleSelectCategory(category.id, 'gendered')}
                              aria-pressed={isSelected}
                              disabled={!category.hasPrompts}
                            >
                              <span className="selector-btn__label">{category.label}</span>
                              {!category.hasPrompts && <span className="selector-btn__tag">Coming soon</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="selector-placeholder">Choose a model fit first to unlock apparel options.</p>
                  )
                ) : null}

                {productScope === 'accessory' && (
                  <div className="selector-subgroup">
                    <span className="selector-subheading">Accessories</span>
                    <div className="selector-row" role="radiogroup" aria-label="Accessories">
                      {accessoryOptions.map((option) => {
                        const isSelected = selectedCategoryId === option.id
                        return (
                          <button
                            key={`standalone-${option.id}`}
                            type="button"
                            className={`selector-btn selector-btn--compact${isSelected ? ' selector-btn--selected' : ''}`}
                            onClick={() => handleSelectCategory(option.id, 'standalone')}
                            aria-pressed={isSelected}
                            disabled={!option.hasPrompts}
                          >
                            <span className="selector-btn__label">{option.label}</span>
                            {!option.hasPrompts && <span className="selector-btn__tag">Coming soon</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStepId === 'prompts' && (
              <div className="styles">
                <div className="styles__header">
                  <div>
                    <h2>Prompt directions</h2>
                    {activeCategoryLabel && <p className="styles__context">{activeCategoryLabel}</p>}
                  </div>
                  <span>{selectedPromptIds.length} selected</span>
                </div>
                {!activeCategory && (
                  <p className="styles__hint">Choose a product focus to load suggested prompt cues.</p>
                )}
                {activeCategory && availablePromptCount === 0 && (
                  <p className="styles__hint">Prompt templates for this selection are coming soon.</p>
                )}
                {activeCategory && availablePromptCount > 0 && (
                  <>
                    <p className="styles__hint">
                      Choose as many prompts as you want. They steer the scenarios while the product stays consistent.
                    </p>
                    {activePromptGroups.map((group) => (
                      <div key={group.id} className="prompt-group">
                        <h3>{group.label}</h3>
                        <div className="style-grid">
                          {group.prompts.map((option) => {
                            const isChecked = selectedPromptIds.includes(option.id)
                            return (
                              <label
                                key={option.id}
                                className={`style-option${isChecked ? ' style-option--selected' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  value={option.id}
                                  checked={isChecked}
                                  onChange={() => togglePrompt(option.id)}
                                />
                                <div className="style-option__content">
                                  <span className="style-option__title">{option.title}</span>
                                  <span className="style-option__description">{option.description}</span>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {currentStepId === 'upload' && (
              <div className="upload-step">
                <div className="upload">
                  <label htmlFor="image" className="upload__label">
                    <span>Product photo*</span>
                    <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
                  </label>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Upload preview" className="upload__preview" />
                  ) : (
                    <p className="upload__placeholder">
                      Drop or browse for a clear product shot. This anchors every variation and the marketing copy.
                    </p>
                  )}
                </div>
                <aside className="upload-summary">
                  <h3>Review selections</h3>
                  <ul className="funnel-summary">
                    <li>
                      <span>Product type</span>
                      <strong>
                        {productScope === 'apparel'
                          ? 'Apparel looks'
                          : productScope === 'accessory'
                          ? 'Accessories'
                          : 'Not set'}
                      </strong>
                    </li>
                    {productScope === 'apparel' && (
                      <li>
                        <span>Model reference</span>
                        <strong>{selectedGender?.label || 'Not set'}</strong>
                      </li>
                    )}
                    <li>
                      <span>Product focus</span>
                      <strong>{activeCategoryLabel || 'Not set'}</strong>
                    </li>
                    <li>
                      <span>Prompts selected</span>
                      <strong>{selectedPromptIds.length}</strong>
                    </li>
                  </ul>
                  {selectedPromptDetails.length > 0 && (
                    <div className="selected-styles selected-styles--inline">
                      <h4>Cues</h4>
                      <div className="style-chip-row">
                        {selectedPromptDetails.map((prompt) => (
                          <span key={prompt.id} className="style-chip">
                            {prompt.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            )}
          </div>

          <div className="funnel-actions">
            <button
              type="button"
              className="secondary"
              onClick={handleBack}
              disabled={currentStepIndex === 0 || status.loading}
            >
              Back
            </button>
            <div className="funnel-actions__spacer" />
            {currentStepIndex < stepOrder.length - 1 ? (
              <button
                type="button"
                className="primary"
                onClick={handleNext}
                disabled={!canAdvanceCurrentStep || status.loading}
              >
                Next step
              </button>
            ) : (
              <button className="primary" type="submit" disabled={status.loading || !isReadyToGenerate}>
                {status.loading ? 'Generating...' : 'Generate product assets'}
              </button>
            )}
          </div>

          {status.message && !status.error && <p className="status status--info">{status.message}</p>}
          {status.error && <p className="status status--error">{status.error}</p>}
        </form>
        </section>

        <section className="panel results">
          {!hasResults && (
            <p className="placeholder">
              Generated image variations and descriptions will appear here once processing completes.
            </p>
          )}

          {selectedPromptDetails.length > 0 && (
            <div className="selected-styles">
              <h2>Selected prompt cues</h2>
              <div className="style-chip-row">
                {selectedPromptDetails.map((prompt) => (
                  <span key={prompt.id} className="style-chip">
                    {prompt.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sourceImage && (
            <div className="source-image">
              <h2>Source image URL</h2>
              <a href={sourceImage} target="_blank" rel="noreferrer">
                {sourceImage}
              </a>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div>
              <div className="images-header">
                <h2>Image variations</h2>
                <div className="download-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={downloadAllImages}
                    disabled={status.loading}
                  >
                    Download All ({generatedImages.length})
                  </button>
                </div>
              </div>
              <div className="image-grid">
                {generatedImages.map((src, index) => (
                  <figure key={`${src}-${index}`}>
                    <button
                      type="button"
                      className="image-thumb"
                      onClick={() => handleViewImage(src, `Generated variation ${index + 1}`)}
                    >
                      <img src={src} alt={`Generated variation ${index + 1}`} loading="lazy" />
                    </button>
                    <div className="image-actions">
                      <figcaption>Variation {index + 1}</figcaption>
                      <button
                        type="button"
                        className="download-btn"
                        onClick={() => downloadImage(src, `variation-${index + 1}.png`)}
                        title="Download this image"
                      >
                        Download
                      </button>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {descriptions.length > 0 && (
            <div className="descriptions">
              <h2>Product descriptions</h2>
              <div className="description-grid">
                {descriptions.map((item, index) => (
                  <article key={index} className="description-card">
                    <header>
                      <span className="description-index">#{index + 1}</span>
                      <p className="description-tone">Tone: {item.tone}</p>
                    </header>
                    {item.title && <h2 className="description-title">{item.title}</h2>}
                    <h3>{item.headline}</h3>
                    {item.tagline && <p className="description-tagline">{item.tagline}</p>}
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Generator
