import { useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const MAX_PROMPT_SELECTION = 5

const PROMPT_TEMPLATES = [
  // Studio Editorials
  {
    id: '1',
    group: 'Studio Editorials',
    title: 'Studio · Front Pose',
    description:
      'Premium studio shot, male model facing camera, soft lighting, crops chin to mid thigh.',
  },
  {
    id: '2',
    group: 'Studio Editorials',
    title: 'Studio · Seated Chair',
    description:
      'High-fashion studio, model seated on minimalist chair, waist-up crop with natural lighting.',
  },
  {
    id: '3',
    group: 'Studio Editorials',
    title: 'Studio · Leaning Wall',
    description:
      'Cinematic studio image with model leaning on neutral wall, directional light reveals fabric.',
  },
  {
    id: '4',
    group: 'Studio Editorials',
    title: 'Studio · Adjusting Collar',
    description:
      'Upper torso crop of model adjusting collar, seamless light grey background, even illumination.',
  },
  {
    id: '5',
    group: 'Studio Editorials',
    title: 'Studio · Step Forward',
    description:
      'Dynamic studio pose stepping forward, crop chest to thigh, garment fills frame.',
  },
  // Lifestyle Editorials
  {
    id: '6',
    group: 'Lifestyle Editorials',
    title: 'Lifestyle · Street Neutral',
    description:
      'Minimalist street backdrop, open shade daylight, chest-up crop with muted architecture.',
  },
  {
    id: '7',
    group: 'Lifestyle Editorials',
    title: 'Lifestyle · Balcony Minimal',
    description:
      'Golden hour balcony scene, chest-to-waist crop with softly blurred city background.',
  },
  {
    id: '8',
    group: 'Lifestyle Editorials',
    title: 'Lifestyle · Minimal Architecture',
    description:
      'Model against sleek architecture, soft natural daylight, waist-up crop showing structure.',
  },
  {
    id: '9',
    group: 'Lifestyle Editorials',
    title: 'Lifestyle · Seated Steps',
    description:
      'Model seated on neutral stone steps, torso crop, overcast daylight with shallow depth.',
  },
  {
    id: '10',
    group: 'Lifestyle Editorials',
    title: 'Lifestyle · Window Light',
    description:
      'Modern interior by large window, chest-up crop, soft daylight with subtle rim light.',
  },
  // Studio Close-ups
  {
    id: '11',
    group: 'Studio Close-ups',
    title: 'Close-up · Collar Texture',
    description:
      'Macro collar and neckline detail with raking light on seamless neutral background.',
  },
  {
    id: '12',
    group: 'Studio Close-ups',
    title: 'Close-up · Sleeve Fold',
    description:
      'Sleeve area close-up showcasing folds and texture with soft controlled lighting.',
  },
  {
    id: '13',
    group: 'Studio Close-ups',
    title: 'Close-up · Button Detail',
    description:
      'Mid-chest crop focusing on fastenings, cinematic soft light keeps fabric grain intact.',
  },
  {
    id: '14',
    group: 'Studio Close-ups',
    title: 'Close-up · Shoulder Structure',
    description:
      'Tight crop on shoulder seam construction with directional light and gentle negative fill.',
  },
  {
    id: '15',
    group: 'Studio Close-ups',
    title: 'Close-up · Cuff Detail',
    description:
      'Sleeve cuff macro to highlight stitching and tailoring with cinematic lighting.',
  },
  // Product Hero Shots
  {
    id: '16',
    group: 'Product Hero Shots',
    title: 'Product · Suspended Hero',
    description:
      'Garment on minimal mannequin, front facing, soft even lighting, neutral seamless background.',
  },
  {
    id: '17',
    group: 'Product Hero Shots',
    title: 'Product · Stitching Focus',
    description:
      'Extreme close-up of stitching and seam construction with directional light.',
  },
  {
    id: '18',
    group: 'Product Hero Shots',
    title: 'Product · Fabric Weave',
    description:
      'Macro of fabric weave showing texture depth with raking light and minimal backdrop.',
  },
  {
    id: '19',
    group: 'Product Hero Shots',
    title: 'Product · Fastening Detail',
    description:
      'Close-up on button or zipper showcasing finishing detail, balanced lighting.',
  },
  {
    id: '20',
    group: 'Product Hero Shots',
    title: 'Product · Cuff Edge',
    description:
      'Macro of cuff edge highlighting tailoring craftsmanship with controlled reflections.',
  },
]

const PROMPT_LOOKUP = PROMPT_TEMPLATES.reduce((acc, option) => {
  acc[option.id] = option
  return acc
}, {})

const PROMPT_GROUPS = PROMPT_TEMPLATES.reduce((acc, option) => {
  if (!acc.includes(option.group)) {
    acc.push(option.group)
  }
  return acc
}, [])

function App() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedPromptIds, setSelectedPromptIds] = useState([])
  const [generatedImages, setGeneratedImages] = useState([])
  const [sourceImage, setSourceImage] = useState('')
  const [descriptions, setDescriptions] = useState([])
  const [status, setStatus] = useState({ step: '', message: '', loading: false, error: '' })

  const hasResults = useMemo(
    () => generatedImages.length > 0 || descriptions.length > 0,
    [generatedImages.length, descriptions.length],
  )

  const selectedPromptDetails = useMemo(
    () => selectedPromptIds.map((id) => PROMPT_LOOKUP[id]).filter(Boolean),
    [selectedPromptIds],
  )

  const resetOutputs = () => {
    setGeneratedImages([])
    setDescriptions([])
    setSourceImage('')
  }

  const updateStatus = (partial) => {
    setStatus((prev) => ({ ...prev, ...partial }))
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
    updateStatus({ error: '' })
    setSelectedPromptIds((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((value) => value !== promptId)
      }

      if (prev.length >= MAX_PROMPT_SELECTION) {
        updateStatus({ error: `Select up to ${MAX_PROMPT_SELECTION} prompt directions.` })
        return prev
      }

      return [...prev, promptId]
    })
  }

  const buildApiUrl = (path) => `${API_BASE_URL}${path}`

  const handleSubmit = async (evt) => {
    evt.preventDefault()

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
      message: 'Generating editorials and close-ups…',
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

      const { images, sourceImage: sourceImageUrl } = await imageResponse.json()
      setGeneratedImages(Array.isArray(images) ? images : [])
      setSourceImage(typeof sourceImageUrl === 'string' ? sourceImageUrl : '')

      updateStatus({
        step: 'descriptions',
        message: 'Visuals ready. Writing product descriptions…',
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
      setDescriptions(descriptionPayload.descriptions || [])

      updateStatus({
        step: 'done',
        message: 'All assets generated successfully.',
        loading: false,
      })
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
    setSelectedPromptIds([])
    resetOutputs()
    updateStatus({ step: '', message: '', loading: false, error: '' })
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Photo-first Garment Generator</h1>
          <p>
            Upload a single garment photo, choose up to five editorial prompt directions, and let OpenRouter craft
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

            <div className="styles">
              <div className="styles__header">
                <h2>Prompt directions</h2>
                <span>{selectedPromptIds.length}/{MAX_PROMPT_SELECTION} selected</span>
              </div>
              <p className="styles__hint">
                Choose up to {MAX_PROMPT_SELECTION} prompts. They steer the scenarios while the garment stays unchanged.
              </p>
              {PROMPT_GROUPS.map((group) => (
                <div key={group} className="prompt-group">
                  <h3>{group}</h3>
                  <div className="style-grid">
                    {PROMPT_TEMPLATES.filter((option) => option.group === group).map((option) => {
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
            </div>

            <button className="primary" type="submit" disabled={status.loading}>
              {status.loading ? 'Generating…' : 'Generate product assets'}
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
              <h2>Image variations</h2>
              <div className="image-grid">
                {generatedImages.map((src, index) => (
                  <figure key={`${src}-${index}`}>
                    <img src={src} alt={`Generated variation ${index + 1}`} />
                    <figcaption>Variation {index + 1}</figcaption>
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

export default App
