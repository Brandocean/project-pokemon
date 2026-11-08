import { useEffect, useState } from 'react'
import PokemonCard from '../PokemonCard/PokemonCard'
import { api } from '../../utils/api'
import type { PokemonDetail } from '../../types/types'

function Main() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([])

  useEffect(() => {
    api.getPokemonDetails()
      .then(setPokemons)
      .catch((error: unknown) => {
        console.error(error)
      })
  }, [])

  return (
    <main className="content">
      <h1 className="content__title">Pokédex</h1>

      <section className="content__search" aria-label="Buscar Pokémon">
        <div className="content__search-placeholder">
          Buscador de Pokémon
        </div>
      </section>

      <section className="content__results" aria-label="Resultados de Pokémon">
        <ul className="cards__list">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Main
