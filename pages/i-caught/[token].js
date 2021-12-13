import { useState } from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'

const Token = () => {
  const router = useRouter()
  const { token } = router.query
  const [reveal, setReveal] = useState()

  return (
    <>
      <Title
        title='Descubra quem você pegou...'
        description='...e guarde esse nome com carinho :)'
      />

      {reveal ? (
        <div className={styles.name}>
          <p>Você pegou:</p>
          <b>Fernando {token}</b>
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