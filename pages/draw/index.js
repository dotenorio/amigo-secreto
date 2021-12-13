import { useState } from 'react'
import Link from 'next/link'

import styles from '../../styles/Draw.module.css'
import Title from '../../components/title'

const Home = () => {
  const [password, setPassword] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const verifyPassword = () => {
    if (input !== '' && input === 'banana') {
      setPassword(true)
      setError(false)

      return
    }

    setPassword(false)
    setError('Senha incorreta!!')
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      verifyPassword()
    }
  }

  if (!password) {
    return (
      <>
        {error
          ? <b className={styles.error}>{error}</b>
          : <b className={styles.message}>Pessoa curiosa ^_^</b>
        }
        <input
          placeholder='Digite a senha'
          onChange={event => setInput(event.target.value)}
          onKeyPress={handleKeyPress}
          value={input}
          className={styles.input}
          type='password'
        />
        <button
          className={styles.button}
          onClick={() => verifyPassword()}
        >
          Verificar
        </button>
      </>
    )
  }

  return (
    <>
      <Title
        title='Sorteio'
        description='Links para mandar no zap...'
      />

      <div className={styles.card}>
        <b>Mariana</b>
        <Link href="/i-caught/123">copiar link</Link>
      </div>

      <div className={styles.card}>
        <b>Giovana</b>
        <Link href="/i-caught/456">copiar link</Link>
      </div>
    </>
  )
}

export default Home
