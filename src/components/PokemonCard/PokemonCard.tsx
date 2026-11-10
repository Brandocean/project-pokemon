import type { PokemonDetail } from '../../types/types'

interface PokemonCardProps {
  pokemon: PokemonDetail
  onSelect: (pokemon: PokemonDetail) => void
}

function PokemonCard({ pokemon, onSelect }: PokemonCardProps) {
  const image = pokemon.sprites.other?.['official-artwork']?.front_default
    || pokemon.sprites.front_default
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

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
        />
        <span className="card__description">
          <span className="card__title">{pokemonName}</span>
          <span className="card__number">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        </span>
      </button>
    </li>
  )
}

export default PokemonCard
