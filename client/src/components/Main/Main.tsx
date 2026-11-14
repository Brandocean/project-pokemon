import { useCallback, useEffect, useRef, useState } from 'react'
import PokemonCard from '../PokemonCard/PokemonCard'
import Loader from '../Loader/Loader'
import Popup from '../Popup/Popup'
import SearchForm from '../SearchForm/SearchForm'
import { ApiError, api } from '../../utils/api'
import type { PokemonDetail } from '../../types/types'
import { PAGE_SIZE } from '../../config/constants'

function Main() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasNoResults, setHasNoResults] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [offset, setOffset] = useState(PAGE_SIZE)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const searchRequestId = useRef(0)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSearchTerm = useRef('')

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
    lastSearchTerm.current = searchTerm
    setSearchTerm('')
    const requestId = ++searchRequestId.current

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (!searchTerm.trim()) {
      setPokemons([])
      setOffset(PAGE_SIZE)
      setError('')
      setHasNoResults(false)
      setIsLoading(true)
      setHasMore(true)
      setRetryCount((currentCount) => currentCount + 1)
      return
    }

    setIsLoading(true)
    setError('')
    setHasNoResults(false)
    setHasMore(false)
    setPokemons([])

    searchTimeout.current = setTimeout(() => {
      api.searchPokemonByName(searchTerm)
        .then((matches) => {
          if (requestId === searchRequestId.current) {
            setPokemons(matches)
            setHasNoResults(matches.length === 0)
          }
        })
        .catch((searchError: unknown) => {
          if (requestId === searchRequestId.current) {
            if (searchError instanceof ApiError && searchError.status === 404) {
              setHasNoResults(true)
              return
            }

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
    if (lastSearchTerm.current) {
      handleSearch(lastSearchTerm.current)
      return
    }

    setIsLoading(true)
    setError('')
    setRetryCount((currentCount) => currentCount + 1)
  }

  const handleClearSearch = () => {
    searchRequestId.current += 1

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    lastSearchTerm.current = ''
    setSearchTerm('')
    setPokemons([])
    setOffset(PAGE_SIZE)
    setError('')
    setHasNoResults(false)
    setHasMore(true)
    setIsLoading(true)
    setRetryCount((currentCount) => currentCount + 1)
  }

  const handleClosePopup = useCallback(() => {
    setSelectedPokemon(null)
  }, [])

  const pokemonName = selectedPokemon
    ? selectedPokemon.name.charAt(0).toUpperCase()
      + selectedPokemon.name.slice(1)
    : ''
  const pokemonImage = selectedPokemon?.sprites.other?.['official-artwork']?.front_default
    || selectedPokemon?.sprites.front_default
  const statNames: Record<string, string> = {
    hp: 'PS',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque especial',
    'special-defense': 'Defensa especial',
    speed: 'Velocidad',
  }

  return (
    <main className="content">
      <h1 className="content__title">Pokédex</h1>

      <section className="content__search" aria-label="Buscar Pokémon">
        <SearchForm
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
        />
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
          hasNoResults && (
            <div className="content__results-placeholder" role="status">
              <p>No se encontraron Pokémon con ese nombre.</p>
              <button
                className="error-message__button"
                type="button"
                onClick={handleClearSearch}
              >
                Mostrar todos los Pokémon
              </button>
            </div>
          )
        )}
        <ul className="cards__list">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onSelect={setSelectedPokemon}
            />
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
      <Popup
        isOpen={selectedPokemon !== null}
        title={`${pokemonName} #${String(selectedPokemon?.id ?? '').padStart(3, '0')}`}
        onClose={handleClosePopup}
      >
        {selectedPokemon && (
          <>
            {pokemonImage && (
              <img
                className="popup__image"
                src={pokemonImage}
                alt={`Imagen de ${pokemonName}`}
              />
            )}
            <p className="popup__measurements">
              <span>Altura: {selectedPokemon.height / 10} m</span>
              <span>Peso: {selectedPokemon.weight / 10} kg</span>
            </p>
            <h3 className="popup__section-title">Tipos</h3>
            <ul className="popup__types">
              {selectedPokemon.types.map(({ slot, type }) => (
                <li className="popup__type" key={slot}>{type.name}</li>
              ))}
            </ul>
            <h3 className="popup__section-title">Estadísticas</h3>
            <ul className="popup__stats">
              {selectedPokemon.stats.map(({ stat, base_stat }) => (
                <li className="popup__stat" key={stat.name}>
                  <span>{statNames[stat.name] ?? stat.name}</span>
                  <strong>{base_stat}</strong>
                </li>
              ))}
            </ul>
          </>
        )}
      </Popup>
    </main>
  )
}

export default Main
