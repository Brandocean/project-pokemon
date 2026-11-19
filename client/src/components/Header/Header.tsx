import { NavLink, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import logo from '../../images/logo.svg'

function Header() {
  const { isAuthenticated, isLoading, logout } = useCurrentUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <header className="header">
      <NavLink to="/" className="header__logo-link" aria-label="Ir a la Pokédex">
        <img
          src={logo}
          alt="Logotipo de la Pokédex"
          className="header__logo"
        />
      </NavLink>
      <nav className="header__nav" aria-label="Navegación principal">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `header__link${isActive ? ' header__link_active' : ''}`
          }
        >
          Pokédex
        </NavLink>
        <NavLink
          to="/about"
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
