import axios from 'axios'

import {
  contentDeliveryAdaptUrl,
} from '../../../../utils/contentful-adapt-url'

export default async function handler(req, res) {
  const { id } = req.query;
  const url = contentDeliveryAdaptUrl(`/entries/${id}`)
  const { data } = await axios(url)
  res.status(200).json(data)
}
