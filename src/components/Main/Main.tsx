import { useEffect, useRef, useState } from 'react'
import PokemonCard from '../PokemonCard/PokemonCard'
import Loader from '../Loader/Loader'
import SearchForm from '../SearchForm/SearchForm'
import { api } from '../../utils/api'
import type { PokemonDetail } from '../../types/types'
import { PAGE_SIZE } from '../../config/constants'

function Main() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [offset, setOffset] = useState(PAGE_SIZE)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const searchRequestId = useRef(0)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const requestId = ++searchRequestId.current

    api.getPokemonPage()
      .then(({ results, next }) => {
        if (requestId === searchRequestId.current) {
          setPokemons(results)
          setOffset(PAGE_SIZE)
          setHasMore(Boolean(next))
        }
      })
      .catch((error: unknown) => {
        if (requestId === searchRequestId.current) {
          setError(error instanceof Error
            ? error.message
            : 'No se pudieron cargar los Pokémon.')
        }
      })
      .finally(() => {
        if (requestId === searchRequestId.current) {
          setIsLoading(false)
        }
      })

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }

      if (requestId === searchRequestId.current) {
        searchRequestId.current += 1
      }
    }
  }, [retryCount])

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

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    const requestId = ++searchRequestId.current

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (!searchTerm.trim()) {
      setSearchTerm('')
      setPokemons([])
      setOffset(PAGE_SIZE)
      setError('')
      setIsLoading(true)
      setHasMore(true)
      setRetryCount((currentCount) => currentCount + 1)
      return
    }

    setIsLoading(true)
    setError('')
    setHasMore(false)
    setPokemons([])

    searchTimeout.current = setTimeout(() => {
      api.searchPokemonByName(searchTerm)
        .then((matches) => {
          if (requestId === searchRequestId.current) {
            setPokemons(matches)
          }
        })
        .catch((searchError: unknown) => {
          if (requestId === searchRequestId.current) {
            setError(searchError instanceof Error
              ? searchError.message
              : 'No se pudo buscar el Pokémon.')
          }
        })
        .finally(() => {
          if (requestId === searchRequestId.current) {
            setIsLoading(false)
          }
        })
    }, 300)
  }

  const handleRetry = () => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm)
      return
    }

    setIsLoading(true)
    setError('')
    setRetryCount((currentCount) => currentCount + 1)
  }

  return (
    <main className="content">
      <h1 className="content__title">Pokédex</h1>

      <section className="content__search" aria-label="Buscar Pokémon">
        <SearchForm onSearch={handleSearch} />
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
        {!isLoading && !error && !hasMore && pokemons.length === 0 && (
          <p className="content__results-placeholder" role="status">
            No se encontraron Pokémon con ese nombre.
          </p>
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
