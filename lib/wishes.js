// Lista de desejos: até 2 opções, cada uma com um texto e um link opcional.
export const MAX_WISHES = 2
export const MAX_ITEM = 200
export const MAX_LINK = 500

const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Limpa o que veio do Contentful para mostrar na tela. Nunca lança erro.
export const readWishes = (value) => {
  if (!Array.isArray(value)) return []

  return value
    .slice(0, MAX_WISHES)
    .map((wish) => ({
      item: String(wish?.item || '').slice(0, MAX_ITEM),
      link: isHttpUrl(wish?.link) ? String(wish.link).slice(0, MAX_LINK) : '',
    }))
    .filter((wish) => wish.item || wish.link)
}

// Valida o que a pessoa enviou. Retorna { wishes } ou { error }.
export const parseWishes = (input) => {
  if (!Array.isArray(input)) return { error: 'Formato inválido' }
  if (input.length > MAX_WISHES) return { error: `No máximo ${MAX_WISHES} opções` }

  const wishes = []
  for (const raw of input) {
    const item = String(raw?.item ?? '').trim()
    let link = String(raw?.link ?? '').trim()

    if (!item && !link) continue
    if (item.length > MAX_ITEM) return { error: `Cada opção pode ter até ${MAX_ITEM} letras` }
    if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`
    if (link && (link.length > MAX_LINK || !isHttpUrl(link))) {
      return { error: 'Um dos links não parece válido' }
    }
    if (!item) return { error: 'Escreva o que é o presente, não só o link' }

    wishes.push({ item, link })
  }

  return { wishes }
}
