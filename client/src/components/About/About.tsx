import authorImage from '../../images/author.png'
import githubImage from '../../images/social/github.svg'
import linkedinImage from '../../images/social/linkedin.svg'
import portfolioImage from '../../images/social/link.svg'

function AboutAuthor() {
  return (
    <main className="content about">
      <h1 className="content__title">Sobre el autor</h1>

      <article className="about__card">
        <img
          className="about__image"
          src={authorImage}
          alt="Retrato ilustrado de Brandon Rivera Zúñiga"
        />

        <section className="about__description" aria-labelledby="about-author-title">
          <h2 className="about__title" id="about-author-title">
            Hola, soy Brandon
          </h2>
          <p className="about__text">
            Soy desarrollador full-stack en formación, apasionado por crear
            interfaces web accesibles, responsivas y fáciles de usar. Esta
            Pokédex fue desarrollada con React, TypeScript y datos obtenidos
            de PokeAPI como parte de mi aprendizaje.
          </p>
          <nav className="about__socials" aria-label="Redes sociales y portafolio">
            <a
              className="about__social-link"
              href="https://github.com/Brandocean"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="about__social-icon" src={githubImage} alt="" />
              GitHub
            </a>
            <a
              className="about__social-link"
              href="https://www.linkedin.com/in/brandon-rz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="about__social-icon" src={linkedinImage} alt="" />
              LinkedIn
            </a>
            <a
              className="about__social-link"
              href="https://brandonrz.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="about__social-icon" src={portfolioImage} alt="" />
              Portafolio
            </a>
          </nav>
        </section>
      </article>
    </main>
  )
}

export default AboutAuthor
