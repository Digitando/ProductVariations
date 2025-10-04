import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import Generator from './components/Generator.jsx'
import GoogleSignInButton from './components/GoogleSignInButton.jsx'
import ImageViewer from './components/ImageViewer.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import './styles/App.css'
import './styles/Profile.css'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null


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
  } catch {
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

function AuthModal({ mode, onClose, onAuthenticate, onChangeMode, googleClientId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: '',
    consentPrivacy: false,
    consentMarketing: false,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === 'register'

  useEffect(() => {
    setError('')
  }, [isRegister])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isRegister && !formData.consentPrivacy) {
        setError('Please accept the Privacy Policy and GDPR terms above to create your account.')
        setSubmitting(false)
        return
      }

      const result = await onAuthenticate({
        provider: 'credentials',
        mode,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode,
        consentPrivacy: formData.consentPrivacy,
        consentMarketing: formData.consentMarketing,
      })

      if (result.success) {
        setFormData({
          name: '',
          email: '',
          password: '',
          referralCode: '',
          consentPrivacy: false,
          consentMarketing: false,
        })
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

    // Only require consent for new registrations, not for existing users logging in
    if (isRegister && !formData.consentPrivacy) {
      setError('Please accept the Privacy Policy and GDPR terms above before signing up with Google.')
      return
    }

    // For login mode, pass true for privacy (existing users already consented)
    // For register mode, use the checkbox values
    const consentPrivacy = isRegister ? Boolean(formData.consentPrivacy) : true
    const consentMarketing = isRegister ? Boolean(formData.consentMarketing) : false

    setSubmitting(true)
    setError('')
    try {
      const result = await onAuthenticate({
        provider: 'google',
        credential,
        consentPrivacy,
        consentMarketing,
      })
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
          <h2 id="auth-modal-heading" className="sr-only">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <nav className="modal__tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={`modal__tab${!isRegister ? ' modal__tab--active' : ''}`}
              role="tab"
              aria-selected={!isRegister}
              tabIndex={!isRegister ? 0 : -1}
              onClick={() => onChangeMode?.('login')}
              disabled={!onChangeMode}
            >
              Log in
            </button>
            <button
              type="button"
              className={`modal__tab${isRegister ? ' modal__tab--active' : ''}`}
              role="tab"
              aria-selected={isRegister}
              tabIndex={isRegister ? 0 : -1}
              onClick={() => onChangeMode?.('register')}
              disabled={!onChangeMode}
            >
              Sign up
            </button>
          </nav>
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
          {isRegister && (
            <div className="auth-form__consent">
              <label className="auth-form__checkbox">
                <input
                  type="checkbox"
                  checked={formData.consentPrivacy}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, consentPrivacy: event.target.checked }))
                  }
                  required
                />
                <span>
                  I accept the{' '}
                  <span className="link-button">Privacy Policy</span>{' '}
                  and GDPR terms.
                </span>
              </label>
              <label className="auth-form__checkbox">
                <input
                  type="checkbox"
                  checked={formData.consentMarketing}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, consentMarketing: event.target.checked }))
                  }
                />
                <span>I agree to receive promotional materials and updates (optional).</span>
              </label>
            </div>
          )}
          <GoogleSignInButton
            clientId={googleClientId}
            onCredential={handleGoogleCredential}
            text={isRegister ? 'Sign up with Google' : 'Sign in with Google'}
            buttonText={isRegister ? 'signup_with' : 'signin_with'}
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
            {isRegister && (
              <label className="auth-form__field">
                <span>Referral code (optional)</span>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, referralCode: event.target.value.toUpperCase() }))
                  }
                  placeholder="INVITE123"
                  disabled={submitting}
                  autoComplete="off"
                />
              </label>
            )}
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


