import { useState, type SubmitEvent } from 'react'

interface SearchFormProps {
  onSearch: (searchTerm: string) => void
}

function SearchForm({ onSearch }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(searchTerm.trim())
    setSearchTerm('')
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="search-form__label" htmlFor="pokemon-search">
        Nombre del Pokémon
      </label>
      <div className="search-form__controls">
        <input
          className="search-form__input"
          id="pokemon-search"
          name="pokemon"
          type="search"
          placeholder="Ejemplo: Pikachu"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button className="search-form__button" type="submit">
          Buscar
        </button>
      </div>
    </form>
  )
}

export default SearchForm
