import { useCallback, useEffect, useMemo, useState } from 'react'
import * as promptCatalogModule from '@shared/promptCatalog.cjs'
import '../styles/ChatShell.css'

const promptCatalog = 'default' in promptCatalogModule ? promptCatalogModule.default : promptCatalogModule
const PROMPTS_BY_ID = promptCatalog.promptsById || {}
const STANDALONE_DEFINITIONS = promptCatalog.standaloneCategories || []
const STANDALONE_LOOKUP = promptCatalog.standaloneLookup || {}

const EMPTY_CHAT_MESSAGE = {
  id: 'empty-state',
  type: 'system',
  headline: 'Get started',
  body: 'Upload a product image, choose a category, and hit Generate to create your first variation.',
}

const QUICK_SUGGESTIONS = [
  {
    id: 'suggestion-hero-shot',
    title: 'Polish my hero image',
    description: 'Studio-ready beauty setup with glossy reflections and soft gradients.',
    categoryId: 'beauty_cosmetics',
    promptIds: ['beauty_cosmetics-01', 'beauty_cosmetics-03'],
    customPrompt:
      'Balance a warm gradient backdrop with crisp reflections so the packaging looks premium and editorial ready.',
  },
  {
    id: 'suggestion-energize',
    title: 'Make it athletic & bold',
    description: 'Outdoor lifestyle energy, perfect for fitness gear launches.',
    categoryId: 'fitness_sport',
    promptIds: ['fitness_sport-02'],
    customPrompt:
      'Show the product in motion with dynamic lighting, shallow depth of field, and vibrant athletic energy.',
  },
  {
    id: 'suggestion-tech',
    title: 'Highlight tech features',
    description: 'Hero desk setup with cinematic lighting for electronics.',
    categoryId: 'electronics',
    promptIds: ['electronics-01'],
    customPrompt:
      'Stage the device on a moody workstation with accent lighting that outlines key hardware and materials.',
  },
  {
    id: 'suggestion-launch',
    title: 'Launch-ready mockups',
    description: 'Minimal packaging mockups ideal for mobile accessories.',
    categoryId: 'mobile_accessories',
    promptIds: ['mobile_accessories-01', 'mobile_accessories-11'],
    customPrompt:
      'Present the product with floating components and soft drop shadows on a clean gradient, ready for a landing page.',
  },
]

function formatRelativeTime(input) {
  if (!input) return ''
  const date = typeof input === 'string' ? new Date(input) : input
  const diffMs = Date.now() - date.getTime()
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const divisions = [
    { amount: 60_000 * 60 * 24, unit: 'day' },
    { amount: 60_000 * 60, unit: 'hour' },
    { amount: 60_000, unit: 'minute' },
  ]

  for (const division of divisions) {
    if (Math.abs(diffMs) >= division.amount) {
      return rtf.format(Math.round(diffMs / division.amount), division.unit)
    }
  }

  return 'just now'
}

