import { Route, Routes } from 'react-router-dom'
import AboutAuthor from './About/About'
import { CurrentUserProvider } from '../contexts/CurrentUserProvider'
import Footer from './Footer/Footer'
import Header from './Header/Header'
import NotFound from './NotFound/NotFound'
import Pokedex from './Pokedex/Pokedex'
import Register from './Register/Register'
import Login from './Login/Login'
import Favorites from './Favorites/Favorites'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import PublicRoute from './PublicRoute/PublicRoute'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function AppContent() {
  const { isAuthenticated, isLoading } = useCurrentUser()

  return (
    <div className="page">
      {!isLoading && isAuthenticated && <Header />}
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Pokedex />} />
          <Route path="/about" element={<AboutAuthor />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {!isLoading && isAuthenticated && <Footer />}
    </div>
  )
}

function App() {
  return (
    <CurrentUserProvider>
      <AppContent />
    </CurrentUserProvider>
  )
}

export default App
