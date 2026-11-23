import { requireAdmin } from '../../../lib/auth'
import { getPeople } from '../../../lib/contentful'
import { personToken } from '../../../lib/token'

// Lista para o organizador: nomes, telefones e links secretos.
// Nunca inclui quem tirou quem.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    if (!requireAdmin(req, res)) return

    const people = await getPeople()

    res.status(200).json({
      people: people
        .map(({ id, name, phone, caughtId }) => ({
          id,
          name,
          phone,
          token: personToken(id),
          drawn: Boolean(caughtId),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Não foi possível carregar a lista' })
  }
}
