function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <p className="footer__copyright">
        © {currentYear} Pokédex. Datos proporcionados por PokeAPI.
      </p>
    </footer>
  )
}

export default Footer
