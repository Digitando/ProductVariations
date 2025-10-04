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
    id: 'suggestion-beauty-hero-glow',
    title: 'Beauty hero glow',
    description: 'Studio hero for skincare bottles with luminous reflections.',
    categoryId: 'beauty_cosmetics',
    subcategoryId: 'beauty_cosmetics_skincare',
    promptIds: ['beauty_cosmetics-01', 'beauty_cosmetics-03'],
    customPrompt:
      'Dial up reflective acrylic blocks and dewy highlights so the packaging looks ultra-premium and editorial ready.',
  },
  {
    id: 'suggestion-beauty-fragrance',
    title: 'Fragrance spotlight',
    description: 'Perfume hero with dreamy backlight and diffusion.',
    categoryId: 'beauty_cosmetics',
    subcategoryId: 'beauty_cosmetics_fragrances',
    promptIds: ['beauty_cosmetics-03', 'beauty_cosmetics-11'],
    customPrompt:
      'Add a soft bokeh glow and a mirrored base so the bottle looks like a campaign visual.',
  },
  {
    id: 'suggestion-beauty-flatlay',
    title: 'Routine flat lay',
    description: 'Organised makeup story for a morning routine post.',
    categoryId: 'beauty_cosmetics',
    subcategoryId: 'beauty_cosmetics_makeup',
    promptIds: ['beauty_cosmetics-02', 'beauty_cosmetics-06'],
    customPrompt:
      'Style brushes, palettes, and lifestyle props in a tidy grid with soft top-down daylight and linen texture.',
  },
  {
    id: 'suggestion-beauty-nightstand',
    title: 'Nightstand ritual',
    description: 'Cozy bedside skincare vignette with warm lighting.',
    categoryId: 'beauty_cosmetics',
    subcategoryId: 'beauty_cosmetics_skincare',
    promptIds: ['beauty_cosmetics-12', 'beauty_cosmetics-13'],
    customPrompt:
      'Include a wood nightstand, glowing lamp, and hardcover book to sell the relaxing bedtime ritual.',
  },
  {
    id: 'suggestion-supplements-morning',
    title: 'Morning wellness bar',
    description: 'Bright kitchen counter with vitamins and citrus props.',
    categoryId: 'health_supplements',
    subcategoryId: 'vitamins_minerals',
    promptIds: ['health_supplements-01', 'health_supplements-06'],
    customPrompt:
      'Style sliced citrus, a water glass, and morning sun streaks to reinforce a healthy start to the day.',
  },
  {
    id: 'suggestion-supplements-gym',
    title: 'Gym bag essentials',
    description: 'Workout flatlay for protein and shaker bottles.',
    categoryId: 'health_supplements',
    subcategoryId: 'workout_supplements',
    promptIds: ['health_supplements-07', 'health_supplements-08'],
    customPrompt:
      'Include a textured rubber floor, dumbbells, and a towel for a gritty, high-energy training vibe.',
  },
  {
    id: 'suggestion-supplements-lineup',
    title: 'Product line family',
    description: 'Tiered podium display for a full supplement range.',
    categoryId: 'health_supplements',
    subcategoryId: 'protein_powders',
    promptIds: ['health_supplements-02', 'health_supplements-10'],
    customPrompt:
      'Arrange the full SKU lineup on cylindrical risers with a soft gradient background and clean reflections.',
  },
  {
    id: 'suggestion-fitness-motion',
    title: 'Dynamic fitness motion',
    description: 'Energetic studio look for equipment in action.',
    categoryId: 'fitness_sport',
    subcategoryId: 'fitness_sport_equipment',
    promptIds: ['fitness_sport-01', 'fitness_sport-10'],
    customPrompt:
      'Add motion streaks and angled rim lights so the gear reads powerful and high-performance.',
  },
  {
    id: 'suggestion-fitness-lookbook',
    title: 'Athletic lookbook',
    description: 'Apparel showcase on mannequins with bold contrast.',
    categoryId: 'fitness_sport',
    subcategoryId: 'fitness_sport_apparel',
    promptIds: ['fitness_sport-02', 'fitness_sport-05'],
    customPrompt:
      'Shoot the outfit on headless mannequins with a saturated gradient background and dramatic sidelight.',
  },
  {
    id: 'suggestion-fitness-homegym',
    title: 'Home gym setup',
    description: 'Compact home workout corner styling.',
    categoryId: 'fitness_sport',
    subcategoryId: 'fitness_sport_machines',
    promptIds: ['fitness_sport-04', 'fitness_sport-06'],
    customPrompt:
      'Place the gear on hardwood floor with a plant and smart speaker to show an aspirational condo gym.',
  },
  {
    id: 'suggestion-electronics-desktop',
    title: 'Creator desk hero',
    description: 'Laptop and monitor workstation with neon accents.',
    categoryId: 'electronics',
    subcategoryId: 'electronics_laptops',
    promptIds: ['electronics-01', 'electronics-10'],
    customPrompt:
      'Light with cyan-magenta gradients and include stylus + notebook to emphasise creative pro workflow.',
  },
  {
    id: 'suggestion-electronics-unboxing',
    title: 'Unboxing layout',
    description: 'Clean unboxing spread for smartphone launch.',
    categoryId: 'electronics',
    subcategoryId: 'electronics_smartphones',
    promptIds: ['electronics-02', 'electronics-05'],
    customPrompt:
      'Arrange box components neatly with soft shadows and add subtle depth haze for a premium unboxing feel.',
  },
  {
    id: 'suggestion-electronics-tablet',
    title: 'Tablet productivity',
    description: 'Tablet with keyboard in a modern office nook.',
    categoryId: 'electronics',
    subcategoryId: 'electronics_tablets',
    promptIds: ['electronics-03', 'electronics-12'],
    customPrompt:
      'Include stylus notes, task lists, and a blurred city window to sell remote productivity vibes.',
  },
  {
    id: 'suggestion-mobile-case',
    title: 'Case colour wall',
    description: 'Gradient wall of cases for a bold merchandising shot.',
    categoryId: 'mobile_accessories',
    subcategoryId: 'mobile_accessories_cases',
    promptIds: ['mobile_accessories-01', 'mobile_accessories-10'],
    customPrompt:
      'Display multiple case colours on floating pegs with directional light for crisp drop shadows.',
  },
  {
    id: 'suggestion-mobile-nightstand',
    title: 'Nightstand charging',
    description: 'Wireless charging vignette in a calming bedroom.',
    categoryId: 'mobile_accessories',
    subcategoryId: 'mobile_accessories_chargers',
    promptIds: ['mobile_accessories-02', 'mobile_accessories-05'],
    customPrompt:
      'Style a linen nightstand with lamp glow, hardcover book, and ambient bokeh to emphasise wind-down charging.',
  },
  {
    id: 'suggestion-mobile-audio',
    title: 'Pocketable audio drop',
    description: 'Earbuds on reflective surface with water droplet detail.',
    categoryId: 'mobile_accessories',
    subcategoryId: 'mobile_accessories_audio',
    promptIds: ['mobile_accessories-03', 'mobile_accessories-12'],
    customPrompt:
      'Add subtle water droplets and LED accents to emphasise rugged, sweat-ready earbuds.',
  },
  {
    id: 'suggestion-appliance-kitchen',
    title: 'Kitchen hero island',
    description: 'Appliance staged on marble island with ingredients.',
    categoryId: 'home_appliances',
    subcategoryId: 'home_appliances_kitchen',
    promptIds: ['home_appliances-01', 'home_appliances-04'],
    customPrompt:
      'Include fresh produce, utensils, and rim lights so the appliance looks ready for a recipe reel.',
  },
  {
    id: 'suggestion-appliance-clean',
    title: 'Laundry refresh',
    description: 'Cleaning appliance hero with folded towels.',
    categoryId: 'home_appliances',
    subcategoryId: 'home_appliances_cleaning',
    promptIds: ['home_appliances-02', 'home_appliances-11'],
    customPrompt:
      'Stage a bright utility room with stacked towels and sunlight to communicate fresh, efficient cleaning.',
  },
  {
    id: 'suggestion-furniture-lounge',
    title: 'Living room lounge',
    description: 'Sectional styling with cozy lighting and decor.',
    categoryId: 'furniture_decor',
    subcategoryId: 'furniture_decor_seating',
    promptIds: ['furniture_decor-01', 'furniture_decor-05'],
    customPrompt:
      'Style layered throws, coffee table books, and warm floor lamps to build a catalog-ready living room.',
  },
  {
    id: 'suggestion-furniture-lighting',
    title: 'Statement lighting',
    description: 'Sculptural lamp hero on a minimalist set.',
    categoryId: 'furniture_decor',
    subcategoryId: 'furniture_decor_lighting',
    promptIds: ['furniture_decor-02', 'furniture_decor-11'],
    customPrompt:
      'Use a dark-to-light gradient backdrop and gentle fog to highlight the lamp glow and material finish.',
  },
  {
    id: 'suggestion-food-coffee',
    title: 'Cafe-style pour',
    description: 'Gourmet beverage setup with steam and props.',
    categoryId: 'food_beverage',
    subcategoryId: 'food_beverage_drinks',
    promptIds: ['food_beverage-01', 'food_beverage-06'],
    customPrompt:
      'Capture steam trails, latte art, and small pastries on rustic wood to mimic an artisan coffee shop.',
  },
  {
    id: 'suggestion-food-hydration',
    title: 'Functional hydration',
    description: 'Electrolyte drink hero for wellness campaigns.',
    categoryId: 'food_beverage',
    subcategoryId: 'food_beverage_health',
    promptIds: ['food_beverage-02', 'food_beverage-10'],
    customPrompt:
      'Incorporate sliced fruit, condensation, and a bright gradient to communicate energising hydration.',
  },
  {
    id: 'suggestion-outdoor-camping',
    title: 'Camp setup overview',
    description: 'Camping bundle laid out on scenic campsite.',
    categoryId: 'outdoor_travel',
    subcategoryId: 'outdoor_travel_camping',
    promptIds: ['outdoor_travel-01', 'outdoor_travel-04'],
    customPrompt:
      'Include tent, lantern, and boots arranged on pine needles with golden hour lighting for an adventurous mood.',
  },
  {
    id: 'suggestion-outdoor-backpack',
    title: 'Backpack load-out',
    description: 'Travel backpack hero with organised contents.',
    categoryId: 'outdoor_travel',
    subcategoryId: 'outdoor_travel_backpacks',
    promptIds: ['outdoor_travel-02', 'outdoor_travel-11'],
    customPrompt:
      'Lay out travel essentials around the pack on a concrete floor with directional light for crisp product edges.',
  },
  {
    id: 'suggestion-tech-minimal',
    title: 'Minimal desk drop',
    description: 'Three-product tech hero on glass desk.',
    categoryId: 'electronics',
    subcategoryId: 'electronics_laptops',
    promptIds: ['electronics-04', 'electronics-06'],
    customPrompt:
      'Use a smoked glass desk with floating shelves and cool temperature lighting for a modern spec-sheet feel.',
  },
  {
    id: 'suggestion-fitness-recovery',
    title: 'Recovery essentials',
    description: 'Massage gun and recovery tools set.',
    categoryId: 'fitness_sport',
    subcategoryId: 'fitness_sport_equipment',
    promptIds: ['fitness_sport-03', 'fitness_sport-12'],
    customPrompt:
      'Highlight foam rollers, massage gun, and calming blues to communicate post-workout relief.',
  },
  {
    id: 'suggestion-mobile-bundle',
    title: 'Accessory bundle',
    description: 'Starter kit of charger, buds, and case.',
    categoryId: 'mobile_accessories',
    promptIds: ['mobile_accessories-04', 'mobile_accessories-07', 'mobile_accessories-13'],
    customPrompt:
      'Lay accessories on a color-blocked surface with top-down lighting for a merch-ready starter bundle.',
  },
]

