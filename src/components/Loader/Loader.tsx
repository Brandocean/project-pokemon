function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span className="loader__text">Cargando Pokémon...</span>
    </div>
  )
}

export default Loader
