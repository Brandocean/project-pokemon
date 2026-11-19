import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { getCurrentUser, loginUser } from '../../utils/auth'
import { useToast } from '../../contexts/ToastContext'

interface LoginFormData {
  email: string
  password: string
}

const initialFormData: LoginFormData = {
  email: '',
  password: '',
}

function Login() {
  const { notify } = useToast()
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { login } = useCurrentUser()

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { token } = await loginUser(formData)
      const user = await getCurrentUser(token)
      login(user, token)
      notify(`Sesión iniciada. Bienvenido, ${user.name}.`)
      navigate('/')
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'No se pudo iniciar sesión. Inténtalo de nuevo.'
      setErrorMessage(message)
      notify(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="content">
      <section className="auth-form" aria-labelledby="login-title">
        <h1 className="content__title" id="login-title">Iniciar sesión</h1>
        <form className="auth-form__form" onSubmit={handleSubmit}>
          <label className="auth-form__field" htmlFor="login-email">
            <span>Correo electrónico</span>
            <input
              className="auth-form__input"
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </label>
          <label className="auth-form__field" htmlFor="login-password">
            <span>Contraseña</span>
            <input
              className="auth-form__input"
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
          </label>
          {errorMessage && (
            <p className="auth-form__message auth-form__message_error" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className="auth-form__button"
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="auth-form__alternate">
          ¿No tienes cuenta?{' '}
          <Link className="auth-form__link" to="/signup">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login