function WalletPanel({ user, token, onUserUpdate }) {
  const stripe = useStripe()
  const elements = useElements()
  const [amount, setAmount] = useState(1)
  const [currency, setCurrency] = useState('eur')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [referralStatus, setReferralStatus] = useState({ loading: false, error: '', message: '' })

  const coins = user?.coins ?? 0
  const referralCode = user?.referralCode || ''
  const referralCount = user?.referralCount ?? 0

  const cardOptions = useMemo(
    () => ({
      style: {
        base: {
          fontSize: '16px',
          color: '#1f2937',
          '::placeholder': {
            color: '#94a3b8',
          },
        },
        invalid: {
          color: '#ef4444',
        },
      },
    }),
    [],
  )

  const resetStatus = () => setStatus({ loading: false, error: '', success: '' })

  const handlePurchase = async (event) => {
    event.preventDefault()
    resetStatus()

    if (!stripe || !elements) {
      setStatus({ loading: false, error: 'Stripe is not ready yet. Please try again in a moment.', success: '' })
      return
    }

    const numericAmount = Number(amount)
    if (!Number.isInteger(numericAmount) || numericAmount <= 0) {
      setStatus({ loading: false, error: 'Enter a whole number amount (e.g. 1, 5, 10).', success: '' })
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const createIntent = await apiRequest('/api/coins/create-payment-intent', {
        method: 'POST',
        body: { amount: numericAmount, currency },
        token,
      })

      if (!createIntent?.clientSecret) {
        throw new Error('Unable to start checkout.')
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card input is not ready. Please reload the page and try again.')
      }

      const confirmation = await stripe.confirmCardPayment(createIntent.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (confirmation.error) {
        throw new Error(confirmation.error.message || 'Payment failed. Please double-check your details.')
      }

      const paymentIntentId = createIntent.paymentIntentId || confirmation.paymentIntent?.id
      if (!paymentIntentId) {
        throw new Error('Payment completed but we could not confirm the transaction ID. Contact support.')
      }

      const redeem = await apiRequest('/api/coins/redeem', {
        method: 'POST',
        body: { paymentIntentId },
        token,
      })

      const coinsAwarded = Number(redeem?.coinsAwarded || 0)
      const remaining = Number(redeem?.coins ?? coins)

      if (typeof onUserUpdate === 'function') {
        onUserUpdate({ coins: remaining })
      }

      if (cardElement.clear) {
        cardElement.clear()
      }

      setStatus({
        loading: false,
        error: '',
        success:
          coinsAwarded > 0
            ? `Success! ${coinsAwarded} coin${coinsAwarded === 1 ? '' : 's'} added to your balance.`
            : 'Payment confirmed. Your balance is up to date.',
      })
    } catch (error) {
      setStatus({
        loading: false,
        error: error instanceof Error ? error.message : 'Coin purchase failed. Please try again.',
        success: '',
      })
    }
  }

  const handleRefreshReferral = async () => {
    setReferralStatus({ loading: true, error: '', message: '' })
    try {
      const response = await apiRequest('/api/referral-code/refresh', {
        method: 'POST',
        token,
      })
      if (response?.referralCode && typeof onUserUpdate === 'function') {
        onUserUpdate({ referralCode: response.referralCode })
      }
      setReferralStatus({ loading: false, error: '', message: 'Referral code refreshed.' })
    } catch (error) {
      setReferralStatus({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to refresh referral code. Please try again later.',
        message: '',
      })
    }
  }

  const handleCopyReferral = async () => {
    if (!referralCode) {
      return
    }

    try {
      await navigator.clipboard.writeText(referralCode)
      setReferralStatus({ loading: false, error: '', message: 'Referral code copied to your clipboard.' })
    } catch (error) {
      console.warn('Clipboard access is blocked', error)
      setReferralStatus({ loading: false, error: 'Clipboard access is blocked. Copy manually instead.', message: '' })
    }
  }

  return (
    <div className="wallet">
      <section className="wallet__balance">
        <div>
          <span>Coins available</span>
          <strong>{coins}</strong>
        </div>
        <p>Each generated photo costs 1 coin. Every 1&nbsp;EUR you add gives you 5 coins.</p>
      </section>

      <form className="wallet__form" onSubmit={handlePurchase}>
        <div className="wallet__fields">
          <label>
            <span>Amount to purchase</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => {
                const nextValue = Number(event.target.value)
                if (Number.isFinite(nextValue) && nextValue > 0) {
                  setAmount(Math.floor(nextValue))
                } else {
                  setAmount(1)
                }
              }}
              required
            />
          </label>
          <label>
            <span>Currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
              <option value="eur">EUR</option>
            </select>
          </label>
        </div>

        <label className="wallet__card">
          <span>Card details</span>
          <div className="wallet__card-input">
            <CardElement options={cardOptions} />
          </div>
        </label>

        <button type="submit" className="primary" disabled={status.loading || !stripe || !elements}>
          {status.loading ? 'Processing…' : `Pay ${amount} ${currency.toUpperCase()} for ${amount * 5} coins`}
        </button>

        {status.error && <p className="wallet__status wallet__status--error">{status.error}</p>}
        {status.success && <p className="wallet__status wallet__status--success">{status.success}</p>}
      </form>

      <section className="wallet__referral">
        <div className="wallet__referral-header">
          <h2>Referral rewards</h2>
          <button type="button" className="secondary" onClick={handleRefreshReferral} disabled={referralStatus.loading}>
            {referralStatus.loading ? 'Generating…' : 'Generate new code'}
          </button>
        </div>
        <p>
          Share your code so new teammates start with 2 bonus coins. Every accepted invite gives you 4 extra coins. You have
          referred {referralCount} creator{referralCount === 1 ? '' : 's'} so far.
        </p>
        <div className="wallet__referral-code">
          <code>{referralCode || 'No code yet'}</code>
          <button type="button" className="secondary" onClick={handleCopyReferral} disabled={!referralCode}>
            Copy
          </button>
        </div>
        {referralStatus.error && <p className="wallet__status wallet__status--error">{referralStatus.error}</p>}
        {referralStatus.message && <p className="wallet__status wallet__status--success">{referralStatus.message}</p>}
      </section>
    </div>
  )
}

