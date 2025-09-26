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

const VIEWS = {
  HOME: 'home',
  GENERATOR: 'generator',
  LIBRARY: 'library',
  PROFILE: 'profile',
  COOKIE_POLICY: 'cookie-policy',
  PRIVACY: 'privacy-notice',
}

const NAV_ITEMS = [
  { id: VIEWS.HOME, label: 'Home' },
  { id: VIEWS.GENERATOR, label: 'Create', requiresAuth: true },
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

function AuthModal({ mode, onClose, onAuthenticate, onNavigate, googleClientId }) {
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isRegister && !formData.consentPrivacy) {
        setError('Please acknowledge the privacy policy and GDPR terms to continue.')
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

    if (!formData.consentPrivacy) {
      setError('Please acknowledge the privacy policy and GDPR terms to continue.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const result = await onAuthenticate({
        provider: 'google',
        credential,
        consentPrivacy: formData.consentPrivacy,
        consentMarketing: formData.consentMarketing,
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
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        if (typeof onNavigate === 'function') {
                          onClose()
                          onNavigate(VIEWS.PRIVACY)
                        }
                      }}
                    >
                      Privacy Policy
                    </button>{' '}
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
        <p className="hero__tagline">Created by dropshippers for dropshippers, so every launch feels effortless.</p>
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

function HomeContent({ onStart, onViewCookie, onViewPrivacy }) {
  return (
    <section className="home-content">
      <article className="home-section home-section--primary">
        <div>
          <h2>Launch-ready visuals without a full photo team</h2>
          <p>
            Product Variations automates model shots, close-ups, and product copy so you can publish faster. Every render
            is cropped to a perfect 1:1 square, ready for marketplaces and ads.
          </p>
        </div>
        <ul>
          <li>Upload one clean garment photo and pick your styling cues.</li>
          <li>Generate consistent hero, detail, and lifestyle angles in a single run.</li>
          <li>Export paired copy decks that stay true to the fabric and fit.</li>
        </ul>
        <div className="home-section__actions">
          <button type="button" className="primary" onClick={onStart}>
            Generate a look
          </button>
          <span>Every account starts with 2 free coins.</span>
        </div>
      </article>

      <article className="home-section home-section--grid">
        <div className="home-card">
          <h3>Fair-play coin system</h3>
        <p>
          Each generated photo costs 1 coin. Add coins whenever you need them—every 1&nbsp;EUR tops up 5 fresh image
          credits.
        </p>
        </div>
        <div className="home-card">
          <h3>Invite and earn more</h3>
          <p>
            Share your referral code: new users receive 2 bonus coins and you pocket 4 extra coins every time they join.
          </p>
        </div>
        <div className="home-card">
          <h3>Built for dropshipping teams</h3>
          <p>
            Keep campaigns consistent across regions with reusable prompt sets and a sharable asset library.
          </p>
        </div>
      </article>

      <article className="home-section home-section--policies">
        <h2>We respect your brand and your data</h2>
        <p>
          Learn how we use cookies to improve your sessions and how we safeguard uploads and personal information.
        </p>
        <div className="home-policy-links">
          <button type="button" className="secondary" onClick={onViewCookie}>
            Read the cookie policy
          </button>
          <button type="button" className="secondary" onClick={onViewPrivacy}>
            Review the privacy notice
          </button>
        </div>
      </article>
    </section>
  )
}

function CookiePolicyView() {
  return (
    <section className="policy">
      <header>
        <h1>Cookie Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </header>
      <article>
        <h2>1. Purpose of cookies</h2>
        <p>
          We use cookies to keep you signed in, remember your generator preferences, and understand how teams use Product
          Variations. Cookies help us keep your library secure and speed up image generation workflows.
        </p>
      </article>
      <article>
        <h2>2. Essential cookies</h2>
        <p>
          Essential cookies power authentication, session continuity, and the coin checkout process. They are required for
          the app to function. Disabling them will prevent logins, purchases, and library syncing.
        </p>
      </article>
      <article>
        <h2>3. Analytics cookies</h2>
        <p>
          We collect anonymised usage metrics to identify bottlenecks in the creation funnel. Analytics cookies never
          track product images or personal data—they only aggregate counts like “steps completed” or “downloads”.
        </p>
      </article>
      <article>
        <h2>4. Managing cookies</h2>
        <p>
          You can adjust your preferences via the cookie banner or in your browser settings. Rejecting non-essential
          cookies will not stop you from generating images, but certain convenience features may be limited.
        </p>
      </article>
      <article>
        <h2>5. Contact</h2>
        <p>
          Have a question about how we use cookies? Reach out at <a href="mailto:privacy@productvariations.app">privacy@productvariations.app</a> and our team will help.
        </p>
      </article>
    </section>
  )
}

function PrivacyNoticeView() {
  return (
    <section className="policy">
      <header>
        <h1>Privacy Notice</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </header>
      <article>
        <h2>1. Data we collect</h2>
        <p>
          When you create an account we store your name, email address, and authentication activity. Uploaded product
          images are stored securely so you can revisit generations inside your library.
        </p>
      </article>
      <article>
        <h2>2. How we use your information</h2>
        <p>
          We use your details to provide access to the generator, deliver email updates you request, and process coin
          purchases via Stripe. We never sell personal data or training assets.
        </p>
      </article>
      <article>
        <h2>3. Sharing with third parties</h2>
        <p>
          Payment information is handled by Stripe. AI rendering is performed through OpenRouter. Both providers only
          receive the minimum data needed to complete each task.
        </p>
      </article>
      <article>
        <h2>4. Your rights</h2>
        <p>
          You can request access, updates, or deletion of your data at any time. Email <a href="mailto:privacy@productvariations.app">privacy@productvariations.app</a> and we will respond within 10
          business days.
        </p>
      </article>
      <article>
        <h2>5. Retention and security</h2>
        <p>
          Accounts and image assets are retained while you remain active. Idle accounts are archived after 12 months of
          inactivity. We use encrypted storage and routine audits to keep your files safe.
        </p>
      </article>
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

function ProfileView({
  user,
  sessions = [],
  status,
  onRefresh,
  onViewImage,
  onLogout,
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
    <div className="profile">
      <header className="profile__hero">
        <div>
          <p className="profile__eyebrow">Account hub</p>
          <h1>{user.name || user.email}</h1>
          <p>Review your creator activity, manage saved sessions, and adjust contact preferences.</p>
          {joinedAt && <span className="profile__meta">Member since {joinedAt}</span>}
        </div>
        <div className="profile__hero-actions">
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
  const [profileInitialTab, setProfileInitialTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    setProfileInitialTab('wallet')
    setView(VIEWS.PROFILE)
  }, [])

  const loadSessions = useCallback(
    async (authToken) => {
      const effectiveToken = authToken || token
      if (!effectiveToken) {
        return
      }

      setLibraryStatus({ loading: true, error: '' })
      try {
        const data = await apiRequest('/api/sessions', { token: effectiveToken })
        setSessions(data?.sessions || [])
        setLibraryStatus({ loading: false, error: '' })
      } catch (error) {
        setLibraryStatus({ loading: false, error: error.message })
      }
    },
    [token],
  )

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
    localStorage.removeItem('pv_auth_token')
    setView(VIEWS.HOME)
    setProfileInitialTab('overview')
  }

  const openImageViewer = ({ src, alt }) => {
    if (!src) return
    setViewerState({ open: true, src, alt: alt || 'Generated variation' })
  }

  const closeImageViewer = () => {
    setViewerState({ open: false, src: '', alt: '' })
  }

  const handleStartGenerating = () => {
    if (!user || !token) {
      openAuthModal(user ? 'login' : 'register')
      return
    }
    setView(VIEWS.GENERATOR)
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
    if (nextView !== VIEWS.PROFILE) {
      setProfileInitialTab('overview')
    }
    setView(nextView)
    setMobileMenuOpen(false)
    if (
      (nextView === VIEWS.LIBRARY || nextView === VIEWS.PROFILE) &&
      user &&
      !sessions.length &&
      !libraryStatus.loading
    ) {
      loadSessions()
    }
  }

  const renderNavItems = ({ showLabels = false } = {}) =>
    navigationItems.map((item) => {
      const isIconOnly = Boolean(item.iconOnly) && !showLabels
      return (
        <button
          key={item.id}
          type="button"
          className={`topbar__link${view === item.id ? ' topbar__link--active' : ''}`}
          onClick={() => handleNavigate(item.id)}
          title={item.label}
        >
          {item.icon && (
            <span className="topbar__link-icon" aria-hidden={isIconOnly}>
              {item.icon}
            </span>
          )}
          {isIconOnly ? (
            <span className="sr-only">{item.label}</span>
          ) : (
            <span className="topbar__link-label">{item.label}</span>
          )}
        </button>
      )
    })

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
          {renderNavItems()}
        </nav>
        <button
          type="button"
          className="topbar__menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="topbar__actions">
          {user ? (
            <>
              <span className="topbar__coins">Coins: {user.coins ?? 0}</span>
              <button type="button" className="secondary" onClick={openWallet}>
                Buy coins
              </button>
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

      {mobileMenuOpen && (
        <div className="mobile-nav" role="dialog" aria-modal="true">
          <div className="mobile-nav__content">
            <div className="mobile-nav__header">
              <span>Menu</span>
              <button
                type="button"
                className="icon-button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <nav className="mobile-nav__links" aria-label="Mobile primary">
              {renderNavItems({ showLabels: true })}
            </nav>
            <div className="mobile-nav__actions">
              {user ? (
                <>
                  <button type="button" className="secondary" onClick={openWallet}>
                    Buy coins
                  </button>
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
          </div>
        </div>
      )}

      <main className="app-main">
        {view === VIEWS.HOME && (
          <>
            <Hero onGetStarted={handleStartGenerating} user={user} recentImages={heroImages} />
            <HomeContent
              onStart={handleStartGenerating}
              onViewCookie={() => setView(VIEWS.COOKIE_POLICY)}
              onViewPrivacy={() => setView(VIEWS.PRIVACY)}
            />
          </>
        )}
        {view === VIEWS.GENERATOR && (
          <Generator
            onSessionComplete={handleSessionComplete}
            onViewImage={openImageViewer}
            token={token}
            coins={user?.coins ?? 0}
            onCoinsChange={handleCoinsChange}
            onRequestTopUp={openWallet}
          />
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
            token={token}
            onUserUpdate={updateUserSnapshot}
            stripePromise={stripePromise}
            initialTab={profileInitialTab}
          />
        )}
        {view === VIEWS.COOKIE_POLICY && <CookiePolicyView />}
        {view === VIEWS.PRIVACY && <PrivacyNoticeView />}
      </main>

      {authModal.open && (
        <AuthModal
          mode={authModal.mode}
          onClose={closeAuthModal}
          onAuthenticate={handleAuthenticate}
          onNavigate={handleNavigate}
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

      <footer className="app-footer">
        <button type="button" className="app-footer__link" onClick={() => setView(VIEWS.COOKIE_POLICY)}>
          Cookie Policy
        </button>
        <button type="button" className="app-footer__link" onClick={() => setView(VIEWS.PRIVACY)}>
          Privacy Notice
        </button>
      </footer>
    </div>
  )
}

export default App
