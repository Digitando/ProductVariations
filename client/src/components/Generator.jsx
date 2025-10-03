import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

function CheckMarkIcon(props) {
  return (
    <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 5.5 4.5 9 13 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path d="M3 3l6 6M9 3 3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
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
  const [openMenu, setOpenMenu] = useState(null)
  const composerRef = useRef(null)
  const menuRefs = useRef({ category: [], subcategory: [], prompts: [] })

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
    setOpenMenu(null)
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

  const handleCategoryChange = (input) => {
    const categoryId = typeof input === 'string' ? input : input?.target?.value || ''
    setErrorMessage('')
    setSelectedCategoryId(categoryId)
    setSelectedSubcategoryId('')
    setSelectedPromptIds([])
  }

  const handleSubcategoryChange = (input) => {
    const subcategoryId = typeof input === 'string' ? input : input?.target?.value || ''
    setErrorMessage('')
    setSelectedSubcategoryId(subcategoryId)
    setSelectedPromptIds([])
  }

  const handlePromptToggle = (promptId) => {
    if (!promptId) return
    setSelectedPromptIds((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((value) => value !== promptId)
      }
      return [...prev, promptId]
    })
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
    setOpenMenu(null)
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
    setOpenMenu(null)
  }

  const toggleMenu = (menu, { disabled } = {}) => {
    if (disabled) return
    setOpenMenu((previous) => (previous === menu ? null : menu))
  }

  const closeMenu = () => setOpenMenu(null)

  const registerMenuItem = (menu, index) => (element) => {
    if (!menuRefs.current[menu]) {
      menuRefs.current[menu] = []
    }
    menuRefs.current[menu][index] = element
  }

  const focusMenuItem = (menu, index) => {
    const items = (menuRefs.current[menu] || []).filter(Boolean)
    if (!items.length) return
    const next = items[(index + items.length) % items.length]
    if (next) {
      next.focus()
    }
  }

  const handleMenuKeyDown = (event, menu) => {
    const items = (menuRefs.current[menu] || []).filter(Boolean)
    if (!items.length) return

    const currentIndex = items.indexOf(document.activeElement)
    const safeIndex = currentIndex >= 0 ? currentIndex : 0

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusMenuItem(menu, safeIndex + 1)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusMenuItem(menu, safeIndex - 1)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusMenuItem(menu, 0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusMenuItem(menu, items.length - 1)
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const offset = event.shiftKey ? -1 : 1
      focusMenuItem(menu, safeIndex + offset)
    }
  }

  useEffect(() => {
    if (!openMenu || typeof document === 'undefined') {
      return undefined
    }

    const handleClick = (event) => {
      if (!composerRef.current) return
      if (!composerRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [openMenu])

  useEffect(() => {
    if (!openMenu || typeof window === 'undefined') {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
    window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMenu])

  useEffect(() => {
    if (!openMenu) return
    const items = (menuRefs.current[openMenu] || []).filter(Boolean)
    if (items.length > 0) {
      items[0].focus()
    }
  }, [openMenu, filteredPrompts.length, activeSubcategories.length])

  const selectedCategoryLabel = activeCategory?.label || 'Choose category'
  const selectedSubcategoryLabel = selectedSubcategoryId
    ? activeSubcategories.find((entry) => entry.id === selectedSubcategoryId)?.label || 'Select subcategory'
    : 'Select subcategory'

  menuRefs.current.category = []
  menuRefs.current.subcategory = []
  menuRefs.current.prompts = []

  return (
    <div className="chat-shell">
      <aside className="chat-shell__sidebar">
        <div className="chat-sidebar__top">
          <div className="chat-sidebar__brand">
            <img src="/logo.png" alt="MetaVariant" className="chat-sidebar__logo" />
            <div className="chat-sidebar__titles">
              <strong>MetaVariant</strong>
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
                    <img
                      src={session.generatedImages[0]}
                      alt="Session thumbnail"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span>📄</span>';
                      }}
                    />
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

        <div className={`chat-body${activePreviewImage ? ' chat-body--split' : ''}`}>
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

          {activePreviewImage && <aside className="chat-preview">
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
          </aside>}
        </div>

        <div className="chat-composer" ref={composerRef}>
          <div className="chat-composer__bar">
            <div className="chat-composer__control-wrapper">
              <button
                type="button"
                className={`chat-composer__control${openMenu === 'category' ? ' chat-composer__control--active' : ''}`}
                onClick={() => toggleMenu('category', { disabled: disableInputs })}
                disabled={disableInputs}
                aria-haspopup="true"
                aria-expanded={openMenu === 'category'}
              >
                <span className="chat-composer__control-label">Category</span>
                <span className="chat-composer__control-value">{selectedCategoryLabel}</span>
              </button>
              {openMenu === 'category' && (
                <div
                  className="chat-menu"
                  role="menu"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => handleMenuKeyDown(event, 'category')}
                >
                  <div className="chat-menu__list">
                    {STANDALONE_DEFINITIONS.map((category, index) => {
                      const isActive = category.id === selectedCategoryId
                      return (
                        <button
                          key={category.id}
                          type="button"
                          className={`chat-menu__item${isActive ? ' chat-menu__item--selected' : ''}`}
                          onClick={() => {
                            handleCategoryChange(category.id)
                            setOpenMenu(null)
                          }}
                          role="menuitemradio"
                          aria-checked={isActive}
                          ref={registerMenuItem('category', index)}
                        >
                          <span>{category.label}</span>
                          {isActive && <span className="chat-menu__check"><CheckMarkIcon /></span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {hasSubcategoryOptions && (
              <div className="chat-composer__control-wrapper">
                <button
                  type="button"
                  className={`chat-composer__control${
                    openMenu === 'subcategory' ? ' chat-composer__control--active' : ''
                  }`}
                  onClick={() => toggleMenu('subcategory', { disabled: disableInputs })}
                  disabled={disableInputs}
                  aria-haspopup="true"
                  aria-expanded={openMenu === 'subcategory'}
                >
                  <span className="chat-composer__control-label">Subcategory</span>
                  <span className="chat-composer__control-value">
                    {selectedSubcategoryId ? selectedSubcategoryLabel : 'Choose subcategory'}
                  </span>
                </button>
                {openMenu === 'subcategory' && (
                  <div
                    className="chat-menu"
                    role="menu"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => handleMenuKeyDown(event, 'subcategory')}
                  >
                    <div className="chat-menu__list">
                      {activeSubcategories.map((subcategory, index) => {
                        const isActive = subcategory.id === selectedSubcategoryId
                        return (
                          <button
                            key={subcategory.id}
                            type="button"
                            className={`chat-menu__item${isActive ? ' chat-menu__item--selected' : ''}`}
                            onClick={() => {
                              handleSubcategoryChange(subcategory.id)
                              closeMenu()
                            }}
                            role="menuitemradio"
                            aria-checked={isActive}
                            ref={registerMenuItem('subcategory', index)}
                          >
                            <span>{subcategory.label}</span>
                            {isActive && <span className="chat-menu__check"><CheckMarkIcon /></span>}
                          </button>
                        )
                      })}
                      {activeSubcategories.length === 0 && (
                        <p className="chat-menu__empty">No subcategories available.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="chat-composer__control-wrapper">
              <button
                type="button"
                className={`chat-composer__control${
                  openMenu === 'prompts' ? ' chat-composer__control--active' : ''
                }${availablePromptCount === 0 ? ' chat-composer__control--disabled' : ''}`}
                onClick={() =>
                  toggleMenu('prompts', {
                    disabled: disableInputs || availablePromptCount === 0,
                  })
                }
                disabled={disableInputs || availablePromptCount === 0}
                aria-haspopup="true"
                aria-expanded={openMenu === 'prompts'}
              >
                <span className="chat-composer__control-label">Prompt presets</span>
                <span className="chat-composer__control-value">
                  {selectedPromptIds.length > 0
                    ? `${selectedPromptIds.length} selected`
                    : availablePromptCount === 0
                    ? 'No presets'
                    : 'Choose presets'}
                </span>
              </button>
              {openMenu === 'prompts' && (
                <div
                  className="chat-menu chat-menu--wide"
                  role="menu"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => handleMenuKeyDown(event, 'prompts')}
                >
                  <header className="chat-menu__header">
                    <strong>Prompt presets</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPromptIds([])
                        setOpenMenu(null)
                      }}
                    >
                      Clear
                    </button>
                  </header>
                  <div className="chat-menu__list chat-menu__list--scroll">
                    {filteredPrompts.length === 0 ? (
                      <p className="chat-menu__empty">
                        Choose a category to see prompt suggestions.
                      </p>
                    ) : (
                      filteredPrompts.map((prompt, index) => {
                        const isSelected = selectedPromptIds.includes(prompt.id)
                        const name = prompt.title || prompt.name || 'Prompt preset'
                        const description = prompt.description || prompt.prompt || ''
                        return (
                          <button
                            key={prompt.id}
                            type="button"
                            className={`chat-menu__item chat-menu__item--dense${
                              isSelected ? ' chat-menu__item--selected' : ''
                            }`}
                            onClick={() => handlePromptToggle(prompt.id)}
                            role="menuitemcheckbox"
                            aria-checked={isSelected}
                            ref={registerMenuItem('prompts', index)}
                          >
                            <div className="chat-menu__item-body">
                              <strong>{name}</strong>
                              {description && <span>{description}</span>}
                            </div>
                            {isSelected && <span className="chat-menu__check"><CheckMarkIcon /></span>}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <label className="chat-composer__upload">
              <input type="file" accept="image/*" onChange={handleUploadChange} disabled={disableInputs} />
              <span className="chat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M16.5 6.5 9.5 13.5a2.5 2.5 0 1 0 3.54 3.54l6.5-6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7 6.46 12.54a4 4 0 1 0 5.66 5.66L19 11.32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sr-only">{uploadPreview ? 'Replace reference image' : 'Attach reference image'}</span>
            </label>

            <div className="chat-composer__input">
              <input
                type="text"
                placeholder="Describe the look you want"
                value={customPrompt}
                onChange={(event) => setCustomPrompt(event.target.value)}
                disabled={disableInputs}
              />
            </div>

            <button type="button" className="chat-composer__generate" onClick={handleGenerate} disabled={disableInputs}>
              <span className="chat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M3 11.5 21 3l-8.5 18-.9-7.6L3 11.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sr-only">
                {isGenerating
                  ? 'Generating variations'
                  : `Generate ${coinsRequired} coin${coinsRequired === 1 ? '' : 's'}`}
              </span>
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
                  aria-label="Remove reference image"
                >
                  <span className="chat-chip__label">Reference attached</span>
                  <span className="chat-chip__icon">
                    <CloseIcon />
                  </span>
                </button>
              )}
              {selectedPromptDetails.map((prompt) => {
                const label = prompt.title || prompt.name || 'Prompt preset'
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className="chat-chip"
                    onClick={() => handleRemovePrompt(prompt.id)}
                    disabled={disableInputs}
                    aria-label={`Remove ${label}`}
                  >
                    <span className="chat-chip__label">{label}</span>
                    <span className="chat-chip__icon">
                      <CloseIcon />
                    </span>
                  </button>
                )
              })}
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
