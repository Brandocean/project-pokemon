import type { SubmitEvent } from 'react'

interface SearchFormProps {
  searchTerm: string
  onSearchTermChange: (searchTerm: string) => void
  onSearch: (searchTerm: string) => void
}

function SearchForm({
  searchTerm,
  onSearchTermChange,
  onSearch,
}: SearchFormProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(searchTerm.trim())
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
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
        <button className="search-form__button" type="submit">
          <svg
            className="search-form__icon"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
          Buscar
        </button>
      </div>
    </form>
  )
}

export default SearchForm
