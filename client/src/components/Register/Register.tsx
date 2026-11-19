import { useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../../utils/auth'
import { useToast } from '../../contexts/ToastContext'

interface RegisterFormData {
  name: string
  email: string
  password: string
}

const initialFormData: RegisterFormData = {
  name: '',
  email: '',
  password: '',
}

function Register() {
  const { notify } = useToast()
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const user = await registerUser(formData)
      setSuccessMessage(`Registro exitoso, ${user.name}. Ya puedes iniciar sesión.`)
      notify(`Registro exitoso. Ya puedes iniciar sesión, ${user.name}.`)
      setFormData(initialFormData)
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'No se pudo completar el registro. Inténtalo de nuevo.'
      setErrorMessage(message)
      notify(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="content">
      <section className="register" aria-labelledby="register-title">
        <h1 className="content__title" id="register-title">Crear cuenta</h1>
        <form className="register__form" onSubmit={handleSubmit}>
          <label className="register__field" htmlFor="register-name">
            <span>Nombre</span>
            <input
              className="register__input"
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={30}
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </label>
          <label className="register__field" htmlFor="register-email">
            <span>Correo electrónico</span>
            <input
              className="register__input"
              id="register-email"
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
          <label className="register__field" htmlFor="register-password">
            <span>Contraseña</span>
            <input
              className="register__input"
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
          </label>
          {errorMessage && (
            <p className="register__message register__message_error" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className="register__button"
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Creando cuenta…' : 'Registrarse'}
          </button>
        </form>
        <p className="auth-form__alternate">
          ¿Ya tienes cuenta?{' '}
          <Link className="auth-form__link" to="/signin">
            Iniciar sesión
          </Link>
        </p>
        {successMessage && (
          <p className="register__message register__message_success" role="status">
            {successMessage}{' '}
            <Link className="register__link" to="/signin">
              Iniciar sesión
            </Link>
          </p>
        )}
      </section>
    </main>
  )
}

export default Register
