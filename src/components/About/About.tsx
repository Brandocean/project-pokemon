import authorImage from '../../images/author.png'

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
            Soy desarrollador frontend en formación, apasionado por crear
            interfaces web accesibles, responsivas y fáciles de usar. Esta
            Pokédex fue desarrollada con React, TypeScript y datos obtenidos
            de PokeAPI como parte de mi aprendizaje.
          </p>
        </section>
      </article>
    </main>
  )
}

export default AboutAuthor
