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

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedGenderId, setSelectedGenderId] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [generatedImages, setGeneratedImages] = useState([])
  const [sourceImage, setSourceImage] = useState('')
  const [descriptions, setDescriptions] = useState([])
  const [status, setStatus] = useState({ step: '', message: '', loading: false, error: '' })
  const selectionSnapshotRef = useRef({ genderId: '', categoryId: '' })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [accessoriesOnly, setAccessoriesOnly] = useState(false)

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
      })),
    [],
  )

  const accessoryOptionsForDisplay = useMemo(() => {
    if (selectedGenderId) {
      return accessoryOptions.filter((option) => option.id !== 'sunglasses')
    }
    return accessoryOptions
  }, [accessoryOptions, selectedGenderId])

  const selectedGender = useMemo(
    () => genderOptions.find((option) => option.id === selectedGenderId) || null,
    [genderOptions, selectedGenderId],
  )

  const standaloneCategory = useMemo(
    () => getStandaloneDefinition(selectedCategoryId),
    [selectedCategoryId],
  )

  const activeCategory = useMemo(() => {
    if (standaloneCategory) {
      return standaloneCategory
    }
    return getCategoryDefinition(selectedGenderId, selectedCategoryId)
  }, [standaloneCategory, selectedGenderId, selectedCategoryId])

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

  const stepOrder = ['reference', 'focus', 'prompts', 'upload']
  const stepMeta = {
    reference: {
      title: 'Model reference',
      description: 'Select a model gender or continue with accessories only.',
    },
    focus: {
      title: 'Product focus',
      description: 'Choose the garment zone or accessory you want to visualise.',
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
  const currentStepId = stepOrder[currentStepIndex]
  const focusHasTemplates = Boolean(activeCategory) && availablePromptCount > 0
  const isReferenceComplete = accessoriesOnly || Boolean(selectedGenderId)
  const isFocusComplete = Boolean(selectedCategoryId) && focusHasTemplates
  const hasPromptSelection = selectedPromptIds.length > 0
  const isReadyToGenerate =
    isReferenceComplete &&
    Boolean(selectedCategoryId) &&
    hasPromptSelection &&
    Boolean(imageFile) &&
    focusHasTemplates &&
    (standaloneCategory || selectedGenderId || accessoriesOnly) &&
    hasEnoughCoins
  const canAdvanceCurrentStep =
    currentStepId === 'reference'
      ? isReferenceComplete
      : currentStepId === 'focus'
      ? isFocusComplete
      : currentStepId === 'prompts'
      ? hasPromptSelection
      : false
  const stepDescriptors = stepOrder.map((id, index) => ({
    id,
    title: stepMeta[id].title,
    description: stepMeta[id].description,
    status: index < currentStepIndex ? 'complete' : index === currentStepIndex ? 'current' : 'upcoming',
  }))

  useEffect(() => {
    const previous = selectionSnapshotRef.current
    if (previous.genderId === selectedGenderId && previous.categoryId === selectedCategoryId) {
      return
    }

    selectionSnapshotRef.current = { genderId: selectedGenderId, categoryId: selectedCategoryId }

    if (!selectedGenderId && !selectedCategoryId) {
      return
    }

    setSelectedPromptIds([])
    setGeneratedImages([])
    setDescriptions([])
    setSourceImage('')
    setCurrentStepIndex((prev) => (!selectedCategoryId ? Math.min(prev, 1) : Math.min(prev, 2)))
    setStatus((prev) => ({ ...prev, step: '', message: '', error: '' }))
  }, [selectedGenderId, selectedCategoryId])

  useEffect(() => {
    if (!isReferenceComplete) {
      setCurrentStepIndex(0)
    }
  }, [isReferenceComplete])

  useEffect(() => {
    if (selectedPromptIds.length === 0 && currentStepIndex > 2) {
      setCurrentStepIndex(2)
    }
  }, [selectedPromptIds.length, currentStepIndex])

  const handleSelectGender = (genderId) => {
    if (selectedGenderId === genderId) {
      return
    }
    updateStatus({ error: '' })
    setAccessoriesOnly(false)
    setSelectedGenderId(genderId)
    setSelectedCategoryId('')
  }

  const handleSelectCategory = (categoryId, scope) => {
    if (scope !== 'standalone' && !selectedGenderId) {
      updateStatus({ error: 'Choose male or female product pictures first.' })
      return
    }
    updateStatus({ error: '' })
    if (scope === 'standalone') {
      if (selectedGenderId && categoryId === 'sunglasses') {
        updateStatus({
          error: 'Switch to accessories-only mode to generate sunglasses looks.',
        })
        return
      }
      setAccessoriesOnly(true)
    } else {
      setAccessoriesOnly(false)
    }
    setSelectedCategoryId(categoryId)
  }

  const stepErrorMessages = {
    reference: 'Choose male or female product pictures first, or continue with accessories only.',
    focus: 'Select a product focus to continue.',
    prompts: 'Select at least one prompt direction.',
  }

  const handleAccessoriesOnly = () => {
    setAccessoriesOnly((prev) => {
      const next = !prev
      if (next) {
        setSelectedGenderId('')
        setSelectedCategoryId('')
        setSelectedPromptIds([])
      }
      return next
    })
    resetOutputs()
    updateStatus({ error: '' })
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

    const isStandaloneSelection = Boolean(standaloneCategory)

    if (!selectedCategoryId) {
      updateStatus({ error: 'Select a product focus to continue.' })
      return
    }

    if (!isStandaloneSelection && !selectedGenderId) {
      updateStatus({ error: 'Choose male or female product pictures first.' })
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
    setImageFile(null)
    setImagePreview('')
    setSelectedGenderId('')
    setSelectedCategoryId('')
    setSelectedPromptIds([])
    setAccessoriesOnly(false)
    setCurrentStepIndex(0)
    selectionSnapshotRef.current = { genderId: '', categoryId: '' }
    resetOutputs()
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

  const apparelCategories = selectedGender ? selectedGender.categories : []

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
              return (
                <li key={step.id} className={`funnel-step funnel-step--${step.status}`}>
                  <button
                    type="button"
                    className="funnel-step__button"
                    onClick={() => handleStepClick(index)}
                    disabled={isDisabled}
                  >
                    <span className="funnel-step__index">{index + 1}</span>
                    <span className="funnel-step__text">
                      <span className="funnel-step__title">{step.title}</span>
                      <span className="funnel-step__description">{step.description}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="funnel-content">
            {currentStepId === 'reference' && (
              <div className="selector-group">
                <h2>Model reference</h2>
                <p className="selector-note">
                  Choose the model gender for apparel shots, or continue with accessories only.
                </p>
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
                <div className="selector-shortcut">
                  <button
                    type="button"
                    className={`selector-btn selector-btn--compact${accessoriesOnly ? ' selector-btn--selected' : ''}`}
                    onClick={handleAccessoriesOnly}
                  >
                    I&apos;m generating accessories only
                  </button>
                  <p className={`selector-note${accessoriesOnly ? ' selector-note--success' : ''}`}>
                    {accessoriesOnly
                      ? 'Accessories unlocked. You can choose sunglasses on the next step.'
                      : 'Select this if you only need sunglasses or other accessories.'}
                  </p>
                </div>
              </div>
            )}

            {currentStepId === 'focus' && (
              <div className="selector-group">
                <h2>Product focus</h2>
                <p className="selector-note">Load tailored prompt cues for the garment zone you need.</p>
                {selectedGender ? (
                  <div className="selector-subgroup">
                    <span className="selector-subheading">{selectedGender.label} apparel</span>
                    <div className="selector-row" role="radiogroup" aria-label="Garment type">
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
                  !accessoriesOnly && (
                    <p className="selector-placeholder">
                      Select a model reference to unlock apparel prompt sets.
                    </p>
                  )
                )}

                {accessoryOptionsForDisplay.length > 0 && (
                  <div className="selector-subgroup">
                    <span className="selector-subheading">Accessories</span>
                    <div className="selector-row" role="radiogroup" aria-label="Accessories">
                      {accessoryOptionsForDisplay.map((option) => {
                        const isSelected = selectedCategoryId === option.id
                        return (
                          <button
                            key={`standalone-${option.id}`}
                            type="button"
                            className={`selector-btn selector-btn--compact${
                              isSelected ? ' selector-btn--selected' : ''
                            }`}
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
                    <span>Garment photo*</span>
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
                      <span>Model reference</span>
                      <strong>{accessoriesOnly ? 'Accessories only' : selectedGender?.label || 'Not set'}</strong>
                    </li>
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
