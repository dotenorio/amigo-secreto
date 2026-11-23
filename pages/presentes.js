import Link from 'next/link'

import styles from '../styles/Presentes.module.css'
import Title from '../components/title'
import { getPeople } from '../lib/contentful'

// Tela pública: o que cada um pediu de presente.
// Só mostra nome e lista de desejos. Nunca quem tirou quem, telefone ou id.
const Presentes = ({ people, error }) => (
  <>
    <Title
      title='Lista de presentes 🎁'
      description='O que cada um da família pediu este ano'
    />

    {error ? (
      <p className={styles.muted}>Não foi possível carregar a lista agora. Tente de novo daqui a pouco.</p>
    ) : people.length === 0 ? (
      <p className={styles.muted}>Ninguém cadastrado ainda.</p>
    ) : (
      <ul className={styles.grid}>
        {people.map((person, index) => (
          <li key={index} className={styles.card}>
            <h2>{person.name}</h2>
            {person.wishes.length === 0 ? (
              <p className={styles.muted}>Ainda não escolheu as opções.</p>
            ) : (
              <ol className={styles.wishList}>
                {person.wishes.map((wish, i) => (
                  <li key={i}>
                    {wish.item}
                    {wish.link && (
                      <>
                        {' '}
                        <a href={wish.link} target='_blank' rel='noopener noreferrer nofollow'>
                          ver link ↗
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ul>
    )}

    <Link href='/' className={styles.back}>← Voltar</Link>
  </>
)

export const getServerSideProps = async ({ res }) => {
  try {
    const people = (await getPeople())
      .map(({ name, wishes }) => ({ name, wishes }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

    // Cache curto na CDN para não estourar o limite do Contentful.
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return { props: { people, error: false } }
  } catch (err) {
    console.error(err)
    res.setHeader('Cache-Control', 'no-store')
    return { props: { people: [], error: true } }
  }
}

export default Presentes
