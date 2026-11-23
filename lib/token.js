import { createHmac, timingSafeEqual } from 'crypto'

import { config } from './config'

// Código secreto do link de cada pessoa. É derivado do ID do Contentful com
// uma chave que só o servidor conhece, então não dá para adivinhar o link de
// outra pessoa. Trocar LINK_SECRET invalida todos os links.
export const personToken = (id) =>
  createHmac('sha256', config().linkSecret)
    .update(`person:${id}`)
    .digest('base64url')
    .slice(0, 22)

export const sameToken = (a, b) => {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}
