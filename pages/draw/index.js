import { useCallback, useEffect, useState } from 'react'

import styles from '../../styles/Draw.module.css'
import Title from '../../components/title'

const PASSWORD_KEY = 'amigo-secreto:senha'
const SENT_KEY = 'amigo-secreto:enviados'

// sessionStorage/localStorage podem falhar (aba anônima, etc.): nunca quebra.
const storage = {
  get: (kind, key) => {
    try { return window[kind].getItem(key) } catch { return null }
  },
  set: (kind, key, value) => {
    try { window[kind].setItem(key, value) } catch { /* ignora */ }
  },
  remove: (kind, key) => {
    try { window[kind].removeItem(key) } catch { /* ignora */ }
  },
}

const personLink = (token) => `${window.location.origin}/i-caught/${token}`

const whatsappMessage = (person) => [
  `Oi, ${person.name}! 🎁`,
  '',
  'Chegou a hora do *Amigo Secreto da Família*!',
  'Abra o link abaixo para descobrir quem você tirou e cadastrar 2 opções do que você quer ganhar (presente de R$ 70 a R$ 100).',
  'Ele é só seu: não mostre e não repasse pra ninguém 🤫',
  '',
  personLink(person.token),
].join('\n')

const whatsappUrl = (person) => {
  const text = encodeURIComponent(whatsappMessage(person))
  // api.whatsapp.com em vez de wa.me: o redirecionamento do wa.me estraga
  // emojis (aparecem como �). Sem telefone, você escolhe o contato.
  const phone = person.phone ? `phone=${person.phone}&` : ''
  return `https://api.whatsapp.com/send?${phone}text=${text}`
}

const Draw = () => {
  const [input, setInput] = useState('')
  const [password, setPassword] = useState(null)
  const [people, setPeople] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [sent, setSent] = useState({})

  const loadPeople = useCallback(async (pass) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/people', {
        headers: { 'x-admin-password': pass },
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 401) {
        storage.remove('sessionStorage', PASSWORD_KEY)
        setPassword(null)
        setError('Senha incorreta!!')
        return
      }
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar')

      storage.set('sessionStorage', PASSWORD_KEY, pass)
      setPassword(pass)
      setPeople(data.people)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const saved = storage.get('sessionStorage', PASSWORD_KEY)
    if (saved) loadPeople(saved)

    try {
      setSent(JSON.parse(storage.get('localStorage', SENT_KEY)) || {})
    } catch { /* ignora */ }
  }, [loadPeople])

  const markSent = (id, value = true) => {
    setSent((current) => {
      const next = { ...current }
      if (value) next[id] = true
      else delete next[id]
      storage.set('localStorage', SENT_KEY, JSON.stringify(next))
      return next
    })
  }

  const copyLink = async (person) => {
    try {
      await navigator.clipboard.writeText(personLink(person.token))
      setNotice(`Link de ${person.name} copiado!`)
    } catch {
      window.prompt(`Copie o link de ${person.name}:`, personLink(person.token))
    }
  }

  const runDraw = async () => {
    const alreadyDrawn = people.some((person) => person.drawn)
    const question = alreadyDrawn
      ? 'Já existe um sorteio. Refazer vai trocar quem tirou quem (os links continuam os mesmos). Continuar?'
      : `Sortear entre ${people.length} pessoas?`

    if (!window.confirm(question)) return

    setDrawing(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { 'x-admin-password': password },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erro no sorteio')

      setSent({})
      storage.remove('localStorage', SENT_KEY)
      setNotice(`Sorteio feito entre ${data.total} pessoas! 🎉 Agora é só mandar os links.`)
      // O Contentful leva alguns segundos para atualizar a leitura.
      setTimeout(() => loadPeople(password), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setDrawing(false)
    }
  }

  const logout = () => {
    storage.remove('sessionStorage', PASSWORD_KEY)
    setPassword(null)
    setPeople(null)
    setInput('')
  }

  if (!password) {
    return (
      <form
        className={styles.login}
        onSubmit={(event) => {
          event.preventDefault()
          if (input) loadPeople(input)
        }}
      >
        {error
          ? <b className={styles.error}>{error}</b>
          : <b className={styles.message}>Área do organizador</b>
        }
        <input
          placeholder='Digite a senha'
          onChange={(event) => setInput(event.target.value)}
          value={input}
          className={styles.input}
          type='password'
          autoFocus
        />
        <button className={styles.button} type='submit' disabled={loading}>
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    )
  }

  const total = people?.length || 0
  const drawnCount = people?.filter((person) => person.drawn).length || 0
  const sentCount = people?.filter((person) => sent[person.id]).length || 0
  const allDrawn = total > 0 && drawnCount === total

  return (
    <>
      <Title
        title='Sorteio'
        description='Mande para cada pessoa o link dela pelo WhatsApp'
      />

      <div className={styles.toolbar}>
        <span>
          {total} pessoas · {allDrawn ? `sorteio feito · ${sentCount}/${total} enviados` : 'sorteio ainda não feito'}
        </span>
        <div className={styles.toolbarActions}>
          <button
            className={styles.button}
            onClick={runDraw}
            disabled={drawing || total < 3}
          >
            {drawing ? 'Sorteando...' : drawnCount > 0 ? 'Refazer sorteio' : 'Fazer sorteio'}
          </button>
          <button className={styles.secondary} onClick={() => loadPeople(password)} disabled={loading}>
            Atualizar
          </button>
          <button className={styles.secondary} onClick={logout}>
            Sair
          </button>
        </div>
      </div>

      {error && <b className={styles.error}>{error}</b>}
      {notice && <b className={styles.message}>{notice}</b>}
      {total > 0 && total < 3 && (
        <b className={styles.error}>Cadastre pelo menos 3 pessoas no Contentful.</b>
      )}

      <ul className={styles.cardList}>
        {people?.map((person) => (
          <li className={styles.card} key={person.id}>
            <div className={styles.cardInfo}>
              <b>{person.name}</b>
              <small>
                {person.drawn ? 'sorteado' : 'aguardando sorteio'}
                {person.phone ? ` · +${person.phone}` : ''}
                {sent[person.id] ? ' · ✅ enviado' : ''}
              </small>
            </div>
            <div className={styles.cardActions}>
              <a
                className={styles.whatsapp}
                href={whatsappUrl(person)}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => markSent(person.id)}
                aria-disabled={!person.drawn}
              >
                WhatsApp
              </a>
              <button className={styles.secondary} onClick={() => copyLink(person)}>
                Copiar link
              </button>
              {sent[person.id] && (
                <button
                  className={styles.link}
                  onClick={() => markSent(person.id, false)}
                  title='Desmarcar como enviado'
                >
                  desmarcar
                </button>
              )}
            </div>
          </li>
        ))}
        {people && people.length === 0 && (
          <li className={styles.empty}>Nenhuma pessoa publicada no Contentful ainda.</li>
        )}
      </ul>
    </>
  )
}

export default Draw
