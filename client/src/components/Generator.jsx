import { useEffect, useMemo, useRef, useState } from 'react'
import * as promptCatalogModule from '@shared/promptCatalog.js'
import '../styles/Generator.css'

const promptCatalog = promptCatalogModule.default || promptCatalogModule

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

function Generator({ onSessionComplete, onViewImage }) {
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

  const hasResults = useMemo(
    () => generatedImages.length > 0 || descriptions.length > 0,
    [generatedImages.length, descriptions.length],
  )

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
    [activeCategory?.label, selectedGender?.label, standaloneCategory?.label],
  )

  const activePromptGroups = activeCategory?.groups || []
  const availablePromptCount = activeCategory?.prompts?.length || 0

  const selectedPromptDetails = useMemo(
    () => selectedPromptIds.map((id) => PROMPTS_BY_ID[id]).filter(Boolean),
    [selectedPromptIds],
  )

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
    setStatus((prev) => ({ ...prev, step: '', message: '', error: '' }))
  }, [selectedGenderId, selectedCategoryId])

  const handleSelectGender = (genderId) => {
    if (selectedGenderId === genderId) {
      return
    }
    updateStatus({ error: '' })
    setSelectedGenderId(genderId)
    setSelectedCategoryId('')
  }

  const handleSelectCategory = (categoryId, scope) => {
    if (scope !== 'standalone' && !selectedGenderId) {
      updateStatus({ error: 'Choose male or female product pictures first.' })
      return
    }
    updateStatus({ error: '' })
    setSelectedCategoryId(categoryId)
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

      const imageResponse = await fetch(buildApiUrl('/api/generate-images'), {
        method: 'POST',
        body: imageForm,
      })

      if (!imageResponse.ok) {
        const errorBody = await imageResponse.json().catch(() => ({}))
        throw new Error(errorBody.error || 'Image generation request failed')
      }

      const { images, sourceImage: sourceImageUrl, prompts: promptMetadata } = await imageResponse.json()
      setGeneratedImages(Array.isArray(images) ? images : [])
      setSourceImage(typeof sourceImageUrl === 'string' ? sourceImageUrl : '')

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
        },
        body: JSON.stringify(descriptionBody),
      })

      if (!descriptionResponse.ok) {
        const errorBody = await descriptionResponse.json().catch(() => ({}))
        throw new Error(errorBody.error || 'Description generation request failed')
      }

      const descriptionPayload = await descriptionResponse.json()
      const parsedDescriptions = descriptionPayload.descriptions || []
      setDescriptions(parsedDescriptions)

      updateStatus({
        step: 'done',
        message: 'All assets generated successfully.',
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
        <button type="button" className="secondary" onClick={handleReset}>
          Reset
        </button>
      </header>

      <main className="layout">
        <section className="panel">
          <form className="generator" onSubmit={handleSubmit}>
            <div className="upload">
              <label htmlFor="image" className="upload__label">
                <span>Garment photo*</span>
                <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
              </label>
              {imagePreview ? (
                <img src={imagePreview} alt="Upload preview" className="upload__preview" />
              ) : (
                <p className="upload__placeholder">
                  Drop or browse for a clear garment shot. This anchors every variation and the marketing copy.
                </p>
              )}
            </div>

            <div className="selector-group">
              <h2>1. Model reference</h2>
              <p className="selector-note">Pick whether you want male or female model imagery.</p>
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

            <div className="selector-group">
              <h2>2. Product focus</h2>
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
                <p className="selector-placeholder">Select a model reference to unlock apparel prompt sets.</p>
              )}

              {accessoryOptions.length > 0 && (
                <div className="selector-subgroup">
                  <span className="selector-subheading">Accessories</span>
                  <div className="selector-row" role="radiogroup" aria-label="Accessories">
                    {accessoryOptions.map((option) => {
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

            <button className="primary" type="submit" disabled={status.loading}>
              {status.loading ? 'Generating...' : 'Generate product assets'}
            </button>
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
