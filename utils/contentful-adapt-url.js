const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CONTENTFUL_ENVIROMENT_ID = process.env.CONTENTFUL_ENVIROMENT_ID
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const CONTENTFUL_URL_BEFORE = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIROMENT_ID}`
const CONTENTFUL_URL_AFTER = `?access_token=${CONTENTFUL_ACCESS_TOKEN}`

const CONTENTFUL_URL_API = `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIROMENT_ID}`
const CONTENTFUL_MANAGER_ACCESS_TOKEN = process.env.CONTENTFUL_MANAGER_ACCESS_TOKEN

const contentDeliveryAdaptUrl = (route) => {
  return `${CONTENTFUL_URL_BEFORE}${route}${CONTENTFUL_URL_AFTER}`
}

const contentManagerAdaptUrl = (route) => {
  return `${CONTENTFUL_URL_API}${route}`
}

const accessToken = () => {
  return CONTENTFUL_MANAGER_ACCESS_TOKEN
}

export {
  contentDeliveryAdaptUrl,
  contentManagerAdaptUrl,
  accessToken
}
