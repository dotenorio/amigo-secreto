import { getPeople } from '../../../lib/contentful'
import { personToken, sameToken } from '../../../lib/token'

// Revela, só para o dono do link, o nome de quem ele tirou.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { token } = req.query
    const people = await getPeople()
    const person = people.find(({ id }) => sameToken(personToken(id), token))

    if (!person) {
      return res.status(404).json({ error: 'Link inválido' })
    }

    const caught = people.find(({ id }) => id === person.caughtId)

    res.status(200).json({
      name: person.name,
      caught: caught ? caught.name : null,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Não foi possível carregar' })
  }
}