const SUGGESTIONS_PER_SLIDE = 4

const QUICK_SUGGESTION_SLIDES = Array.from({ length: Math.ceil(QUICK_SUGGESTIONS.length / SUGGESTIONS_PER_SLIDE) })
  .map((_, index) =>
    QUICK_SUGGESTIONS.slice(index * SUGGESTIONS_PER_SLIDE, index * SUGGESTIONS_PER_SLIDE + SUGGESTIONS_PER_SLIDE),
  )

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
  const [activeSuggestionSlide, setActiveSuggestionSlide] = useState(0)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const suggestionSlides = QUICK_SUGGESTION_SLIDES
  const totalSuggestionSlides = suggestionSlides.length || 1

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

  useEffect(() => {
    if (showSuggestions) {
      setActiveSuggestionSlide(0)
    }
  }, [showSuggestions])

  useEffect(() => {
    if (!showSuggestions || totalSuggestionSlides <= 1) {
      return undefined
    }

    const timer = setInterval(() => {
      setActiveSuggestionSlide((previous) => (previous + 1) % totalSuggestionSlides)
    }, 6500)

    return () => clearInterval(timer)
  }, [showSuggestions, totalSuggestionSlides])

  const handleNextSuggestionSlide = useCallback(() => {
    setActiveSuggestionSlide((previous) => (previous + 1) % totalSuggestionSlides)
  }, [totalSuggestionSlides])

  const handlePrevSuggestionSlide = useCallback(() => {
    setActiveSuggestionSlide((previous) => (previous - 1 + totalSuggestionSlides) % totalSuggestionSlides)
  }, [totalSuggestionSlides])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true)
  }, [])

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false)
  }, [])

  const bodyOverflowRef = useRef(null)

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const { style } = document.body

    if (mobileSidebarOpen) {
      if (bodyOverflowRef.current === null) {
        bodyOverflowRef.current = style.overflow || ''
      }
      style.overflow = 'hidden'
    } else if (bodyOverflowRef.current !== null) {
      style.overflow = bodyOverflowRef.current
      bodyOverflowRef.current = null
    }

    return () => {
      if (bodyOverflowRef.current !== null) {
        style.overflow = bodyOverflowRef.current
        bodyOverflowRef.current = null
      }
    }
  }, [mobileSidebarOpen])

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

  const sidebarClass = `chat-shell__sidebar${mobileSidebarOpen ? ' chat-shell__sidebar--open' : ''}`

  return (
    <div className={`chat-shell${mobileSidebarOpen ? ' chat-shell--sidebar-open' : ''}`}>
      {mobileSidebarOpen && (
        <button
          type="button"
          className="chat-shell__overlay"
          onClick={closeMobileSidebar}
          aria-label="Close navigation"
        />
      )}
      <aside className={sidebarClass}>
        <div className="chat-sidebar__top">
          <div className="chat-sidebar__brand">
            <span className="chat-sidebar__logo">PG</span>
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
        <button
          type="button"
          className="chat-sidebar__close"
          onClick={closeMobileSidebar}
          aria-label="Close navigation"
        >
          ×
        </button>
      </aside>

      <section className="chat-shell__main">
        <header className="chat-header">
          <button
            type="button"
            className="chat-mobile-trigger"
            onClick={openMobileSidebar}
            aria-label="Open navigation"
          >
            ☰
          </button>
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
                  <div className="chat-suggestions__slider" role="group" aria-label="Starter brief carousel">
                    <div
                      className="chat-suggestions__track"
                      style={{ transform: `translateX(-${activeSuggestionSlide * 100}%)` }}
                    >
                      {suggestionSlides.map((slide, slideIndex) => (
                        <div className="chat-suggestions__slide" key={`starter-slide-${slideIndex}`}>
                          {slide.map((suggestion) => (
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
                      ))}
                    </div>
                  </div>
                  {totalSuggestionSlides > 1 && (
                    <div className="chat-suggestions__controls">
                      <button
                        type="button"
                        className="chat-suggestions__nav"
                        onClick={handlePrevSuggestionSlide}
                        aria-label="Previous starter briefs"
                      >
                        ‹
                      </button>
                      <div className="chat-suggestions__dots" role="tablist" aria-label="Starter brief slides">
                        {suggestionSlides.map((_, index) => (
                          <button
                            key={`starter-dot-${index}`}
                            type="button"
                            className={`chat-suggestions__dot${
                              activeSuggestionSlide === index ? ' chat-suggestions__dot--active' : ''
                            }`}
                            onClick={() => setActiveSuggestionSlide(index)}
                            aria-label={`Show starter set ${index + 1}`}
                            aria-selected={activeSuggestionSlide === index}
                            role="tab"
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="chat-suggestions__nav"
                        onClick={handleNextSuggestionSlide}
                        aria-label="Next starter briefs"
                      >
                        ›
                      </button>
                    </div>
                  )}
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
