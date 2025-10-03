import { useCallback, useEffect, useMemo, useState } from 'react'
import * as promptCatalogModule from '@shared/promptCatalog.cjs'
import '../styles/Generator.css'
import '../styles/Workspace.css'

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

  return (
    <div className="workspace">
      <header className="workspace-header">
        <button type="button" className="workspace-header__profile" onClick={() => onOpenProfile?.()}>
          <span className="workspace-header__avatar">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
          </span>
          <div className="workspace-header__meta">
            <strong>{user?.name || user?.email || 'Profile'}</strong>
            {user?.email && <span>{user.email}</span>}
          </div>
        </button>
        <div className="workspace-header__coins">
          <span className="workspace-header__coins-label">Coins</span>
          <strong>🪙 {coins}</strong>
          <button type="button" className="workspace-header__coins-button" onClick={() => onRequestTopUp?.()}>
            Buy more
          </button>
        </div>
        <div className="workspace-header__actions">
          <button type="button" className="workspace-header__secondary" onClick={handleStartNewChat}>
            New chat
          </button>
        </div>
      </header>

      <div className="workspace-body">
        <section className="workspace-main">
          <div className="control-bar">
            <label className="control-bar__item control-bar__upload" aria-label="Upload image">
              <input type="file" accept="image/*" onChange={handleUploadChange} disabled={disableInputs} />
              {uploadPreview ? 'Replace image' : 'Upload image'}
            </label>

            <select
              className="control-bar__item"
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
              className="control-bar__item"
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
              className="control-bar__item"
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
              className="control-bar__item control-bar__custom"
              placeholder="Custom prompt"
              value={customPrompt}
              onChange={(event) => setCustomPrompt(event.target.value)}
              disabled={disableInputs}
            />

            <button
              type="button"
              className="control-bar__generate"
              onClick={handleGenerate}
              disabled={disableInputs}
            >
              {isGenerating ? 'Generating…' : `Generate (${coinsRequired} coin${coinsRequired === 1 ? '' : 's'})`}
            </button>
          </div>

          {(uploadPreview || selectedPromptDetails.length > 0 || customPrompt.trim()) && (
            <div className="control-bar__chips">
              {uploadPreview && (
                <button
                  type="button"
                  className="control-chip control-chip--image"
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
                  className="control-chip"
                  onClick={() => handleRemovePrompt(prompt.id)}
                  disabled={disableInputs}
                >
                  {prompt.title} ×
                </button>
              ))}
              {customPrompt.trim() && <span className="control-chip control-chip--custom">{customPrompt.trim()}</span>}
            </div>
          )}

          {errorMessage && <p className="workspace-status workspace-status--error">{errorMessage}</p>}
          {statusMessage && !errorMessage && (
            <p className="workspace-status workspace-status--info">{statusMessage}</p>
          )}

          <div className="workspace-canvas">
            {activePreviewImage ? (
              <div className="workspace-canvas__preview">
                <img
                  src={activePreviewImage}
                  alt="Generated preview"
                  onClick={() =>
                    onViewImage?.({ src: activePreviewImage, alt: 'Generated variation' })
                  }
                />
              </div>
            ) : (
              <div className="workspace-canvas__empty">
                <p>Canvas is empty. Generate a look to see it here.</p>
              </div>
            )}

            {activeCanvasItem && activeCanvasItem.images.length > 1 && (
              <div className="workspace-canvas__thumbnails">
                {activeCanvasItem.images.map((imageUrl, index) => (
                  <button
                    type="button"
                    key={`${activeCanvasItem.id}-thumb-${index}`}
                    className={`workspace-canvas__thumb${index === activeImageIndex ? ' workspace-canvas__thumb--active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={imageUrl} alt={`Variation ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {activeCanvasItem && (
              <footer className="workspace-canvas__meta">
                <span>{formatRelativeTime(activeCanvasItem.createdAt)}</span>
                <span>{buildPromptSummary(activeCanvasItem.prompts, activeCanvasItem.customPrompt)}</span>
                {typeof activeCanvasItem.coinsSpent === 'number' && (
                  <span>{activeCanvasItem.coinsSpent} coin{activeCanvasItem.coinsSpent === 1 ? '' : 's'}</span>
                )}
              </footer>
            )}
          </div>

          <section className="workspace-chat">
            <header className="workspace-chat__header">
              <h2>Chat</h2>
            </header>
            <div className="workspace-chat__stream">
              {chatMessages.map((message) => (
                <article key={message.id} className={`chat-message chat-message--${message.type}`}>
                  <header>
                    <strong>
                      {message.type === 'user'
                        ? 'You'
                        : message.type === 'result'
                        ? 'Variations ready'
                        : 'System'}
                    </strong>
                    {message.timestamp && <span>{formatRelativeTime(message.timestamp)}</span>}
                  </header>
                  <p>{message.promptSummary || message.body}</p>
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
                    <footer>{message.coinsSpent} coin{message.coinsSpent === 1 ? '' : 's'} used</footer>
                  )}
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="workspace-history">
          <header className="workspace-history__header">
            <h2>History</h2>
            <button type="button" className="workspace-header__secondary" onClick={() => onRefreshSessions?.()}>
              Refresh
            </button>
          </header>
          <input
            type="search"
            className="workspace-history__search"
            placeholder="Search chats"
            value={historyQuery}
            onChange={(event) => setHistoryQuery(event.target.value)}
          />
          <div className="workspace-history__list">
            {filteredHistory.length === 0 ? (
              <p className="workspace-history__empty">No chats yet. Generate your first look.</p>
            ) : (
              filteredHistory.map((session) => (
                <button
                  type="button"
                  key={session.id}
                  className={`history-item${session.id === activeSessionId ? ' history-item--active' : ''}`}
                  onClick={() => handleHistorySelect(session.id)}
                >
                  <div className="history-item__thumb">
                    {session.generatedImages?.[0] ? (
                      <img src={session.generatedImages[0]} alt="Session thumbnail" />
                    ) : (
                      <span>📄</span>
                    )}
                  </div>
                  <div className="history-item__meta">
                    <strong>{session.title || buildPromptSummary(session.prompts, session.customPrompt)}</strong>
                    <span>{formatRelativeTime(session.createdAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
