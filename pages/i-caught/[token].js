import { useRouter } from 'next/router'

import styles from '../../styles/ICaught.module.css'
import Title from '../../components/title'

const Token = () => {
  const router = useRouter()
  const { token } = router.query

  return (
    <>
      <Title
        title='Descubra quem você pegou...'
        description='...e guarde esse nome com carinho :)'
      />

      <div className={styles.name}>
        <p>Você pegou:</p>
        <b>Fernando {token}</b>
      </div>
    </>
  )
}

export default Token