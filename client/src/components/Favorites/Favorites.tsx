import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import type { FavoriteData, PokemonDetail } from '../../types/types'
import { ApiRequestError } from '../../utils/apiRequest'
import { getFavorites, removeFavorite } from '../../utils/backendApi'
import { api } from '../../utils/api'
import Loader from '../Loader/Loader'
import { useToast } from '../../contexts/ToastContext'
import Popup from '../Popup/Popup'
import PokemonDetailsContent from '../PokemonDetailsContent/PokemonDetailsContent'

function Favorites() {
  const { notify } = useToast()
  const [favorites, setFavorites] = useState<FavoriteData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removalMessage, setRemovalMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteData | null>(null)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const detailsRequestId = useRef(0)
  const { logout } = useCurrentUser()
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true

    getFavorites()
      .then((items) => {
        if (isActive) {
          setFavorites(items)
        }
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        if (error instanceof ApiRequestError && error.status === 401) {
          logout()
          notify('Tu sesión expiró. Inicia sesión nuevamente.', 'error')
          navigate('/signin', { replace: true })
          return
        }

        const message = error instanceof Error
          ? error.message
          : 'No se pudieron cargar tus favoritos.'
        setErrorMessage(message)
        notify(message, 'error')
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [logout, navigate, notify, retryCount])

  const handleRetry = () => {
    setIsLoading(true)
    setErrorMessage('')
    setRetryCount((count) => count + 1)
  }

  const handleOpenDetails = async (favorite: FavoriteData) => {
    const requestId = ++detailsRequestId.current
    setSelectedFavorite(favorite)
    setSelectedPokemon(null)
    setDetailsError('')
    setIsLoadingDetails(true)

    try {
      const pokemon = await api.getPokemonDetail(String(favorite.pokemonId))
      if (requestId === detailsRequestId.current) {
        setSelectedPokemon(pokemon)
      }
    } catch (error: unknown) {
      if (requestId === detailsRequestId.current) {
        setDetailsError(error instanceof Error
          ? error.message
          : 'No se pudieron cargar los detalles del Pokémon.')
      }
    } finally {
      if (requestId === detailsRequestId.current) {
        setIsLoadingDetails(false)
      }
    }
  }

  const handleCloseDetails = () => {
    detailsRequestId.current += 1
    setSelectedFavorite(null)
    setSelectedPokemon(null)
    setDetailsError('')
    setIsLoadingDetails(false)
  }

  const handleRemove = async (favorite: FavoriteData) => {
    setRemovingId(favorite._id)
    setRemovalMessage('')

    try {
      await removeFavorite(favorite._id)
      setFavorites((currentFavorites) =>
        currentFavorites.filter((item) => item._id !== favorite._id),
      )
      const removedName = favorite.name.charAt(0).toUpperCase()
        + favorite.name.slice(1)
      notify(`${removedName} se eliminó de tus favoritos.`)
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.status === 401) {
        logout()
        navigate('/signin', { replace: true })
        return
      }

      if (error instanceof ApiRequestError && error.status === 403) {
        setRemovalMessage('No puedes eliminar un favorito que no te pertenece.')
        notify('No puedes eliminar un favorito que no te pertenece.', 'error')
      } else if (error instanceof ApiRequestError && error.status === 404) {
        setRemovalMessage('El favorito ya no existe.')
        notify('El favorito ya no existe.', 'error')
        setFavorites((currentFavorites) =>
          currentFavorites.filter((item) => item._id !== favorite._id),
        )
      } else {
        const message = error instanceof Error
          ? error.message
          : 'No se pudo eliminar el favorito.'
        setRemovalMessage(message)
        notify(message, 'error')
      }
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <main className="content">
      <h1 className="content__title">Mis favoritos</h1>

      {isLoading && <Loader text="Cargando favoritos..." />}

      {!isLoading && errorMessage && (
        <div className="error-message" role="alert">
          <p className="error-message__text">{errorMessage}</p>
          <button
            className="error-message__button"
            type="button"
            onClick={handleRetry}
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && removalMessage && (
        <p className="favorites__removal-message" role="alert">
          {removalMessage}
        </p>
      )}

      {!isLoading && !errorMessage && favorites.length === 0 && (
        <div className="content__results-placeholder" role="status">
          <p>Aún no tienes Pokémon favoritos.</p>
        </div>
      )}

      {!isLoading && !errorMessage && favorites.length > 0 && (
        <ul className="cards__list" aria-label="Lista de favoritos">
          {favorites.map((favorite) => {
            const name = favorite.name.charAt(0).toUpperCase()
              + favorite.name.slice(1)

            return (
              <li className="card" key={favorite._id}>
                <button
                  className="card__button"
                  type="button"
                  aria-label={`Ver detalles de ${name}`}
                  onClick={() => void handleOpenDetails(favorite)}
                >
                  <img
                    className="card__image"
                    src={favorite.image}
                    alt={`Imagen oficial de ${name}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card__description">
                    <span className="card__title">{name}</span>
                    <span className="card__number">
                      #{String(favorite.pokemonId).padStart(3, '0')}
                    </span>
                  </span>
                </button>
                <ul className="favorite-card__types" aria-label="Tipos">
                  {favorite.types.map((type) => (
                    <li className="favorite-card__type" key={type}>
                      {type}
                    </li>
                  ))}
                </ul>
                <button
                  className="favorite-card__remove"
                  type="button"
                  disabled={removingId === favorite._id}
                  onClick={() => void handleRemove(favorite)}
                >
                  {removingId === favorite._id
                    ? 'Eliminando...'
                    : 'Eliminar favorito'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <Popup
        isOpen={selectedFavorite !== null}
        title={selectedFavorite
          ? `${selectedFavorite.name.charAt(0).toUpperCase()}${selectedFavorite.name.slice(1)} #${String(selectedFavorite.pokemonId).padStart(3, '0')}`
          : ''}
        onClose={handleCloseDetails}
      >
        {selectedPokemon && (
          <PokemonDetailsContent pokemon={selectedPokemon} />
        )}
        {isLoadingDetails && <Loader text="Cargando detalles..." />}
        {!isLoadingDetails && detailsError && (
          <div className="error-message" role="alert">
            <p className="error-message__text">
              No se pudieron cargar los detalles. {detailsError}
            </p>
            {selectedFavorite && (
              <button
                className="error-message__button"
                type="button"
                onClick={() => void handleOpenDetails(selectedFavorite)}
              >
                Reintentar
              </button>
            )}
          </div>
        )}
      </Popup>
    </main>
  )
}

export default Favorites
