import { useEffect, useState } from 'react'
import PokemonCard from '../PokemonCard/PokemonCard'
import Loader from '../Loader/Loader'
import { api } from '../../utils/api'
import type { PokemonDetail } from '../../types/types'
import { PAGE_SIZE } from '../../config/constants'

function Main() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [offset, setOffset] = useState(PAGE_SIZE)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    api.getPokemonPage()
      .then(({ results, next }) => {
        setPokemons(results)
        setOffset(PAGE_SIZE)
        setHasMore(Boolean(next))
      })
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

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setError('')

    api.getPokemonPage(offset)
      .then(({ results, next }) => {
        setPokemons((currentPokemons) => [
          ...currentPokemons,
          ...results,
        ])
        setOffset((currentOffset) => currentOffset + PAGE_SIZE)
        setHasMore(Boolean(next))
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar más Pokémon.')
      })
      .finally(() => {
        setIsLoadingMore(false)
      })
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
      {hasMore && !error && (
        <div className="pagination">
          <button
            className="pagination__button"
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore || isLoading}
          >
            {isLoadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </main>
  )
}

export default Main
