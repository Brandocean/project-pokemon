import { Route, Routes } from 'react-router-dom'
import About from './About/About'
import NotFound from './NotFound/NotFound'
import Pokedex from './Pokedex/Pokedex'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Pokedex />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
