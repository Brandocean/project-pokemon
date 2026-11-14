import { Route, Routes } from 'react-router-dom'
import AboutAuthor from './About/About'
import Footer from './Footer/Footer'
import Header from './Header/Header'
import NotFound from './NotFound/NotFound'
import Pokedex from './Pokedex/Pokedex'

function App() {
  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/about" element={<AboutAuthor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
