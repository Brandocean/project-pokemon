import { useEffect, useRef, type ReactNode } from 'react'

interface PopupProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

function Popup({ isOpen, title, onClose, children }: PopupProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previouslyFocusedElement = document.activeElement
    const previousBodyOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="popup">
      <section
        className="popup__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <button
          ref={closeButtonRef}
          className="popup__close"
          type="button"
          aria-label="Cerrar ventana"
          onClick={onClose}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <h2 className="popup__title" id="popup-title">{title}</h2>
        {children}
      </section>
    </div>
  )
}

export default Popup
