import type { PokemonDetail } from '../../types/types'

interface PokemonDetailsContentProps {
  pokemon: PokemonDetail
}

const statNames: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque especial',
  'special-defense': 'Defensa especial',
  speed: 'Velocidad',
}

function PokemonDetailsContent({ pokemon }: PokemonDetailsContentProps) {
  const pokemonName = pokemon.name.charAt(0).toUpperCase()
    + pokemon.name.slice(1)
  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default
    || pokemon.sprites.front_default

  return (
    <>
      {pokemonImage && (
        <img
          className="popup__image"
          src={pokemonImage}
          alt={`Imagen de ${pokemonName}`}
        />
      )}
      <p className="popup__measurements">
        <span>Altura: {pokemon.height / 10} m</span>
        <span>Peso: {pokemon.weight / 10} kg</span>
      </p>
      <h3 className="popup__section-title">Tipos</h3>
      <ul className="popup__types">
        {pokemon.types.map(({ slot, type }) => (
          <li className="popup__type" key={slot}>{type.name}</li>
        ))}
      </ul>
      <h3 className="popup__section-title">Estadísticas</h3>
      <ul className="popup__stats">
        {pokemon.stats.map(({ stat, base_stat }) => (
          <li className="popup__stat" key={stat.name}>
            <span>{statNames[stat.name] ?? stat.name}</span>
            <strong>{base_stat}</strong>
          </li>
        ))}
      </ul>
    </>
  )
}

export default PokemonDetailsContent
