import { useEffect, useState } from 'react'
import PokemonCard from '../PokemonCard/PokemonCard'
import Loader from '../Loader/Loader'
import { api } from '../../utils/api'
import type { PokemonDetail } from '../../types/types'

function Main() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    api.getPokemonDetails()
      .then(setPokemons)
      .catch((error: unknown) => {
        setError(error instanceof Error
          ? error.message
          : 'No se pudieron cargar los Pokémon.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [retryCount])

  const handleRetry = () => {
    setIsLoading(true)
    setError('')
    setRetryCount((currentCount) => currentCount + 1)
  }

  return (
    <main className="content">
      <h1 className="content__title">Pokédex</h1>

      <section className="content__search" aria-label="Buscar Pokémon">
        <div className="content__search-placeholder">
          Buscador de Pokémon
        </div>
      </section>

      <section className="content__results" aria-label="Resultados de Pokémon">
        {isLoading && <Loader />}
        {!isLoading && error && (
          <div className="error-message" role="alert">
            <p className="error-message__text">
              No se pudieron cargar los Pokémon. {error}
            </p>
            <button
              className="error-message__button"
              type="button"
              onClick={handleRetry}
            >
              Reintentar
            </button>
          </div>
        )}
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
