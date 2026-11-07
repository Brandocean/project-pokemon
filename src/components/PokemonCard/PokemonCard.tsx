import type { PokemonDetail } from '../../types/types'

interface PokemonCardProps {
  pokemon: PokemonDetail
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  const image = pokemon.sprites.other?.['official-artwork']?.front_default
    || pokemon.sprites.front_default
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

  return (
    <li className="card">
      <img
        className="card__image"
        src={image || ''}
        alt={`Imagen oficial de ${pokemonName}`}
      />
      <div className="card__description">
        <h2 className="card__title">{pokemonName}</h2>
        <p className="card__number">#{String(pokemon.id).padStart(3, '0')}</p>
      </div>
    </li>
  )
}

export default PokemonCard
