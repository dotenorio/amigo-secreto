import axios from 'axios'

import contentfulAdaptUrl from '../../../../utils/contentful-adapt-url'

export default async function handler(req, res) {
  const { id } = req.query;
  const url = contentfulAdaptUrl(`/entries/${id}`)
  const { data } = await axios(url)
  res.status(200).json(data)
}
