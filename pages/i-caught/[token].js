import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'

const ICaught = () => {
  const router = useRouter()
  const { token } = router.query
  const [reveal, setReveal] = useState(false)
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    if (!token) return

    const load = async () => {
      try {
        const res = await fetch(`/api/reveal/${encodeURIComponent(token)}`)
        const data = await res.json().catch(() => ({}))

        if (res.status === 404) return setState({ status: 'invalid' })
        if (!res.ok) throw new Error(data.error)

        setState({ status: 'ready', ...data })
      } catch {
        setState({ status: 'error' })
      }
    }
    load()
  }, [token])

  const head = (
    <Head>
      <meta name='robots' content='noindex, nofollow' />
      <meta name='referrer' content='no-referrer' />
    </Head>
  )

  if (state.status === 'loading') {
    return <>{head}<p>Carregando...</p></>
  }

  if (state.status === 'invalid' || state.status === 'error') {
    return (
      <>
        {head}
        <Title
          title='Ops!'
          description={state.status === 'invalid'
            ? 'Esse link não é válido. Peça um novo para quem organizou o sorteio.'
            : 'Algo deu errado. Tente abrir o link de novo daqui a pouco.'}
        />
      </>
    )
  }

  const { name, caught } = state

  return (
    <>
      {head}
      <Title
        title='Descubra quem você tirou...'
        description='...e guarde esse nome com carinho :)'
      />

      {!caught ? (
        <div className={styles.name}>
          <p>Oi, <b>{name}</b>! O sorteio ainda não foi feito :(</p>
          <p><i>Volte neste mesmo link mais tarde.</i></p>
        </div>
      ) : reveal ? (
        <div className={styles.name}>
          <p>Oi, <b>{name}</b>! Você tirou:</p>
          <b>{caught}</b>
          <button className={styles.hide} onClick={() => setReveal(false)}>
            esconder
          </button>
        </div>
      ) : (
        <div className={styles.noName}>
          <p>Oi, <b>{name}</b>! Clique para revelar...</p>
          <button className={styles.revealButton} onClick={() => setReveal(true)}>
            ?????????
          </button>
          <p>
            <i>Tenha certeza que ninguém está olhando o_o</i>
          </p>
        </div>
      )}
    </>
  )
}

export default ICaught