function ProfileModal({
  user,
  sessions = [],
  status,
  onRefresh,
  onViewImage,
  onLogout,
  onClose,
  token,
  onUserUpdate,
  stripePromise,
  initialTab = 'overview',
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
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
    setActiveTab(initialTab)
  }, [initialTab])

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
  const coins = user?.coins ?? 0

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
    <div className="modal__backdrop" role="presentation">
      <div className="profile modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-heading">
        <header className="profile__hero">
          <div>
            <p className="profile__eyebrow">Account hub</p>
            <h1 id="profile-modal-heading">{user.name || user.email}</h1>
            <p>Review your creator activity, manage saved sessions, and adjust contact preferences.</p>
            {joinedAt && <span className="profile__meta">Member since {joinedAt}</span>}
          </div>
          <div className="profile__hero-actions">
            <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
              ×
            </button>
            <div className="profile__coin-pill">
              <span>Coins</span>
              <strong>{coins}</strong>
            </div>
            <button type="button" className="secondary" onClick={() => setActiveTab('wallet')}>
              Buy coins
            </button>
            <button type="button" className="secondary" onClick={onLogout}>
              Sign out
            </button>
          </div>
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
        <article className="profile-stat">
          <h2>Coins available</h2>
          <p className="profile-stat__number">{coins}</p>
          <p className="profile-stat__hint">Each variation uses 1 coin. Keep your balance ready before campaign drops.</p>
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
          className={`profile-tab${activeTab === 'wallet' ? ' profile-tab--active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          Wallet
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

        {activeTab === 'wallet' && (
          stripePromise ? (
            <Elements stripe={stripePromise} key={stripePromise ? 'wallet-enabled' : 'wallet-disabled'}>
              <WalletPanel user={user} token={token} onUserUpdate={onUserUpdate} />
            </Elements>
          ) : (
            <div className="profile-panel__empty">
              <p>Connect your Stripe publishable key to enable in-app coin purchases.</p>
              <p className="profile-panel__hint">Set VITE_STRIPE_PUBLISHABLE_KEY in the client environment.</p>
            </div>
          )
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
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [libraryStatus, setLibraryStatus] = useState({ loading: false, error: '' })
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })
  const [profileModal, setProfileModal] = useState({ open: false, initialTab: 'overview' })
  const [viewerState, setViewerState] = useState({ open: false, src: '', alt: '' })

  // Debug: log sessions changes
  useEffect(() => {
    console.log('[sessions state changed]', sessions.length, sessions)
  }, [sessions])

  const updateUserSnapshot = useCallback(
    (partial) => {
      setUser((previous) => (previous ? { ...previous, ...partial } : previous))
    },
    [setUser],
  )

  const handleCoinsChange = useCallback(
    (balance) => {
      if (typeof balance !== 'number' || Number.isNaN(balance)) {
        return
      }
      updateUserSnapshot({ coins: balance })
    },
    [updateUserSnapshot],
  )

  const openWallet = useCallback(() => {
    if (!user) {
      openAuthModal('login')
      return
    }
    setProfileModal({ open: true, initialTab: 'wallet' })
  }, [user])

  const loadSessions = useCallback(
    async (authToken) => {
      const effectiveToken = authToken || token
      if (!effectiveToken) {
        console.log('[loadSessions] No token available')
        return
      }

      console.log('[loadSessions] Loading sessions...')
      setLibraryStatus({ loading: true, error: '' })
      try {
        const data = await apiRequest('/api/sessions', { token: effectiveToken })
        const fetchedSessions = Array.isArray(data?.sessions) ? data.sessions : []
        console.log('[loadSessions] Fetched sessions:', fetchedSessions.length, fetchedSessions)
        setSessions(fetchedSessions)
        setActiveSessionId((prev) => {
          if (prev && fetchedSessions.some((session) => session.id === prev)) {
            return prev
          }
          return fetchedSessions[0]?.id || null
        })
        setLibraryStatus({ loading: false, error: '' })
      } catch (error) {
        console.error('[loadSessions] Error loading sessions:', error)
        setLibraryStatus({ loading: false, error: error.message })
      }
    },
    [token],
  )

  useEffect(() => {
    const storedToken = localStorage.getItem('pv_auth_token')
    if (!storedToken) {
      console.log('[useEffect] No stored token found')
      return
    }

    console.log('[useEffect] Found stored token, restoring session...')
    setToken(storedToken)

    ;(async () => {
      try {
        const data = await apiRequest('/auth/me', { token: storedToken })
        console.log('[useEffect] Auth response:', data)
        if (data?.user) {
          console.log('[useEffect] User authenticated:', data.user.email)
          setUser(data.user)
          await loadSessions(storedToken)
        }
      } catch (error) {
        console.warn('[useEffect] Session restore failed', error)
        localStorage.removeItem('pv_auth_token')
        setToken('')
      }
    })()
  }, [loadSessions])

  const openAuthModal = (mode) => {
    setAuthModal({ open: true, mode })
  }

  const closeAuthModal = () => setAuthModal((prev) => ({ ...prev, open: false }))

  const handleAuthenticate = async ({
    provider,
    mode,
    name,
    email,
    password,
    credential,
    referralCode,
    consentPrivacy,
    consentMarketing,
  }) => {
    try {
      let data

      if (provider === 'google') {
        if (!credential) {
          return { success: false, error: 'Google sign-in is not configured.' }
        }
        data = await apiRequest('/auth/google', {
          method: 'POST',
          body: {
            credential,
            acceptPrivacy: Boolean(consentPrivacy),
            marketingOptIn: Boolean(consentMarketing),
          },
        })
      } else if (mode === 'register') {
        data = await apiRequest('/auth/register', {
          method: 'POST',
          body: {
            name,
            email,
            password,
            referralCode,
            acceptPrivacy: Boolean(consentPrivacy),
            marketingOptIn: Boolean(consentMarketing),
          },
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
    setActiveSessionId(null)
    localStorage.removeItem('pv_auth_token')
    setProfileModal({ open: false, initialTab: 'overview' })
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
          customPrompt: session.customPrompt,
          categoryId: session.categoryId,
          categoryLabel: session.categoryLabel,
          subcategoryId: session.subcategoryId,
          subcategoryLabel: session.subcategoryLabel,
          coinsSpent: session.coinsSpent,
          title: session.title,
        },
        token,
      })

      const saved = response?.session || session
      setSessions((prev) => [saved, ...prev])
      setActiveSessionId(saved.id || null)
      setLibraryStatus({ loading: false, error: '' })
    } catch (error) {
      setLibraryStatus({ loading: false, error: error.message })
    }
  }

  return (
    <div className="app-shell app-shell--chat">
      <main className="app-main app-main--chat">
        <Generator
          user={user}
          token={token}
          coins={user?.coins ?? 0}
          onCoinsChange={handleCoinsChange}
          onViewImage={openImageViewer}
          onRequestTopUp={openWallet}
          onSessionComplete={handleSessionComplete}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onRefreshSessions={() => loadSessions(token)}
          onOpenProfile={() => {
            if (!user) {
              openAuthModal('login')
              return
            }
            if (!sessions.length) {
              loadSessions()
            }
            setProfileModal({ open: true, initialTab: 'overview' })
          }}
        />
      </main>

      {authModal.open && (
        <AuthModal
          mode={authModal.mode}
          onClose={closeAuthModal}
          onAuthenticate={handleAuthenticate}
          onChangeMode={(nextMode) => setAuthModal({ open: true, mode: nextMode })}
          googleClientId={GOOGLE_CLIENT_ID}
        />
      )}

      {profileModal.open && user && (
        <ProfileModal
          user={user}
          sessions={sessions}
          status={libraryStatus}
          onRefresh={() => loadSessions()}
          onViewImage={(src, alt) => openImageViewer({ src, alt })}
          onLogout={handleLogout}
          onClose={() => setProfileModal({ open: false, initialTab: 'overview' })}
          token={token}
          onUserUpdate={updateUserSnapshot}
          stripePromise={stripePromise}
          initialTab={profileModal.initialTab}
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
