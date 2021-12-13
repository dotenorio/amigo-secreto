import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'

const Token = () => {
  const router = useRouter()
  const { id } = router.query
  const [reveal, setReveal] = useState(false)
  const [person, setPerson] = useState(false)
  const [caugth, setCaugth] = useState(false)

  useEffect(async () => {
    if (id) {
      const res = await fetch(`/api/contentful/persons/${id}`)
      setPerson(await res.json())
    }
  }, [id])

  useEffect(async () => {
    if (person) {
      const res = await fetch(`/api/contentful/persons/${person.fields.caugth.sys.id}`)
      setCaugth(await res.json())
    }
  }, [person])

  return (
    <>
      <Title
        title='Descubra quem você pegou...'
        description='...e guarde esse nome com carinho :)'
      />

      {reveal ? (
        <div className={styles.name}>
          <p>Você pegou:</p>
          <b>{caugth.fields.name}</b>
        </div>
      ) : (
        <div className={styles.noName}>
          <p>Clique para revelar...</p>
          <b onClick={() => setReveal(true)}>?????????</b>
          <p>
            <i>Tenha certeza que ninguém está olhando o_o</i>
          </p>
        </div>
      )}
    </>
  )
}

export default Token