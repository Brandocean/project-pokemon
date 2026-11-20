import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import type { PokemonDetail } from '../../types/types'
import { addFavorite } from '../../utils/backendApi'
import { ApiRequestError } from '../../utils/apiRequest'
import { useToast } from '../../contexts/ToastContext'

interface PokemonCardProps {
  pokemon: PokemonDetail
  onSelect: (pokemon: PokemonDetail) => void
}

function PokemonCard({ pokemon, onSelect }: PokemonCardProps) {
  const { notify } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [favoriteError, setFavoriteError] = useState('')
  const [favoriteSaved, setFavoriteSaved] = useState(false)
  const { isAuthenticated, isLoading, logout } = useCurrentUser()
  const navigate = useNavigate()
  const image = pokemon.sprites.other?.['official-artwork']?.front_default
    || pokemon.sprites.front_default
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

  const handleSaveFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/signin')
      return
    }

    setIsSaving(true)
    setFavoriteError('')

    try {
      await addFavorite({
        pokemonId: pokemon.id,
        name: pokemon.name,
        image: image || '',
        types: pokemon.types.map(({ type }) => type.name),
      })
      setFavoriteSaved(true)
      notify(`${pokemonName} se agregó a tus favoritos.`)
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.status === 401) {
        setFavoriteError('Tu sesión expiró. Inicia sesión nuevamente.')
        notify('Tu sesión expiró. Inicia sesión nuevamente.', 'error')
        logout()
        navigate('/signin')
        return
      }
      if (
        error instanceof ApiRequestError && error.status === 409
      ) {
        setFavoriteError('Este Pokémon ya está guardado en tus favoritos.')
        notify('Este Pokémon ya está guardado en tus favoritos.', 'error')
        setFavoriteSaved(true)
      } else {
        const message = error instanceof Error
          ? error.message
          : 'No se pudo guardar el Pokémon.'
        setFavoriteError(message)
        notify(message, 'error')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <li className="card">
      <button
        className="card__button"
        type="button"
        aria-label={`Ver detalles de ${pokemonName}`}
        onClick={() => onSelect(pokemon)}
      >
        <img
          className="card__image"
          src={image || ''}
          alt={`Imagen oficial de ${pokemonName}`}
          loading="lazy"
          decoding="async"
        />
        <span className="card__description">
          <span className="card__title">{pokemonName}</span>
          <span className="card__number">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        </span>
      </button>
      <div className="card__favorite">
        {!isLoading && (
          isAuthenticated ? (
            <button
              className="card__favorite-button"
              type="button"
              disabled={isSaving || favoriteSaved}
              onClick={handleSaveFavorite}
            >
              {isSaving
                ? 'Guardando...'
                : favoriteSaved
                  ? 'Guardado'
                  : 'Guardar en favoritos'}
            </button>
          ) : (
            <button
              className="card__favorite-button"
              type="button"
              onClick={handleSaveFavorite}
            >
              Iniciar sesión para guardar
            </button>
          )
        )}
        {favoriteError && (
          <p className="card__favorite-message" role="alert">
            {favoriteError}
          </p>
        )}
      </div>
    </li>
  )
}

export default PokemonCard
