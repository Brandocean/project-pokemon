import { NavLink } from 'react-router-dom'
import logo from '../../images/logo.svg'

function Header() {
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
      </nav>
    </header>
  )
}

export default Header
