import { useRouter } from 'next/router'

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

      <p>
        Você pegou:
        {' '}
        <b>Fernando {token}</b>
      </p>
    </>
  )
}

export default Token