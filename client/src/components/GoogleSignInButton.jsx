import { useEffect, useRef } from 'react'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

function loadGoogleScript(onLoad) {
  if (window.google && window.google.accounts?.id) {
    onLoad()
    return
  }

  const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)
  if (existingScript) {
    existingScript.addEventListener('load', onLoad)
    return
  }

  const script = document.createElement('script')
  script.src = GOOGLE_SCRIPT_SRC
  script.async = true
  script.defer = true
  script.onload = onLoad
  document.head.appendChild(script)
}

export default function GoogleSignInButton({ clientId, onCredential, text = 'Continue with Google' }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!clientId || !buttonRef.current) {
      return
    }

    let cancelled = false

    loadGoogleScript(() => {
      if (cancelled) return
      if (!window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onCredential(response.credential)
          }
        },
      })

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'pill',
      })
    })

    return () => {
      cancelled = true
    }
  }, [clientId, onCredential])

  if (!clientId) {
    return (
      <button type="button" className="google-button" onClick={() => onCredential(null)}>
        {text}
      </button>
    )
  }

  return <div ref={buttonRef} className="google-button" />
}
