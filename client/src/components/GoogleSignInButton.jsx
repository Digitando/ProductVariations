import { useEffect, useRef, useState } from 'react'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

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
    if (!clientId || !buttonRef.current) {
      return
    }

    let cancelled = false
    let detachListener = () => {}

    detachListener = loadGoogleScript({
      onLoad: () => {
        if (cancelled) return
        if (!window.google?.accounts?.id) return

        setLoadError(false)

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              onCredential(response.credential)
            }
          },
          ux_mode: 'popup',
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        if (!buttonRef.current) {
          return
        }

        buttonRef.current.innerHTML = ''

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: buttonText,
          type: 'standard',
          shape: 'pill',
        })
      },
      onError: () => {
        if (cancelled) return
        setLoadError(true)
      },
    })

    return () => {
      cancelled = true
      detachListener?.()
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
    }
  }, [clientId, onCredential, buttonText])

  if (!clientId || loadError) {
    return (
      <button type="button" className="google-button" onClick={() => onCredential(null)}>
        {text}
      </button>
    )
  }

  return <div ref={buttonRef} className="google-button" />
}
