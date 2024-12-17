import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'

const Token = () => {
  const router = useRouter()
  const { id } = router.query
  const [reveal, setReveal] = useState(false)
  const [person, setPerson] = useState(false)
  const [caught, setCaught] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const res = await fetch(`/api/contentful/persons/${id}`)
        setPerson(await res.json())
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      if (person && person.fields.caught) {
        const res = await fetch(`/api/contentful/persons/${person.fields.caught.sys.id}`)
        setCaught(await res.json())
      } else {
        setCaught({
          fields: {
            name: 'Ainda não foi sorteado :('
          }
        })
      }
    }
    fetchData();
  }, [person])

  return (
    <>
      <Title
        title='Descubra quem você pegou...'
        description='...e guarde esse nome com carinho :)'
      />

      {reveal ? (
        <div className={styles.name}>
          <p>Oi, <b>{person?.fields?.name}</b>! Você pegou:</p>
          <b>{caught.fields.name}</b>
        </div>
      ) : (
        <div className={styles.noName}>
          <p>Oi, <b>{person?.fields?.name}</b>! Clique para revelar...</p>
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