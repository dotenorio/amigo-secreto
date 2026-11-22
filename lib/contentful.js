import { config } from './config'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const request = async (url, options = {}, attempt = 0) => {
  const res = await fetch(url, { cache: 'no-store', ...options })

  // Limite de requisições do Contentful: espera e tenta de novo.
  if (res.status === 429 && attempt < 5) {
    const reset = Number(res.headers.get('x-contentful-ratelimit-reset')) || 1
    await sleep(reset * 1000)
    return request(url, options, attempt + 1)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Contentful respondeu ${res.status}: ${body.slice(0, 300)}`)
  }

  return res.json()
}

const basePath = (host) => {
  const { spaceId, environmentId } = config()
  return `https://${host}/spaces/${spaceId}/environments/${environmentId}`
}

// Pessoas publicadas, pela Content Delivery API (somente leitura).
// Retorna [{ id, name, phone, caughtId }].
export const getPeople = async () => {
  const { contentType, deliveryToken } = config()
  const url = `${basePath('cdn.contentful.com')}/entries?content_type=${encodeURIComponent(contentType)}&limit=1000&include=0`
  const data = await request(url, {
    headers: { Authorization: `Bearer ${deliveryToken}` },
  })

  return data.items.map(({ sys, fields }) => ({
    id: sys.id,
    name: fields.name || '(sem nome)',
    phone: fields.phone ? String(fields.phone).replace(/\D/g, '') : null,
    caughtId: fields.caught?.sys?.id || null,
  }))
}

const managementHeaders = (extra = {}) => {
  const { managementToken } = config()
  if (!managementToken) {
    throw new Error('Variável de ambiente CONTENTFUL_MANAGER_ACCESS_TOKEN não configurada')
  }
  return {
    Authorization: `Bearer ${managementToken}`,
    'Content-Type': 'application/vnd.contentful.management.v1+json',
    ...extra,
  }
}

// Entradas publicadas (e não arquivadas), pela Content Management API.
export const getPublishedEntries = async () => {
  const { contentType } = config()
  const url = `${basePath('api.contentful.com')}/entries?content_type=${encodeURIComponent(contentType)}&limit=1000`
  const data = await request(url, { headers: managementHeaders() })

  return data.items.filter((e) => e.sys.publishedVersion && !e.sys.archivedVersion)
}

// Grava quem a pessoa tirou e publica a entrada. Mantém os outros campos.
export const saveCaught = async (entry, caughtId) => {
  const { contentType, locale } = config()
  const entryUrl = `${basePath('api.contentful.com')}/entries/${entry.sys.id}`

  const updated = await request(entryUrl, {
    method: 'PUT',
    headers: managementHeaders({
      'X-Contentful-Content-Type': contentType,
      'X-Contentful-Version': String(entry.sys.version),
    }),
    body: JSON.stringify({
      fields: {
        ...entry.fields,
        caught: {
          [locale]: { sys: { type: 'Link', linkType: 'Entry', id: caughtId } },
        },
      },
    }),
  })

  await request(`${entryUrl}/published`, {
    method: 'PUT',
    headers: managementHeaders({
      'X-Contentful-Version': String(updated.sys.version),
    }),
  })
}
