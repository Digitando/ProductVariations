import { useEffect, useRef, useState } from 'react'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const VALID_BUTTON_TEXTS = new Set(['signin_with', 'signup_with', 'continue_with', 'signin'])

function loadGoogleScript({ onLoad, onError }) {
  if (window.google?.accounts?.id) {
    onLoad()
    return () => {}
  }

  let script = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)

  const cleanup = () => {
    script?.removeEventListener('load', handleLoad)
    script?.removeEventListener('error', handleError)
  }

  const handleLoad = () => {
    cleanup()
    if (script) {
      script.dataset.googleIdentityState = 'loaded'
    }
    onLoad()
  }

  const handleError = () => {
    cleanup()
    if (script) {
      script.dataset.googleIdentityState = 'error'
    }
    onError?.()
  }

  if (script) {
    if (script.dataset.googleIdentityState === 'loaded') {
      onLoad()
      return () => {}
    }
    if (script.dataset.googleIdentityState === 'error') {
      onError?.()
      return () => {}
    }
  } else {
    script = document.createElement('script')
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.dataset.googleIdentityState = 'pending'
    document.head.appendChild(script)
  }

  if (!script.dataset.googleIdentityState) {
    script.dataset.googleIdentityState = 'pending'
  }

  script.addEventListener('load', handleLoad)
  script.addEventListener('error', handleError)

  return cleanup
}

export default function GoogleSignInButton({ clientId, onCredential, text = 'Continue with Google', buttonText = 'signin_with' }) {
  const buttonRef = useRef(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const containerElement = buttonRef.current

    if (!clientId || !containerElement) {
      return
    }

    let isMounted = true

    const detachListener = loadGoogleScript({
      onLoad: () => {
        if (!isMounted || !window.google?.accounts?.id) {
          return
        }

        setLoadError(false)

        const normalizedButtonText = VALID_BUTTON_TEXTS.has(buttonText) ? buttonText : 'signin_with'

        const handleCredentialResponse = (response) => {
          if (!isMounted) {
            return
          }
          if (response?.credential) {
            onCredential(response.credential)
          } else {
            onCredential(null)
          }
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          itp_support: true,
        })

        if (!containerElement) {
          return
        }

        containerElement.innerHTML = ''

        const measuredWidth = Math.max(containerElement.offsetWidth || 0, 0)
        const renderWidth = measuredWidth ? String(Math.min(Math.max(measuredWidth, 200), 400)) : undefined

        window.google.accounts.id.renderButton(containerElement, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: normalizedButtonText,
          ...(renderWidth ? { width: renderWidth } : {}),
        })
      },
      onError: () => {
        if (!isMounted) {
          return
        }
        setLoadError(true)
      },
    })

    return () => {
      isMounted = false
      detachListener?.()
      if (containerElement) {
        containerElement.innerHTML = ''
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
    }
  }, [clientId, onCredential, buttonText])

  if (!clientId || loadError) {
    return (
      <button type="button" className="google-button--fallback" onClick={() => onCredential(null)}>
        {text}
      </button>
    )
  }

  return <div ref={buttonRef} className="google-button__container" />
}
