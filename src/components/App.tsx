import { Route, Routes } from 'react-router-dom'
import About from './About/About'
import Header from './Header/Header'
import NotFound from './NotFound/NotFound'
import Pokedex from './Pokedex/Pokedex'

function App() {
  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
