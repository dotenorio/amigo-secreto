import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'
import Rules from '../../components/rules'

const MAX_WISHES = 2

const Swap = ({ on, off, onText }) => (
  <span className={styles.swap}>
    <span aria-hidden={on} className={on ? styles.hidden : ''}>{off}</span>
    <span aria-hidden={!on} className={on ? '' : styles.hidden}>{onText}</span>
  </span>
)

const emptyRows = (wishes = []) =>
  Array.from({ length: MAX_WISHES }, (_, i) => ({
    item: wishes[i]?.item || '',
    link: wishes[i]?.link || '',
  }))

const WishList = ({ wishes }) => (
  wishes.length === 0 ? (
    <p className={styles.muted}>Essa pessoa ainda não cadastrou as opções dela. Volte aqui mais tarde!</p>
  ) : (
    <ol className={styles.wishList}>
      {wishes.map((wish, i) => (
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
  )
)

const MyWishes = ({ token, initial }) => {
  const [rows, setRows] = useState(() => emptyRows(initial))
  const [saved, setSaved] = useState(() => JSON.stringify(emptyRows(initial)))
  const [status, setStatus] = useState({ kind: 'idle' })

  const dirty = JSON.stringify(rows) !== saved

  const update = (index, key, value) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
    setStatus({ kind: 'idle' })
  }

  const save = async (event) => {
    event.preventDefault()
    setStatus({ kind: 'saving' })
    try {
      const res = await fetch(`/api/wishes/${encodeURIComponent(token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishes: rows }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Não foi possível salvar')

      const next = emptyRows(data.wishes)
      setRows(next)
      setSaved(JSON.stringify(next))
      setStatus({ kind: 'saved' })
    } catch (err) {
      setStatus({ kind: 'error', message: err.message })
    }
  }

  return (
    <form className={styles.myWishes} onSubmit={save}>
      <h2>📝 O que você quer ganhar</h2>
      <p className={styles.muted}>Só quem tirou você vai ver.</p>

      {rows.map((row, i) => (
        <fieldset key={i} className={styles.wishRow}>
          <legend>Opção {i + 1}</legend>
          <input
            value={row.item}
            onChange={(event) => update(i, 'item', event.target.value)}
            placeholder={i === 0 ? 'Ex.: Livro "Torto Arado"' : 'Ex.: Perfume, camiseta M...'}
            maxLength={200}
            aria-label={`Opção ${i + 1}: o que é`}
          />
          <input
            value={row.link}
            onChange={(event) => update(i, 'link', event.target.value)}
            placeholder='Link (opcional)'
            inputMode='url'
            maxLength={500}
            aria-label={`Opção ${i + 1}: link`}
          />
        </fieldset>
      ))}

      <button className={styles.saveButton} type='submit' disabled={!dirty || status.kind === 'saving'}>
        {status.kind === 'saving' ? 'Salvando...' : 'Salvar minha lista'}
      </button>
      {/* Linha de status com altura fixa: a tela não pula ao aparecer. */}
      <p className={`${styles.status} ${status.kind === 'error' ? styles.statusError : ''}`} role='status'>
        {status.kind === 'saved' && 'Lista salva! ✅'}
        {status.kind === 'error' && status.message}
        {status.kind === 'idle' && dirty && 'Não esqueça de salvar.'}
      </p>
    </form>
  )
}

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

  const { name, caught, wishes, caughtWishes } = state

  return (
    <>
      {head}
      <Title
        title='Descubra quem você tirou...'
        description='...e guarde esse nome com carinho :)'
      />

      <Rules />

      {!caught ? (
        <div className={styles.name}>
          <p>Oi, <b>{name}</b>! O sorteio ainda não foi feito :(</p>
          <p><i>Volte neste mesmo link mais tarde. Enquanto isso, já cadastre suas opções aqui embaixo!</i></p>
        </div>
      ) : (
        // Os dois estados ficam empilhados no mesmo lugar e só um aparece:
        // a altura é sempre a do maior, então a tela não pula ao clicar.
        <div className={styles.noName}>
          <p>Oi, <b>{name}</b>!</p>
          <p><Swap on={reveal} off='Clique para revelar...' onText='Você tirou:' /></p>
          <button
            className={`${styles.revealButton} ${reveal ? styles.revealed : ''}`}
            onClick={() => setReveal(!reveal)}
            aria-label={reveal ? 'Esconder o nome' : 'Revelar o nome'}
          >
            <Swap on={reveal} off='?????????' onText={caught} />
          </button>
          <p>
            <i>
              <Swap
                on={reveal}
                off='Tenha certeza que ninguém está olhando o_o'
                onText='Clique no nome para esconder'
              />
            </i>
          </p>
          <div className={styles.caughtWishes}>
            <Swap
              on={reveal}
              off={<span className={styles.muted}>As opções de presente aparecem junto com o nome.</span>}
              onText={
                <>
                  <b>O que {caught} quer ganhar:</b>
                  <WishList wishes={caughtWishes} />
                </>
              }
            />
          </div>
        </div>
      )}

      <MyWishes token={token} initial={wishes} />
    </>
  )
}

export default ICaught
