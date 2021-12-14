import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'

import styles from '../../styles/Draw.module.css'
import Title from '../../components/title'

const fetcher = (url) => fetch(url).then((res) => res.json())

const Home = () => {
  const [password, setPassword] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const { data } = useSWR('/api/contentful/persons', fetcher)
  const [adaptedData, setAdaptedData] = useState(false);

  useEffect(() => {
    if (data) {
      setAdaptedData(data.items.map(item => ({ id: item.sys.id, ...item.fields })))
    }
  }, [data, setAdaptedData])

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

      <div className={styles.cardList}>
        {adaptedData && adaptedData.map(data => (
          <div className={styles.card} key={data.id}>
            <b>{data.name}</b>
            <Link href={`/i-caught/${data.id}`}>copiar link</Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home
