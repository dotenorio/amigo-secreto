import { createHash, timingSafeEqual } from 'crypto'

import { config } from './config'

const digest = (value) => createHash('sha256').update(String(value)).digest()

// Confere a senha do organizador enviada no cabeçalho x-admin-password.
// Responde 401 e retorna false se estiver errada.
export const requireAdmin = (req, res) => {
  const given = req.headers['x-admin-password'] || ''
  const ok = timingSafeEqual(digest(given), digest(config().adminPassword))

  if (!ok) {
    res.status(401).json({ error: 'Senha incorreta' })
  }

  return ok
}
