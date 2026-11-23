import Link from 'next/link'

import styles from '../styles/Home.module.css'
import Title from '../components/title'
import Rules from '../components/rules'

const Home = () => (
  <>
    <Title
      title='Amigo Secreto da Família'
      description='Este é o melhor amigo secreto que o mundo vai ver'
    />

    <Rules />

    <p className={styles.hint}>
      Cada um recebe pelo WhatsApp um link só seu, onde descobre quem tirou e
      cadastra as suas 2 opções de presente.
    </p>

    <Link href="/presentes">
      <button className={`${styles.button} ${styles.spaced}`}>
        Ver lista de presentes 🎁
      </button>
    </Link>

    <Link href="/draw">
      <button className={styles.button}>
        Área do organizador
      </button>
    </Link>
  </>
)

export default Home
