import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import type { FavoriteData } from '../../types/types'
import { ApiRequestError } from '../../utils/apiRequest'
import { getFavorites, removeFavorite } from '../../utils/backendApi'
import Loader from '../Loader/Loader'

function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removalMessage, setRemovalMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
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
          navigate('/signin', { replace: true })
          return
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar tus favoritos.',
        )
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [logout, navigate, retryCount])

  const handleRetry = () => {
    setIsLoading(true)
    setErrorMessage('')
    setRetryCount((count) => count + 1)
  }

  const handleRemove = async (favorite: FavoriteData) => {
    setRemovingId(favorite._id)
    setRemovalMessage('')

    try {
      await removeFavorite(favorite._id)
      setFavorites((currentFavorites) =>
        currentFavorites.filter((item) => item._id !== favorite._id),
      )
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.status === 401) {
        logout()
        navigate('/signin', { replace: true })
        return
      }

      if (error instanceof ApiRequestError && error.status === 403) {
        setRemovalMessage('No puedes eliminar un favorito que no te pertenece.')
      } else if (error instanceof ApiRequestError && error.status === 404) {
        setRemovalMessage('El favorito ya no existe.')
        setFavorites((currentFavorites) =>
          currentFavorites.filter((item) => item._id !== favorite._id),
        )
      } else {
        setRemovalMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo eliminar el favorito.',
        )
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
                <div className="card__button">
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
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

export default Favorites
