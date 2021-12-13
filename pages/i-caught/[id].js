import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'

const fetcher = (url) => fetch(url).then((res) => res.json())

const Token = () => {
  const router = useRouter()
  const { id } = router.query
  const [reveal, setReveal] = useState(false)
  const { data } = useSWR(`/api/contentful/persons/${id}`, fetcher)
  const { data: caugth } = useSWR(`/api/contentful/persons/${data.fields?.caugth.sys.id}`, fetcher)

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