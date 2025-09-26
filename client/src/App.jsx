import { useEffect, useMemo, useState } from 'react'
import Generator from './components/Generator.jsx'
import GoogleSignInButton from './components/GoogleSignInButton.jsx'
import ImageViewer from './components/ImageViewer.jsx'
import './styles/App.css'

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
  { id: VIEWS.LIBRARY, label: 'Library' },
  { id: VIEWS.PROFILE, label: 'Profile' },
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

function Hero({ onGetStarted, user }) {
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
          <img src="/vite.svg" alt="" />
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

function ProfileView({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('library')
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [isEditing, setIsEditing] = useState(false)

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Sign in to access your profile</h2>
        <p>Create an account or sign in to manage your profile and settings.</p>
      </section>
    )
  }

  const handleSettingsUpdate = (e) => {
    e.preventDefault()
    // In a real app, this would make an API call to update user settings
    setIsEditing(false)
    // For now, just simulate the update
    alert('Profile settings updated!')
  }

  return (
    <div className="profile">
      <header className="profile__header">
        <div>
          <h1>Profile</h1>
          <p>Manage your account settings and view your library</p>
        </div>
      </header>

      <div className="profile__tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'library' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          My Library
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'settings' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="profile__content">
        {activeTab === 'library' && (
          <div className="profile-library">
            <h2>Your Saved Sessions</h2>
            <p>This shows the same content as the Library tab. You can view all your generated variations here.</p>
            <div className="profile-library__stats">
              <div className="stat-card">
                <h3>Total Sessions</h3>
                <p className="stat-number">0</p>
              </div>
              <div className="stat-card">
                <h3>Images Generated</h3>
                <p className="stat-number">0</p>
              </div>
              <div className="stat-card">
                <h3>Descriptions Created</h3>
                <p className="stat-number">0</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-settings">
            <div className="settings-section">
              <h2>Account Information</h2>
              <form onSubmit={handleSettingsUpdate}>
                <div className="form-group">
                  <label htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileSettings.name}
                    onChange={(e) => setProfileSettings(prev => ({...prev, name: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email">Email</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-actions">
                  {isEditing ? (
                    <>
                      <button type="submit" className="primary">Save Changes</button>
                      <button type="button" className="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="primary" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="settings-section">
              <h2>Account Actions</h2>
              <button type="button" className="secondary" onClick={onLogout}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
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
    setView(nextView)
    if (nextView === VIEWS.LIBRARY && user && !sessions.length && !libraryStatus.loading) {
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
          {NAV_ITEMS.map((item) => (
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
        {view === VIEWS.HOME && <Hero onGetStarted={() => setView(VIEWS.GENERATOR)} user={user} />}
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
    </div>
  )
}

export default App
