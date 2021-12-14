import axios from 'axios'


import {
  contentManagerAdaptUrl,
  accessToken
} from '../../../../utils/contentful-adapt-url'

const handleCaught = (id, onlyItems) => {
  const caught = onlyItems[Math.floor(Math.random() * onlyItems.length)];

  if (caught.sys.id === id) {
    return handleCaught(id, onlyItems)
  }

  return caught
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

export default async function handler(_req, res) {
  const { data } = await axios({
    url: contentManagerAdaptUrl('/entries'),
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json'
    },
  })

  const draw = [];

  const onlyItems = data.items.map(item => {
    return item
  })

  const onlyItemsFreeze = shuffleArray([...onlyItems])

  onlyItemsFreeze.forEach(({ sys: { id, version }, fields: { name } }) => {
    const item = handleCaught(id, onlyItems)
    const { sys } = item
    const { id: caught } = sys
    draw.push({ from: id, to: caught, version, name })

    const index = onlyItems.indexOf(item)
    onlyItems.splice(index, 1)
  })

  for (let i = 0; i < draw.length; i++) {
    const { from, to, version, name } = draw[i]
    console.log(`Sorteando um amigo secreto para ${name['en-US']}...`)

    await axios({
      url: contentManagerAdaptUrl(`/entries/${from}`),
      method: 'put',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'people',
        'X-Contentful-Version': version,
      },
      data: {
        fields: {
          name,
          caught: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: to
              }
            }
          }
        }
      },
    })

    await axios({
      url: contentManagerAdaptUrl(`/entries/${from}/published`),
      method: 'put',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'people',
        'X-Contentful-Version': version + 1,
      },
    })
  }

  console.log('Sucesso!')

  res.status(200).json({ success: true })
}
