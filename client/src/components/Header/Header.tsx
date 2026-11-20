import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useToast } from '../../contexts/ToastContext'
import logo from '../../images/logo.svg'

function Header() {
  const { isAuthenticated, isLoading, logout } = useCurrentUser()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeMenuOnEscape)
    return () => window.removeEventListener('keydown', closeMenuOnEscape)
  }, [])

  const handleLogout = () => {
    logout()
    notify('Sesión cerrada.')
    setIsMenuOpen(false)
    navigate('/signin')
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <NavLink
        to="/"
        className="header__logo-link"
        aria-label="Ir a la Pokédex"
        onClick={closeMenu}
      >
        <img
          src={logo}
          alt="Logotipo de la Pokédex"
          className="header__logo"
        />
      </NavLink>
      <button
        className="header__menu-button"
        type="button"
        aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span className="header__menu-line" />
        <span className="header__menu-line" />
        <span className="header__menu-line" />
      </button>
      <nav
        id="main-navigation"
        className={`header__nav${isMenuOpen ? ' header__nav_open' : ''}`}
        aria-label="Navegación principal"
      >
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            `header__link${isActive ? ' header__link_active' : ''}`
          }
        >
          Pokédex
        </NavLink>
        <NavLink
          to="/about"
          onClick={closeMenu}
          className={({ isActive }) =>
            `header__link${isActive ? ' header__link_active' : ''}`
          }
        >
          Sobre el autor
        </NavLink>
        {!isLoading && (isAuthenticated ? (
          <>
            <NavLink
              to="/favorites"
              onClick={closeMenu}
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link_active' : ''}`
              }
            >
              Favoritos
            </NavLink>
            <button
              className="header__logout"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <NavLink
            to="/signin"
            onClick={closeMenu}
            className={({ isActive }) =>
              `header__link${isActive ? ' header__link_active' : ''}`
            }
          >
            Iniciar sesión
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
