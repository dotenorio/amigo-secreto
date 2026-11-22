import { requireAdmin } from '../../../lib/auth'
import { getPublishedEntries, saveCaught } from '../../../lib/contentful'
import { drawPairs } from '../../../lib/draw'

// Faz (ou refaz) o sorteio e grava no Contentful. A resposta não diz quem
// tirou quem: o organizador também participa sem saber.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    if (!requireAdmin(req, res)) return

    const entries = await getPublishedEntries()
    const byId = new Map(entries.map((entry) => [entry.sys.id, entry]))

    let pairs
    try {
      pairs = drawPairs(entries.map((entry) => entry.sys.id))
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }

    for (const { from, to } of pairs) {
      await saveCaught(byId.get(from), to)
    }

    res.status(200).json({ success: true, total: pairs.length })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'O sorteio falhou no meio do caminho. Tente sortear de novo.',
    })
  }
}
