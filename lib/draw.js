import { randomInt } from 'crypto'

// Embaralha a lista (Fisher–Yates) e faz uma roda: cada pessoa tira a
// próxima, e a última tira a primeira. Assim ninguém tira a si mesmo e o
// sorteio nunca trava, seja qual for o tamanho da lista.
export const drawPairs = (ids) => {
  if (ids.length < 3) {
    throw new Error('São necessárias pelo menos 3 pessoas para o sorteio')
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error('A lista tem pessoas repetidas')
  }

  const shuffled = [...ids]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.map((from, i) => ({
    from,
    to: shuffled[(i + 1) % shuffled.length],
  }))
}
