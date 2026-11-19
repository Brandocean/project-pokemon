import { useToast } from '../../contexts/ToastContext'

function InfoTooltip() {
  const { toast, dismiss } = useToast()

  if (!toast) {
    return null
  }

  return (
    <div
      className={`info-tooltip info-tooltip_${toast.type}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <p className="info-tooltip__message">{toast.message}</p>
      <button
        className="info-tooltip__close"
        type="button"
        aria-label="Cerrar aviso"
        onClick={dismiss}
      >
        ×
      </button>
    </div>
  )
}

export default InfoTooltip
