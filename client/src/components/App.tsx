import { Route, Routes } from 'react-router-dom'
import AboutAuthor from './About/About'
import { CurrentUserProvider } from '../contexts/CurrentUserProvider'
import Footer from './Footer/Footer'
import Header from './Header/Header'
import NotFound from './NotFound/NotFound'
import Pokedex from './Pokedex/Pokedex'
import Register from './Register/Register'
import Login from './Login/Login'

function App() {
  return (
    <CurrentUserProvider>
      <div className="page">
        <Header />
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/about" element={<AboutAuthor />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </CurrentUserProvider>
  )
}

export default App
