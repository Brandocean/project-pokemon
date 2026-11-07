function Main() {
  return (
    <main className="content">
      <h1 className="content__title">Pokédex</h1>

      <section className="content__search" aria-label="Buscar Pokémon">
        <div className="content__search-placeholder">
          Buscador de Pokémon
        </div>
      </section>

      <section className="content__results" aria-label="Resultados de Pokémon">
        <div className="content__results-placeholder">
          Los Pokémon aparecerán aquí.
        </div>
      </section>
    </main>
  )
}

export default Main
