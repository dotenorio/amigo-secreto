import Link from 'next/link'

import styles from '../styles/Home.module.css'
import Title from '../components/title'

const Home = () => (
  <>
    <Title
      title='Amigo Secreto da Família'
      description='Este é o melhor amigo secreto que o mundo vai ver'
    />

    <Link href="/draw">
      <button className={styles.button}>
        Ver Sorteio
      </button>
    </Link>
  </>
)

export default Home
