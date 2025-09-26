import { useEffect, useMemo, useState } from 'react'
import '../styles/CookieConsent.css'

const STORAGE_KEY = 'pv_cookie_preferences'

const COOKIE_TABS = [
  {
    id: 'essential',
    label: 'Essential',
    description:
      'Required for core functionality like authentication, session security, and saving your generated sessions. These cannot be disabled.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description:
      'Help us understand feature usage so we can improve prompts, responsiveness, and the overall creator experience. Optional and anonymised.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description:
      'Allow curated updates about new styling packs and product launch tools. Opt in to stay in the loop.',
  },
]

const DEFAULT_PREFERENCES = {
  essential: true,
  analytics: false,
  marketing: false,
}

function readStoredPreferences() {
  if (typeof window === 'undefined') {
    return { preferences: DEFAULT_PREFERENCES, consented: false }
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (!stored || typeof stored !== 'object') {
      return { preferences: DEFAULT_PREFERENCES, consented: false }
    }

    return {
      preferences: { ...DEFAULT_PREFERENCES, ...(stored.preferences || {}) },
      consented: Boolean(stored.consented),
    }
  } catch {
    return { preferences: DEFAULT_PREFERENCES, consented: false }
  }
}

function persistPreferences(preferences, consented) {
  if (typeof window === 'undefined') {
    return
  }

  const payload = {
    preferences: { ...DEFAULT_PREFERENCES, ...preferences, essential: true },
    consented,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export default function CookieConsent() {
  const stored = useMemo(readStoredPreferences, [])
  const [isOpen, setIsOpen] = useState(!stored.consented)
  const [activeTab, setActiveTab] = useState('essential')
  const [choice, setChoice] = useState(stored.preferences)
  const [consented, setConsented] = useState(stored.consented)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const { style } = document.body
    const previousOverflow = style.overflow
    style.overflow = 'hidden'

    return () => {
      style.overflow = previousOverflow
    }
  }, [isOpen])

  const handleAcceptAll = () => {
    const acceptedPreferences = { essential: true, analytics: true, marketing: true }
    persistPreferences(acceptedPreferences, true)
    setChoice(acceptedPreferences)
    setConsented(true)
    setIsOpen(false)
  }

  const handleRejectNonEssential = () => {
    const minimalPreferences = { essential: true, analytics: false, marketing: false }
    persistPreferences(minimalPreferences, true)
    setChoice(minimalPreferences)
    setConsented(true)
    setIsOpen(false)
  }

  const handleSave = () => {
    persistPreferences(choice, true)
    setConsented(true)
    setIsOpen(false)
  }

  const togglePreference = (key) => {
    if (key === 'essential') {
      return
    }

    setChoice((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const openPreferences = () => {
    const snapshot = readStoredPreferences()
    setChoice(snapshot.preferences)
    setActiveTab('essential')
    setIsOpen(true)
  }

  return (
    <>
      <button type="button" className="cookie-trigger" onClick={openPreferences} aria-haspopup="dialog">
        GDPR & Cookies
      </button>

      {isOpen && (
        <div className="cookie-consent__backdrop" role="presentation">
          <section
            className="cookie-consent"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-heading"
          >
            <header className="cookie-consent__header">
              <div>
                <p className="cookie-consent__eyebrow">GDPR compliance</p>
                <h2 id="cookie-consent-heading">We respect how you control your data</h2>
                <p className="cookie-consent__summary">
                  Product Variations uses cookies so you can stay signed in, keep your library in sync, and help us improve
                  the generator. Choose what works for you. You can revisit these settings anytime using the GDPR button.
                </p>
              </div>
            </header>

            <div className="cookie-consent__body">
              <nav className="cookie-consent__tabs" aria-label="Cookie categories">
                {COOKIE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`cookie-tab${activeTab === tab.id ? ' cookie-tab--active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="cookie-consent__content">
                {COOKIE_TABS.map((tab) => (
                  <article
                    key={tab.id}
                    className={`cookie-panel${activeTab === tab.id ? ' cookie-panel--active' : ''}`}
                    aria-hidden={activeTab !== tab.id}
                  >
                    <h3>{tab.label} cookies</h3>
                    <p>{tab.description}</p>

                    <label className={`cookie-toggle${tab.id === 'essential' ? ' cookie-toggle--disabled' : ''}`}>
                      <input
                        type="checkbox"
                        checked={Boolean(choice[tab.id])}
                        onChange={() => togglePreference(tab.id)}
                        disabled={tab.id === 'essential'}
                      />
                      <span>{choice[tab.id] ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </article>
                ))}
              </div>
            </div>

            <footer className="cookie-consent__footer">
              <div className="cookie-consent__links">
                <a href="/cookie-policy" target="_blank" rel="noreferrer">
                  Cookie policy
                </a>
                <a href="/privacy" target="_blank" rel="noreferrer">
                  Privacy notice
                </a>
              </div>
              <div className="cookie-consent__actions">
                <button type="button" className="secondary" onClick={handleRejectNonEssential}>
                  Essential only
                </button>
                <button type="button" className="secondary" onClick={handleAcceptAll}>
                  Accept all
                </button>
                <button type="button" className="primary" onClick={handleSave}>
                  Save preferences
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}

      {!consented && <div className="cookie-consent__scrim" aria-hidden="true" />}
    </>
  )
}