function buildPromptSummary(prompts = [], customPrompt = '') {
  const names = prompts
    .map((item) => item?.title || item?.name || '')
    .filter(Boolean)

  if (customPrompt.trim()) {
    names.push(customPrompt.trim())
  }

  if (names.length === 0) return 'Custom directions'
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} + ${names[1]}`
  return `${names.slice(0, 2).join(' + ')} + ${names.length - 2} more`
}

function getStandaloneDefinition(categoryId) {
  if (!categoryId) return null
  return STANDALONE_LOOKUP[categoryId] || null
}

export default function Generator({
  token,
  coins = 0,
  onCoinsChange,
  onSessionComplete,
  onViewImage,
  onRequestTopUp,
  sessions = [],
  activeSessionId,
  onSelectSession,
  onRefreshSessions,
  user,
  onOpenProfile,
}) {
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('')
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([EMPTY_CHAT_MESSAGE])
  const [canvasItems, setCanvasItems] = useState([])
  const [activeCanvasId, setActiveCanvasId] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [historyQuery, setHistoryQuery] = useState('')

  const activeCategory = useMemo(() => getStandaloneDefinition(selectedCategoryId), [selectedCategoryId])
  const activeSubcategories = activeCategory?.subcategories || []
  const hasSubcategoryOptions = activeSubcategories.length > 0
  const filteredPrompts = useMemo(() => activeCategory?.prompts || [], [activeCategory])
  const availablePromptCount = filteredPrompts.length
  const selectedPromptDetails = useMemo(
    () => selectedPromptIds.map((id) => PROMPTS_BY_ID[id]).filter(Boolean),
    [selectedPromptIds],
  )
  const coinsRequired = useMemo(() => {
    const presetCount = selectedPromptIds.length
    const customCount = customPrompt.trim() ? 1 : 0
    return Math.max(presetCount + customCount, 1)
  }, [selectedPromptIds.length, customPrompt])
  const hasEnoughCoins = coins >= coinsRequired

  const activeCanvasItem = useMemo(
    () => canvasItems.find((item) => item.id === activeCanvasId) || null,
    [canvasItems, activeCanvasId],
  )
  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || null,
    [sessions, activeSessionId],
  )

  const filteredHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase()
    if (!query) return sessions
    return sessions.filter((session) => {
      const title = session.title || buildPromptSummary(session.prompts, session.customPrompt)
      return title.toLowerCase().includes(query)
    })
  }, [sessions, historyQuery])

  const resetWorkspace = useCallback(() => {
    setUploadFile(null)
    setUploadPreview('')
    setSelectedCategoryId('')
    setSelectedSubcategoryId('')
    setSelectedPromptIds([])
    setCustomPrompt('')
    setStatusMessage('')
    setErrorMessage('')
    setChatMessages([EMPTY_CHAT_MESSAGE])
    setCanvasItems([])
    setActiveCanvasId(null)
    setActiveImageIndex(0)
  }, [])

  useEffect(() => {
    if (!activeSession) return

    setSelectedCategoryId(activeSession.categoryId || '')
    setSelectedSubcategoryId(activeSession.subcategoryId || '')
    const restoredPromptIds = Array.isArray(activeSession.prompts)
      ? activeSession.prompts
          .map((prompt) => prompt?.id)
          .filter((id) => typeof id === 'string' && PROMPTS_BY_ID[id])
      : []
    setSelectedPromptIds(restoredPromptIds)
    setCustomPrompt(activeSession.customPrompt || '')
    setUploadPreview(typeof activeSession.sourceImage === 'string' ? activeSession.sourceImage : '')
    setUploadFile(null)

    const sessionCanvasItem = {
      id: activeSession.id,
      createdAt: activeSession.createdAt,
      images: Array.isArray(activeSession.generatedImages) ? activeSession.generatedImages : [],
      prompts: Array.isArray(activeSession.prompts) ? activeSession.prompts : [],
      customPrompt: activeSession.customPrompt || '',
      coinsSpent: activeSession.coinsSpent || null,
      sourceImage: activeSession.sourceImage || '',
    }

    setCanvasItems([sessionCanvasItem])
    setActiveCanvasId(activeSession.id)
    setActiveImageIndex(0)

    const promptSummary = buildPromptSummary(sessionCanvasItem.prompts, sessionCanvasItem.customPrompt)
    const hydratedMessages = [
      {
        id: `${activeSession.id}-result`,
        type: 'result',
        timestamp: activeSession.createdAt,
        promptSummary,
        images: sessionCanvasItem.images.slice(0, 3),
        coinsSpent: sessionCanvasItem.coinsSpent || coinsRequired,
        customPrompt: sessionCanvasItem.customPrompt,
      },
    ]

    setChatMessages(hydratedMessages)
  }, [activeSession, coinsRequired])

  const handleStartNewChat = () => {
    resetWorkspace()
    onSelectSession?.(null)
  }

  const handleUploadChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setUploadFile(null)
      setUploadPreview('')
      return
    }

    setUploadFile(file)
    setErrorMessage('')

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setUploadPreview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveUpload = () => {
    setUploadFile(null)
    setUploadPreview('')
  }

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value
    setErrorMessage('')
    setSelectedCategoryId(categoryId)
    setSelectedSubcategoryId('')
    setSelectedPromptIds([])
  }

  const handleSubcategoryChange = (event) => {
    const subcategoryId = event.target.value
    setErrorMessage('')
    setSelectedSubcategoryId(subcategoryId)
    setSelectedPromptIds([])
  }

  const handlePromptSelect = (event) => {
    const promptId = event.target.value
    if (!promptId || selectedPromptIds.includes(promptId)) return
    setSelectedPromptIds((prev) => [...prev, promptId])
    setErrorMessage('')
  }

  const handleRemovePrompt = (promptId) => {
    setSelectedPromptIds((prev) => prev.filter((value) => value !== promptId))
  }

  const buildApiUrl = (path) => `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}${path}`

  const appendMessage = (message) => {
    setChatMessages((previous) => {
      const filtered = previous.filter((entry) => entry.id !== EMPTY_CHAT_MESSAGE.id)
      return [...filtered, message]
    })
  }

  const validateBeforeGenerate = () => {
    if (!token) {
      setErrorMessage('Your session expired. Please log back in to generate assets.')
      return false
    }

    if (!selectedCategoryId) {
      setErrorMessage('Pick a product category to continue.')
      return false
    }

    if (hasSubcategoryOptions && !selectedSubcategoryId) {
      setErrorMessage('Choose a subcategory to continue.')
      return false
    }

    if (availablePromptCount === 0) {
      setErrorMessage('Prompt templates are not yet available for this category.')
      return false
    }

    if (!uploadFile && !uploadPreview) {
      setErrorMessage('Upload a product image to generate variations.')
      return false
    }

    if (!hasEnoughCoins) {
      setErrorMessage(`You need ${coinsRequired} coin${coinsRequired === 1 ? '' : 's'} for this run. Top up to continue.`)
      onRequestTopUp?.()
      return false
    }

    if (selectedPromptIds.length === 0 && !customPrompt.trim()) {
      setErrorMessage('Select at least one preset prompt or provide custom directions.')
      return false
    }

    setErrorMessage('')
    return true
  }

  const handleGenerate = async () => {
    if (!validateBeforeGenerate()) return

    setIsGenerating(true)
    setStatusMessage('Generating variations…')

    const timestamp = new Date().toISOString()
    const promptSummary = buildPromptSummary(selectedPromptDetails, customPrompt)

    appendMessage({
      id: `prompt-${timestamp}`,
      type: 'user',
      timestamp,
      promptSummary,
      customPrompt,
      categoryLabel: activeCategory?.label || '',
      subcategoryLabel:
        activeSubcategories.find((entry) => entry.id === selectedSubcategoryId)?.label || '',
    })

    try {
      const formData = new FormData()
      formData.append('prompts', selectedPromptIds.join(','))
      if (customPrompt.trim()) {
        formData.append('customPrompt', customPrompt.trim())
      }
      if (selectedCategoryId) {
        formData.append('categoryId', selectedCategoryId)
      }
      if (selectedSubcategoryId) {
        formData.append('subcategoryId', selectedSubcategoryId)
      }

      if (uploadFile) {
        formData.append('image', uploadFile)
      } else if (uploadPreview.startsWith('data:')) {
        const response = await fetch(uploadPreview)
        const blob = await response.blob()
        formData.append('image', blob, `upload-${Date.now()}.png`)
      }

      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

      const imageResponse = await fetch(buildApiUrl('/api/generate-images'), {
        method: 'POST',
        body: formData,
        headers: authHeaders,
      })

      if (imageResponse.status === 401) {
        throw new Error('Your session has expired. Please log in again.')
      }

      if (imageResponse.status === 402) {
        const errorBody = await imageResponse.json().catch(() => ({}))
        throw new Error(errorBody?.error || 'You need more coins to generate this set.')
      }

      if (!imageResponse.ok) {
        const errorBody = await imageResponse.json().catch(() => ({}))
        throw new Error(errorBody?.error || 'Image generation failed.')
      }

      const {
        images = [],
        sourceImage: sourceImageUrl,
        prompts: promptMetadata,
        coins: remainingCoins,
        coinsCharged,
      } = await imageResponse.json()

      if (typeof remainingCoins === 'number') {
        onCoinsChange?.(remainingCoins)
      }

      const nextSourceImage = typeof sourceImageUrl === 'string' && sourceImageUrl ? sourceImageUrl : uploadPreview
      setUploadPreview(nextSourceImage)

      const descriptionResponse = await fetch(buildApiUrl('/api/generate-descriptions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          prompts: selectedPromptIds,
          customPrompt: customPrompt.trim(),
          referenceImage: nextSourceImage,
          referenceImageFallback: uploadPreview,
          imageCount: Array.isArray(images) ? images.length : 0,
        }),
      })

      if (descriptionResponse.status === 401) {
        throw new Error('Your session has expired. Please log in again.')
      }

      if (!descriptionResponse.ok) {
        const errorBody = await descriptionResponse.json().catch(() => ({}))
        throw new Error(errorBody?.error || 'Description generation failed.')
      }

      const descriptionPayload = await descriptionResponse.json()
      const parsedDescriptions = Array.isArray(descriptionPayload.descriptions)
        ? descriptionPayload.descriptions
        : []

      const sessionId = crypto.randomUUID()
      const sessionRecord = {
        id: sessionId,
        createdAt: timestamp,
        categoryId: selectedCategoryId,
        categoryLabel: activeCategory?.label || '',
        subcategoryId: selectedSubcategoryId,
        subcategoryLabel:
          activeSubcategories.find((entry) => entry.id === selectedSubcategoryId)?.label || '',
        prompts: promptMetadata || selectedPromptDetails,
        customPrompt: customPrompt.trim(),
        sourceImage: nextSourceImage,
        generatedImages: Array.isArray(images) ? images : [],
        descriptions: parsedDescriptions,
        coinsSpent: typeof coinsCharged === 'number' ? coinsCharged : coinsRequired,
        title: promptSummary,
      }

      onSessionComplete?.(sessionRecord)

      const canvasEntry = {
        id: sessionId,
        createdAt: timestamp,
        images: sessionRecord.generatedImages,
        prompts: sessionRecord.prompts,
        customPrompt: sessionRecord.customPrompt,
        coinsSpent: sessionRecord.coinsSpent,
        sourceImage: nextSourceImage,
      }

      setCanvasItems((previous) => [canvasEntry, ...previous])
      setActiveCanvasId(sessionId)
      setActiveImageIndex(0)

      appendMessage({
        id: `${sessionId}-result`,
        type: 'result',
        timestamp,
        promptSummary,
        images: sessionRecord.generatedImages.slice(0, 3),
        coinsSpent: sessionRecord.coinsSpent,
        customPrompt: sessionRecord.customPrompt,
      })

      setStatusMessage(`Generated ${sessionRecord.generatedImages.length} image${
        sessionRecord.generatedImages.length === 1 ? '' : 's'
      } successfully.`)
      setErrorMessage('')
      onSelectSession?.(sessionId)
      onRefreshSessions?.()
    } catch (error) {
      console.error('Generation failed', error)
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setErrorMessage(message)
      appendMessage({
        id: `error-${Date.now()}`,
        type: 'error',
        timestamp: new Date().toISOString(),
        promptSummary: 'Generation failed',
        body: message,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleHistorySelect = (sessionId) => {
    if (!sessionId) return
    onSelectSession?.(sessionId)
  }

  const activePreviewImage = useMemo(() => {
    if (!activeCanvasItem) return uploadPreview
    const images = Array.isArray(activeCanvasItem.images) ? activeCanvasItem.images : []
    return images[activeImageIndex] || images[0] || uploadPreview
  }, [activeCanvasItem, activeImageIndex, uploadPreview])

  const disableInputs = isGenerating
  const profileInitial = (user?.name || user?.email || 'A').slice(0, 1).toUpperCase()
  const profileLabel = user?.name || user?.email || 'Your profile'
  const profileHint = user ? 'Manage account & preferences' : 'Sign in to save your sessions'
  const isHistoryEmpty = filteredHistory.length === 0
  const showSuggestions =
    chatMessages.length === 1 && chatMessages[0]?.id === EMPTY_CHAT_MESSAGE.id && !isGenerating

  const handleSuggestionSelect = (suggestion) => {
    if (!suggestion) return

    const validPromptIds = Array.isArray(suggestion.promptIds)
      ? suggestion.promptIds.filter((id) => PROMPTS_BY_ID[id])
      : []

    if (suggestion.categoryId) {
      setSelectedCategoryId(suggestion.categoryId)
    }

    if (suggestion.subcategoryId) {
      setSelectedSubcategoryId(suggestion.subcategoryId)
    } else {
      setSelectedSubcategoryId('')
    }

    if (validPromptIds.length > 0) {
      setSelectedPromptIds(validPromptIds)
    } else {
      setSelectedPromptIds([])
    }

    if (suggestion.customPrompt) {
      setCustomPrompt(suggestion.customPrompt)
    }

    setErrorMessage('')
    setStatusMessage('Preset applied. Upload an image and generate to see the results.')
  }

  return (
    <div className="chat-shell">
      <aside className="chat-shell__sidebar">
        <div className="chat-sidebar__top">
          <div className="chat-sidebar__brand">
            <span className="chat-sidebar__logo">PG</span>
            <div className="chat-sidebar__titles">
              <strong>Product Variations</strong>
              <span>AI styling studio</span>
            </div>
          </div>
          <div className="chat-sidebar__buttons">
            <button type="button" className="chat-sidebar__action" onClick={handleStartNewChat}>
              + New variation
            </button>
            <button
              type="button"
              className="chat-sidebar__action chat-sidebar__action--ghost"
              onClick={() => onRefreshSessions?.()}
            >
              Refresh
            </button>
          </div>
        </div>

        <label className="chat-sidebar__search">
          <span className="sr-only">Search sessions</span>
          <input
            type="search"
            placeholder="Search sessions"
            value={historyQuery}
            onChange={(event) => setHistoryQuery(event.target.value)}
          />
        </label>

        <div className="chat-sidebar__history">
          {isHistoryEmpty ? (
            <p className="chat-sidebar__empty">No sessions yet. Generate your first variation to see it here.</p>
          ) : (
            filteredHistory.map((session) => (
              <button
                type="button"
                key={session.id}
                className={`chat-history__item${
                  session.id === activeSessionId ? ' chat-history__item--active' : ''
                }`}
                onClick={() => handleHistorySelect(session.id)}
              >
                <div className="chat-history__thumb">
                  {session.generatedImages?.[0] ? (
                    <img src={session.generatedImages[0]} alt="Session thumbnail" />
                  ) : (
                    <span>📄</span>
                  )}
                </div>
                <div className="chat-history__meta">
                  <strong>{session.title || buildPromptSummary(session.prompts, session.customPrompt)}</strong>
                  <span>{formatRelativeTime(session.createdAt)}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <footer className="chat-sidebar__footer">
          <button type="button" className="chat-sidebar__profile" onClick={() => onOpenProfile?.()}>
            <span className="chat-sidebar__avatar">{profileInitial}</span>
            <div>
              <strong>{profileLabel}</strong>
              <span>{profileHint}</span>
            </div>
          </button>
          <div className="chat-sidebar__wallet">
            <span className="chat-sidebar__coins">🪙 {coins}</span>
            <button type="button" onClick={() => onRequestTopUp?.()}>Buy coins</button>
          </div>
        </footer>
      </aside>

      <section className="chat-shell__main">
        <header className="chat-header">
          <div>
            <h1>What are we styling today?</h1>
            <p>Upload a product image, mix prompt presets, and brief the assistant to craft new looks.</p>
          </div>
        </header>

        <div className="chat-body">
          <section className="chat-thread">
            <div className="chat-thread__messages">
              {showSuggestions && (
                <div className="chat-suggestions">
                  <div className="chat-suggestions__header">
                    <span>Popular starter briefs</span>
                    <p>Pick one and tweak the details to move even faster.</p>
                  </div>
                  <div className="chat-suggestions__grid">
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="chat-suggestion"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <strong>{suggestion.title}</strong>
                        <span>{suggestion.description}</span>
                        <em>Apply preset</em>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((message) => {
                const roleLabel =
                  message.type === 'user'
                    ? 'You'
                    : message.type === 'result'
                    ? 'Assistant'
                    : 'System'
                const headline = message.headline || null
                const description = message.promptSummary || message.body || ''

                return (
                  <article key={message.id} className={`chat-message chat-message--${message.type}`}>
                    <header className="chat-message__header">
                      <span>{roleLabel}</span>
                      {message.timestamp && <time>{formatRelativeTime(message.timestamp)}</time>}
                    </header>
                    {headline && <h3 className="chat-message__headline">{headline}</h3>}
                    {description && <p className="chat-message__content">{description}</p>}
                    {message.images && message.images.length > 0 && (
                      <div className="chat-message__images">
                        {message.images.map((imageUrl, index) => (
                          <button
                            key={`${message.id}-preview-${index}`}
                            type="button"
                            onClick={() =>
                              onViewImage?.({ src: imageUrl, alt: `Generated variation ${index + 1}` })
                            }
                          >
                            <img src={imageUrl} alt={`Generated variation ${index + 1}`} />
                          </button>
                        ))}
                      </div>
                    )}
                    {message.coinsSpent && (
                      <footer className="chat-message__footer">
                        {message.coinsSpent} coin{message.coinsSpent === 1 ? '' : 's'} used
                      </footer>
                    )}
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="chat-preview">
            {activePreviewImage ? (
              <button
                type="button"
                className="chat-preview__image"
                onClick={() => onViewImage?.({ src: activePreviewImage, alt: 'Generated variation' })}
              >
                <img src={activePreviewImage} alt="Generated preview" />
              </button>
            ) : (
              <div className="chat-preview__empty">
                <p>Canvas is waiting. Generate a look to see it here.</p>
              </div>
            )}

            {activeCanvasItem && activeCanvasItem.images.length > 1 && (
              <div className="chat-preview__thumbnails">
                {activeCanvasItem.images.map((imageUrl, index) => (
                  <button
                    type="button"
                    key={`${activeCanvasItem.id}-thumb-${index}`}
                    className={`chat-preview__thumb${
                      index === activeImageIndex ? ' chat-preview__thumb--active' : ''
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={imageUrl} alt={`Variation ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {activeCanvasItem && (
              <footer className="chat-preview__meta">
                <span>{formatRelativeTime(activeCanvasItem.createdAt)}</span>
                <span>{buildPromptSummary(activeCanvasItem.prompts, activeCanvasItem.customPrompt)}</span>
                {typeof activeCanvasItem.coinsSpent === 'number' && (
                  <span>{activeCanvasItem.coinsSpent} coin{activeCanvasItem.coinsSpent === 1 ? '' : 's'}</span>
                )}
              </footer>
            )}
          </aside>
        </div>

        <div className="chat-composer">
          <div className="chat-composer__grid">
            <label className="chat-upload">
              <input type="file" accept="image/*" onChange={handleUploadChange} disabled={disableInputs} />
              {uploadPreview ? 'Replace image' : 'Upload reference'}
            </label>

            <select
              className="chat-select"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              disabled={disableInputs}
            >
              <option value="">Category</option>
              {STANDALONE_DEFINITIONS.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              className="chat-select"
              value={selectedSubcategoryId}
              onChange={handleSubcategoryChange}
              disabled={disableInputs || !hasSubcategoryOptions}
            >
              <option value="">Subcategory</option>
              {activeSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.label}
                </option>
              ))}
            </select>

            <select
              className="chat-select"
              value=""
              onChange={handlePromptSelect}
              disabled={disableInputs || availablePromptCount === 0}
            >
              <option value="">Prompt preset</option>
              {filteredPrompts
                .filter((prompt) => !selectedPromptIds.includes(prompt.id))
                .map((prompt) => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.title}
                  </option>
                ))}
            </select>

            <input
              type="text"
              className="chat-input"
              placeholder="Add custom directions"
              value={customPrompt}
              onChange={(event) => setCustomPrompt(event.target.value)}
              disabled={disableInputs}
            />

            <button type="button" className="chat-generate" onClick={handleGenerate} disabled={disableInputs}>
              {isGenerating
                ? 'Generating…'
                : `Generate (${coinsRequired} coin${coinsRequired === 1 ? '' : 's'})`}
            </button>
          </div>

          {(uploadPreview || selectedPromptDetails.length > 0 || customPrompt.trim()) && (
            <div className="chat-chips">
              {uploadPreview && (
                <button
                  type="button"
                  className="chat-chip chat-chip--image"
                  onClick={handleRemoveUpload}
                  disabled={disableInputs}
                >
                  Image selected ×
                </button>
              )}
              {selectedPromptDetails.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  className="chat-chip"
                  onClick={() => handleRemovePrompt(prompt.id)}
                  disabled={disableInputs}
                >
                  {prompt.title} ×
                </button>
              ))}
              {customPrompt.trim() && (
                <span className="chat-chip chat-chip--custom">{customPrompt.trim()}</span>
              )}
            </div>
          )}

          {errorMessage && <p className="chat-status chat-status--error">{errorMessage}</p>}
          {statusMessage && !errorMessage && (
            <p className="chat-status chat-status--info">{statusMessage}</p>
          )}
        </div>
      </section>
    </div>
  )
}
