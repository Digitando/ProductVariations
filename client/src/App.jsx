import { useMemo, useState } from 'react'
import Generator from './components/Generator.jsx'
import './styles/App.css'

const VIEWS = {
  HOME: 'home',
  GENERATOR: 'generator',
  LIBRARY: 'library',
}

const NAV_ITEMS = [
  { id: VIEWS.HOME, label: 'Home' },
  { id: VIEWS.GENERATOR, label: 'Create' },
  { id: VIEWS.LIBRARY, label: 'Library' },
]

function AuthModal({ mode, onClose, onAuthenticate }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const isRegister = mode === 'register'

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onAuthenticate({ provider: 'credentials', mode, ...formData })
    if (result.success) {
      setFormData({ name: '', email: '', password: '' })
      setError('')
      onClose()
    } else if (result.error) {
      setError(result.error)
    }
  }

  const handleGoogle = () => {
    const result = onAuthenticate({ provider: 'google' })
    if (result.success) {
      setError('')
      onClose()
    } else if (result.error) {
      setError(result.error)
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
          <button type="button" className="google-button" onClick={handleGoogle}>
            Continue with Google
          </button>
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
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Alex Rivera"
                  required
                />
              </label>
            )}
            <label className="auth-form__field">
              <span>Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="auth-form__field">
              <span>Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="••••••••"
                required
              />
            </label>
            {error && <p className="auth-form__error">{error}</p>}
            <button type="submit" className="primary">{isRegister ? 'Create account' : 'Sign in'}</button>
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

function LibraryView({ sessions, user }) {
  const hasSessions = sessions.length > 0

  if (!user) {
    return (
      <section className="empty-state">
        <h2>Sign in to build your library</h2>
        <p>Your garment uploads and generated content appear here once you are signed in.</p>
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
              <p>{session.prompts?.map((prompt) => prompt?.name || prompt?.title).filter(Boolean).join(', ') || 'Custom'}</p>
            </header>
            <div className="library-card__body">
              <div className="library-card__images">
                {session.generatedImages.length > 0 ? (
                  session.generatedImages.slice(0, 3).map((imageUrl, index) => (
                    <img key={`${session.id}-${index}`} src={imageUrl} alt="Generated variation" />
                  ))
                ) : (
                  <div className="library-card__placeholder">No images stored</div>
                )}
              </div>
              <div className="library-card__descriptions">
                {session.descriptions.length > 0 ? (
                  <ul>
                    {session.descriptions.map((item, index) => (
                      <li key={`${session.id}-desc-${index}`}>
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

function App() {
  const [view, setView] = useState(VIEWS.HOME)
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [sessionsByUser, setSessionsByUser] = useState({})
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })

  const sessions = useMemo(() => {
    if (!user) return []
    return sessionsByUser[user.id] || []
  }, [sessionsByUser, user])

  const openAuthModal = (mode) => {
    setAuthModal({ open: true, mode })
  }

  const closeAuthModal = () => setAuthModal((prev) => ({ ...prev, open: false }))

  const handleAuthenticate = ({ provider, mode, name, email, password }) => {
    if (provider === 'google') {
      const profile = {
        id: `google-${Date.now()}`,
        name: 'Google Sign-In',
        email: 'you@googleuser.com',
        provider,
      }
      setUser(profile)
      setAccounts((prev) => (prev.some((account) => account.id === profile.id) ? prev : [...prev, profile]))
      return { success: true }
    }

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    if (mode === 'register') {
      if (accounts.some((account) => account.email === email)) {
        return { success: false, error: 'An account already exists with that email.' }
      }

      const newAccount = {
        id: crypto.randomUUID(),
        name: name || email.split('@')[0],
        email,
        password,
        provider: 'credentials',
      }
      setAccounts((prev) => [...prev, newAccount])
      setUser(newAccount)
      return { success: true }
    }

    const existingAccount = accounts.find((account) => account.email === email && account.password === password)
    if (!existingAccount) {
      return { success: false, error: 'Invalid email or password.' }
    }

    setUser(existingAccount)
    return { success: true }
  }

  const handleLogout = () => {
    setUser(null)
    setView(VIEWS.HOME)
  }

  const handleSessionComplete = (session) => {
    if (!user) {
      // Store the most recent session in memory for non-authenticated visitors to view immediately.
      setSessionsByUser((prev) => ({ ...prev, guest: [session] }))
      return
    }

    setSessionsByUser((prev) => {
      const existingSessions = prev[user.id] || []
      return {
        ...prev,
        [user.id]: [session, ...existingSessions],
      }
    })
    setView(VIEWS.LIBRARY)
  }

  const guestSessions = useMemo(() => sessionsByUser.guest || [], [sessionsByUser])

  const handleNavigate = (nextView) => {
    setView(nextView)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__brand" role="button" tabIndex={0} onClick={() => handleNavigate(VIEWS.HOME)}>
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
        {view === VIEWS.GENERATOR && <Generator onSessionComplete={handleSessionComplete} />}
        {view === VIEWS.LIBRARY && <LibraryView sessions={user ? sessions : guestSessions} user={user} />}
      </main>

      {authModal.open && (
        <AuthModal mode={authModal.mode} onClose={closeAuthModal} onAuthenticate={handleAuthenticate} />
      )}
    </div>
  )
}

export default App
