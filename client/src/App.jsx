import { useEffect, useMemo, useState } from 'react'
import Generator from './components/Generator.jsx'
import GoogleSignInButton from './components/GoogleSignInButton.jsx'
import ImageViewer from './components/ImageViewer.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import './styles/App.css'
import './styles/Profile.css'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const VIEWS = {
  HOME: 'home',
  GENERATOR: 'generator',
  LIBRARY: 'library',
  PROFILE: 'profile',
}

const NAV_ITEMS = [
  { id: VIEWS.HOME, label: 'Home' },
  { id: VIEWS.GENERATOR, label: 'Create' },
  { id: VIEWS.LIBRARY, label: 'Library', requiresAuth: true },
  { id: VIEWS.PROFILE, label: 'Profile', requiresAuth: true },
]

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const url = `${API_BASE_URL}${path}`
  const headers = {}
  let payload = body

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    body: payload,
    headers,
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch (error) {
    data = text
  }

  if (!response.ok) {
    const message = data?.error || response.statusText || 'Request failed'
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

function AuthModal({ mode, onClose, onAuthenticate, googleClientId }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const result = await onAuthenticate({
        provider: 'credentials',
        mode,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        setFormData({ name: '', email: '', password: '' })
        setError('')
        onClose()
      } else if (result.error) {
        setError(result.error)
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleCredential = async (credential) => {
    if (!credential) {
      setError('Google sign-in is not configured yet. Set VITE_GOOGLE_CLIENT_ID to enable.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const result = await onAuthenticate({ provider: 'google', credential })
      if (result.success) {
        onClose()
      } else if (result.error) {
        setError(result.error)
      }
    } catch (googleError) {
      setError(googleError instanceof Error ? googleError.message : 'Google sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal__backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-heading">
        <header className="modal__header">
          <h2 id="auth-modal-heading">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="modal__body">
          <p className="modal__subtitle">
            {isRegister
              ? 'Register to save your garment uploads and revisit generated assets at any time.'
              : 'Sign in to access saved uploads and continue where you left off.'}
          </p>
          <GoogleSignInButton
            clientId={googleClientId}
            onCredential={handleGoogleCredential}
            text="Continue with Google"
          />
          <div className="modal__divider">
            <span>or</span>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-form__field">
                <span>Full name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Alex Rivera"
                  required
                  disabled={submitting}
                />
              </label>
            )}
            <label className="auth-form__field">
              <span>Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="you@example.com"
                required
                disabled={submitting}
              />
            </label>
            <label className="auth-form__field">
              <span>Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="••••••••"
                required
                disabled={submitting}
              />
            </label>
            {error && <p className="auth-form__error">{error}</p>}
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Hero({ onGetStarted, user, recentImages = [] }) {
  const hasImages = recentImages.length > 0
  const previewImages = useMemo(
    () => (hasImages ? recentImages.slice(0, 10) : []),
    [hasImages, recentImages],
  )
  const [activeIndex, setActiveIndex] = useState(hasImages ? 0 : -1)

  useEffect(() => {
    if (!previewImages.length) {
      setActiveIndex(-1)
      return undefined
    }

    setActiveIndex(0)
    const interval = setInterval(() => {
      setActiveIndex((previous) => {
        if (previewImages.length <= 1) {
          return 0
        }

        const next = previous + 1
        return next >= previewImages.length ? 0 : next
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [previewImages])

  return (
    <section className="hero">
      <div className="hero__content">
        <p className="eyebrow">AI Product Studio for Apparel Brands</p>
        <h1>Transform a single garment photo into launch-ready visuals and copy.</h1>
        <p className="hero__description">
          Upload a reference shot, pick the editorial directions, and let our generator return consistent model imagery,
          close-ups, and conversion-ready product descriptions.
        </p>
        <div className="hero__actions">
          <button type="button" className="primary" onClick={onGetStarted}>
            Start generating
          </button>
          {user ? (
            <span className="hero__hint">Signed in as {user.name || user.email}</span>
          ) : (
            <span className="hero__hint">Create an account to save every upload.</span>
          )}
        </div>
      </div>
      <div className="hero__card">
        <div className="hero__preview" aria-hidden="true">
          {previewImages.length > 0 ? (
            <>
              {previewImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`hero__slide${index === activeIndex ? ' hero__slide--active' : ''}`}
                />
              ))}
              <div className="hero__preview-dots">
                {previewImages.map((_, index) => (
                  <span
                    key={`hero-dot-${index}`}
                    className={`hero__dot${index === activeIndex ? ' hero__dot--active' : ''}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="hero__placeholder">
              <img src="/vite.svg" alt="" />
            </div>
          )}
        </div>
        <ul className="hero__list" aria-label="Workflow highlights">
          <li>
            <span className="hero__badge">01</span>
            Upload one outfit photo
          </li>
          <li>
            <span className="hero__badge">02</span>
            Select editorial prompts
          </li>
          <li>
            <span className="hero__badge">03</span>
            Download variations and copy
          </li>
        </ul>
      </div>
    </section>
  )
}

function LibraryView({ sessions, user, status, onRefresh, onViewImage }) {
  const hasSessions = sessions.length > 0
  const triggerViewImage = (src, alt) => {
    if (typeof onViewImage === 'function') {
      onViewImage(src, alt)
    }
  }

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Sign in to build your library</h2>
        <p>Your garment uploads and generated content appear here once you are signed in.</p>
      </section>
    )
  }

  if (status.loading) {
    return (
      <section className="empty-state">
        <h2>Loading your library…</h2>
        <p>Please hold tight while we fetch your saved sessions.</p>
      </section>
    )
  }

  if (status.error) {
    return (
      <section className="empty-state">
        <h2>Unable to load sessions</h2>
        <p>{status.error}</p>
        <button type="button" className="secondary" onClick={onRefresh}>
          Try again
        </button>
      </section>
    )
  }

  if (!hasSessions) {
    return (
      <section className="empty-state">
        <h2>No saved sessions yet</h2>
        <p>Generate your first variations to see them listed here.</p>
      </section>
    )
  }

  return (
    <section className="library">
      <header className="library__header">
        <div>
          <h2>Saved sessions</h2>
          <p>Review every product variation set you have generated.</p>
        </div>
        <span className="library__meta">{sessions.length} session(s)</span>
      </header>
      <div className="library__grid">
        {sessions.map((session) => (
          <article key={session.id} className="library-card">
            <header className="library-card__header">
              <h3>{new Date(session.createdAt).toLocaleString()}</h3>
              <p>
                {session.prompts
                  ?.map((prompt) => prompt?.name || prompt?.title)
                  .filter(Boolean)
                  .join(', ') || 'Custom'}
              </p>
            </header>
            <div className="library-card__body">
              <div className="library-card__images">
                {session.generatedImages?.length > 0 ? (
                  session.generatedImages.map((imageUrl, index) => (
                    <button
                      type="button"
                      key={`${session.id}-${index}`}
                      className="image-thumb"
                      onClick={() => triggerViewImage(imageUrl, `Generated variation ${index + 1}`)}
                    >
                      <img src={imageUrl} alt={`Generated variation ${index + 1}`} loading="lazy" />
                    </button>
                  ))
                ) : (
                  <div className="library-card__placeholder">No images stored</div>
                )}
              </div>
              <div className="library-card__descriptions">
                {session.descriptions?.length > 0 ? (
                  <ul>
                    {session.descriptions.map((item, index) => (
                      <li key={`${session.id}-desc-${index}`}>
                        {item.title && <strong className="description-title">{item.title}</strong>}
                        <strong>{item.headline}</strong>
                        <p>{item.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No copy saved for this session.</p>
                )}
              </div>
            </div>
            {session.sourceImage && (
              <footer className="library-card__footer">
                <a href={session.sourceImage} target="_blank" rel="noreferrer">
                  View source upload
                </a>
              </footer>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function ProfileView({ user, sessions = [], status, onRefresh, onViewImage, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setProfileSettings({ name: user?.name || '', email: user?.email || '' })
  }, [user])

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timer = setTimeout(() => setFeedback(''), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  const metrics = useMemo(() => {
    const list = Array.isArray(sessions) ? sessions : []
    const totalSessions = list.length
    let totalImages = 0
    let totalDescriptions = 0

    list.forEach((session) => {
      totalImages += session?.generatedImages?.length || 0
      totalDescriptions += session?.descriptions?.length || 0
    })

    const lastSession = list[0] || null
    return { totalSessions, totalImages, totalDescriptions, lastSession }
  }, [sessions])

  const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null

  const handleSettingsUpdate = (event) => {
    event.preventDefault()
    setIsEditing(false)
    setFeedback('Profile preferences saved. We will sync these soon with your account backend.')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setProfileSettings({ name: user?.name || '', email: user?.email || '' })
    setFeedback('Changes discarded.')
  }

  const triggerImageView = (src, alt) => {
    if (typeof onViewImage === 'function') {
      onViewImage(src, alt)
    }
  }

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Sign in to access your profile</h2>
        <p>Create an account or sign in to manage your profile and settings.</p>
      </section>
    )
  }

  return (
    <div className="profile">
      <header className="profile__hero">
        <div>
          <p className="profile__eyebrow">Account hub</p>
          <h1>{user.name || user.email}</h1>
          <p>Review your creator activity, manage saved sessions, and adjust contact preferences.</p>
          {joinedAt && <span className="profile__meta">Member since {joinedAt}</span>}
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          Sign out
        </button>
      </header>

      <section className="profile__stats">
        <article className="profile-stat">
          <h2>Total sessions</h2>
          <p className="profile-stat__number">{metrics.totalSessions}</p>
          <p className="profile-stat__hint">Each session captures your prompt set, source photo, and outputs.</p>
        </article>
        <article className="profile-stat">
          <h2>Images generated</h2>
          <p className="profile-stat__number">{metrics.totalImages}</p>
          <p className="profile-stat__hint">Download single shots or bulk export from the library view.</p>
        </article>
        <article className="profile-stat">
          <h2>Descriptions crafted</h2>
          <p className="profile-stat__number">{metrics.totalDescriptions}</p>
          <p className="profile-stat__hint">High-converting copy stored alongside each session.</p>
        </article>
      </section>

      <nav className="profile__tabs" aria-label="Profile sections">
        <button
          type="button"
          className={`profile-tab${activeTab === 'overview' ? ' profile-tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`profile-tab${activeTab === 'library' ? ' profile-tab--active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          Library
        </button>
        <button
          type="button"
          className={`profile-tab${activeTab === 'settings' ? ' profile-tab--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      {feedback && <p className="profile__feedback">{feedback}</p>}

      <section className="profile__panel">
        {activeTab === 'overview' && (
          <div className="profile-overview">
            <article className="profile-card">
              <h2>Creator summary</h2>
              <ul>
                <li>
                  <span>Account email</span>
                  <strong>{user.email}</strong>
                </li>
                <li>
                  <span>Authentication provider</span>
                  <strong>{user.provider ? user.provider.replace(/^[a-z]/, (c) => c.toUpperCase()) : 'Credentials'}</strong>
                </li>
                {user.lastLoginAt && (
                  <li>
                    <span>Last sign-in</span>
                    <strong>{new Date(user.lastLoginAt).toLocaleString()}</strong>
                  </li>
                )}
              </ul>
            </article>

            <article className="profile-card">
              <h2>Most recent session</h2>
              {metrics.lastSession ? (
                <>
                  <p className="profile-card__timestamp">
                    {new Date(metrics.lastSession.createdAt).toLocaleString()}
                  </p>
                  <div className="profile-card__prompts">
                    {(metrics.lastSession.prompts || []).slice(0, 3).map((prompt, index) => (
                      <span key={`recent-prompt-${index}`}>{prompt?.title || prompt?.name || 'Custom prompt'}</span>
                    ))}
                  </div>
                  <div className="profile-card__preview">
                    {(metrics.lastSession.generatedImages || []).slice(0, 3).map((src, index) => (
                      <button
                        key={`${metrics.lastSession.id}-preview-${index}`}
                        type="button"
                        onClick={() => triggerImageView(src, `Generated variation ${index + 1}`)}
                      >
                        <img src={src} alt="Generated preview" loading="lazy" />
                      </button>
                    ))}
                    {(metrics.lastSession.generatedImages || []).length === 0 && (
                      <p className="profile-card__empty">Run a generation to see previews here.</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="profile-card__empty">You have not saved any sessions yet. Generate a look to get started.</p>
              )}
            </article>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="profile-library">
            <header className="profile-library__header">
              <div>
                <h2>Saved sessions</h2>
                <p>Access every generation saved to your account.</p>
              </div>
              <div className="profile-library__actions">
                <button type="button" className="secondary" onClick={onRefresh} disabled={status?.loading}>
                  Refresh
                </button>
              </div>
            </header>

            {status?.loading ? (
              <p className="profile-panel__empty">Loading your sessions…</p>
            ) : status?.error ? (
              <div className="profile-panel__empty">
                <p>We could not load your sessions: {status.error}</p>
                <button type="button" className="secondary" onClick={onRefresh}>
                  Try again
                </button>
              </div>
            ) : sessions.length === 0 ? (
              <p className="profile-panel__empty">No saved sessions yet. Generate a look to populate your library.</p>
            ) : (
              <div className="profile-session-list">
                {sessions.map((session) => (
                  <article key={session.id} className="profile-session-card">
                    <header>
                      <div>
                        <h3>{new Date(session.createdAt).toLocaleString()}</h3>
                        <p>
                          {(session.prompts || [])
                            .map((prompt) => prompt?.title || prompt?.name)
                            .filter(Boolean)
                            .join(' · ') || 'Custom prompts'}
                        </p>
                      </div>
                      {session.sourceImage && (
                        <a href={session.sourceImage} target="_blank" rel="noreferrer" className="profile-session-card__link">
                          View source
                        </a>
                      )}
                    </header>
                    <div className="profile-session-card__body">
                      <div className="profile-session-card__thumbs">
                        {(session.generatedImages || []).slice(0, 4).map((src, index) => (
                          <button
                            key={`${session.id}-img-${index}`}
                            type="button"
                            onClick={() => triggerImageView(src, `Generated variation ${index + 1}`)}
                          >
                            <img src={src} alt={`Generated variation ${index + 1}`} loading="lazy" />
                          </button>
                        ))}
                        {(session.generatedImages || []).length === 0 && (
                          <span className="profile-session-card__empty">No images stored</span>
                        )}
                      </div>
                      <ul className="profile-session-card__meta">
                        <li>
                          <span>Images</span>
                          <strong>{session.generatedImages?.length || 0}</strong>
                        </li>
                        <li>
                          <span>Descriptions</span>
                          <strong>{session.descriptions?.length || 0}</strong>
                        </li>
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-settings">
            <form className="profile-settings__form" onSubmit={handleSettingsUpdate}>
              <h2>Account information</h2>
              <p className="profile-settings__hint">
                We are rolling out full account editing soon. Update your preferred display name and contact email and we will
                apply the changes on your next sync.
              </p>

              <label className="profile-field" htmlFor="profile-name">
                <span>Display name</span>
                <input
                  id="profile-name"
                  type="text"
                  value={profileSettings.name}
                  onChange={(event) =>
                    setProfileSettings((previous) => ({ ...previous, name: event.target.value }))
                  }
                  disabled={!isEditing}
                />
              </label>

              <label className="profile-field" htmlFor="profile-email">
                <span>Email</span>
                <input
                  id="profile-email"
                  type="email"
                  value={profileSettings.email}
                  onChange={(event) =>
                    setProfileSettings((previous) => ({ ...previous, email: event.target.value }))
                  }
                  disabled={!isEditing}
                />
              </label>

              <div className="profile-settings__actions">
                {isEditing ? (
                  <>
                    <button type="submit" className="primary">
                      Save changes
                    </button>
                    <button type="button" className="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="primary" onClick={() => setIsEditing(true)}>
                    Edit profile
                  </button>
                )}
              </div>
            </form>

            <div className="profile-settings__actions profile-settings__actions--stacked">
              <h2>Account actions</h2>
              <p>Need a hand or want to disconnect? Sign out anytime.</p>
              <button type="button" className="secondary" onClick={onLogout}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function App() {
  const [view, setView] = useState(VIEWS.HOME)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [sessions, setSessions] = useState([])
  const [guestSessions, setGuestSessions] = useState([])
  const [libraryStatus, setLibraryStatus] = useState({ loading: false, error: '' })
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })
  const [viewerState, setViewerState] = useState({ open: false, src: '', alt: '' })

  const currentSessions = useMemo(() => (user ? sessions : guestSessions), [sessions, guestSessions, user])
  const navigationItems = useMemo(
    () => NAV_ITEMS.filter((item) => !item.requiresAuth || user),
    [user],
  )
  const heroImages = useMemo(() => {
    const seen = new Set()
    const collected = []

    currentSessions.forEach((session) => {
      ;(session?.generatedImages || []).forEach((url) => {
        if (!url || seen.has(url)) {
          return
        }

        seen.add(url)
        collected.push(url)
      })
    })

    if (collected.length <= 1) {
      return collected
    }

    const shuffled = [...collected]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
    }

    return shuffled.slice(0, 12)
  }, [currentSessions])

  useEffect(() => {
    const storedToken = localStorage.getItem('pv_auth_token')
    if (!storedToken) {
      return
    }

    setToken(storedToken)

    ;(async () => {
      try {
        const data = await apiRequest('/auth/me', { token: storedToken })
        if (data?.user) {
          setUser(data.user)
          await loadSessions(storedToken)
        }
      } catch (error) {
        console.warn('Session restore failed', error)
        localStorage.removeItem('pv_auth_token')
        setToken('')
      }
    })()
  }, [])

  const loadSessions = async (authToken = token) => {
    if (!authToken) {
      return
    }

    setLibraryStatus({ loading: true, error: '' })
    try {
      const data = await apiRequest('/api/sessions', { token: authToken })
      setSessions(data?.sessions || [])
      setLibraryStatus({ loading: false, error: '' })
    } catch (error) {
      setLibraryStatus({ loading: false, error: error.message })
    }
  }

  const openAuthModal = (mode) => {
    setAuthModal({ open: true, mode })
  }

  const closeAuthModal = () => setAuthModal((prev) => ({ ...prev, open: false }))

  const handleAuthenticate = async ({ provider, mode, name, email, password, credential }) => {
    try {
      let data

      if (provider === 'google') {
        if (!credential) {
          return { success: false, error: 'Google sign-in is not configured.' }
        }
        data = await apiRequest('/auth/google', {
          method: 'POST',
          body: { credential },
        })
      } else if (mode === 'register') {
        data = await apiRequest('/auth/register', {
          method: 'POST',
          body: { name, email, password },
        })
      } else {
        data = await apiRequest('/auth/login', {
          method: 'POST',
          body: { email, password },
        })
      }

      if (!data?.token || !data?.user) {
        return { success: false, error: 'Authentication failed.' }
      }

      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('pv_auth_token', data.token)
      await loadSessions(data.token)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Authentication failed.' }
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken('')
    setSessions([])
    localStorage.removeItem('pv_auth_token')
    setView(VIEWS.HOME)
  }

  const openImageViewer = ({ src, alt }) => {
    if (!src) return
    setViewerState({ open: true, src, alt: alt || 'Generated variation' })
  }

  const closeImageViewer = () => {
    setViewerState({ open: false, src: '', alt: '' })
  }

  const handleSessionComplete = async (session) => {
    if (!user || !token) {
      setGuestSessions((prev) => [session, ...prev].slice(0, 5))
      setView(VIEWS.LIBRARY)
      return
    }

    try {
      const response = await apiRequest('/api/sessions', {
        method: 'POST',
        body: {
          prompts: session.prompts,
          sourceImage: session.sourceImage,
          generatedImages: session.generatedImages,
          descriptions: session.descriptions,
        },
        token,
      })

      const saved = response?.session || session
      setSessions((prev) => [saved, ...prev])
      setLibraryStatus({ loading: false, error: '' })
    } catch (error) {
      setLibraryStatus({ loading: false, error: error.message })
    }

    setView(VIEWS.LIBRARY)
  }

  const handleNavigate = (nextView) => {
    const target = NAV_ITEMS.find((item) => item.id === nextView)
    if (target?.requiresAuth && !user) {
      openAuthModal('login')
      return
    }
    setView(nextView)
    if (
      (nextView === VIEWS.LIBRARY || nextView === VIEWS.PROFILE) &&
      user &&
      !sessions.length &&
      !libraryStatus.loading
    ) {
      loadSessions()
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div
          className="topbar__brand"
          role="button"
          tabIndex={0}
          onClick={() => handleNavigate(VIEWS.HOME)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleNavigate(VIEWS.HOME)
            }
          }}
        >
          <span className="topbar__logo" aria-hidden="true">
            PG
          </span>
          <span className="topbar__title">Product Variations</span>
        </div>
        <nav className="topbar__nav" aria-label="Primary">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`topbar__link${view === item.id ? ' topbar__link--active' : ''}`}
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="topbar__actions">
          {user ? (
            <>
              <span className="topbar__user">{user.name || user.email}</span>
              <button type="button" className="secondary" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="secondary" onClick={() => openAuthModal('login')}>
                Log in
              </button>
              <button type="button" className="primary" onClick={() => openAuthModal('register')}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        {view === VIEWS.HOME && (
          <Hero
            onGetStarted={() => setView(VIEWS.GENERATOR)}
            user={user}
            recentImages={heroImages}
          />
        )}
        {view === VIEWS.GENERATOR && (
          <Generator onSessionComplete={handleSessionComplete} onViewImage={openImageViewer} />
        )}
        {view === VIEWS.LIBRARY && (
          <LibraryView
            sessions={currentSessions}
            user={user}
            status={libraryStatus}
            onRefresh={() => loadSessions()}
            onViewImage={(src, alt) => openImageViewer({ src, alt })}
          />
        )}
        {view === VIEWS.PROFILE && (
          <ProfileView
            user={user}
            sessions={sessions}
            status={libraryStatus}
            onRefresh={() => loadSessions()}
            onViewImage={(src, alt) => openImageViewer({ src, alt })}
            onLogout={handleLogout}
          />
        )}
      </main>

      {authModal.open && (
        <AuthModal
          mode={authModal.mode}
          onClose={closeAuthModal}
          onAuthenticate={handleAuthenticate}
          googleClientId={GOOGLE_CLIENT_ID}
        />
      )}

      <ImageViewer
        isOpen={viewerState.open}
        src={viewerState.src}
        alt={viewerState.alt}
        onClose={closeImageViewer}
      />

      <CookieConsent />
    </div>
  )
}

export default App
