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

        // Initialize with callback that will handle the credential
        const handleCredentialResponse = (response) => {
          if (response?.credential) {
            onCredential(response.credential)
          }
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false, // Don't cancel when clicking outside
          itp_support: true,
        })

        if (!buttonRef.current) {
          return
        }

        buttonRef.current.innerHTML = ''

        // Create a custom styled button
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'google-signin-custom-button'
        button.textContent = text

        // Use Google's OAuth2 flow with intermediate page approach
        button.onclick = async () => {
          try {
            // Create a hidden iframe to handle the authentication
            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.id = 'google-auth-iframe'
            document.body.appendChild(iframe)

            // Initialize Google One Tap for this specific interaction
            window.google.accounts.id.prompt((notification) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.warn('Google One Tap not displayed:', {
                  notDisplayedReason: notification.getNotDisplayedReason?.(),
                  skippedReason: notification.getSkippedReason?.()
                })
                // Clean up iframe
                const oldIframe = document.getElementById('google-auth-iframe')
                if (oldIframe) {
                  oldIframe.remove()
                }
              }
            })
          } catch (error) {
            console.error('Google Sign-In error:', error)
          }
        }

        buttonRef.current.appendChild(button)
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
