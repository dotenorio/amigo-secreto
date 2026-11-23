import { getPeople, saveWishes } from '../../../lib/contentful'
import { personToken, sameToken } from '../../../lib/token'
import { parseWishes } from '../../../lib/wishes'

// Salva a lista de desejos do dono do link.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { wishes, error } = parseWishes(req.body?.wishes)
  if (error) return res.status(400).json({ error })

  try {
    const { token } = req.query
    const people = await getPeople()
    const person = people.find(({ id }) => sameToken(personToken(id), token))

    if (!person) {
      return res.status(404).json({ error: 'Link inválido' })
    }

    await saveWishes(person.id, wishes)

    res.status(200).json({ wishes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Não foi possível salvar. Tente de novo.' })
  }
}
