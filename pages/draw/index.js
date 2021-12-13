import { useState } from 'react'

import styles from '../../styles/Draw.module.css'
import Title from '../../components/title'

const Home = () => {
  const [password, setPassword] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const verifyPassword = () => {
    console.log(input)
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
        <a href="/i-caught/123" className={styles.link}>copiar link</a>
      </div>

      <div className={styles.card}>
        <b>Giovana</b>
        <a href="/i-caught/456" className={styles.link}>copiar link</a>
      </div>
    </>
  )
}

export default Home
