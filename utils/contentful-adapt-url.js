const CONTENTFUL_SPACE_ID = 'igpp70sqnk3e'
const CONTENTFUL_ENVIROMENT_ID = 'master'
const CONTENTFUL_ACCESS_TOKEN = 'kDiN4Rv4G4HzO_Ik68xqLkHX-dqXr3KPGew5hjqVr3g'
const CONTENTFUL_URL_BEFORE = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIROMENT_ID}`
const CONTENTFUL_URL_AFTER = `?access_token=${CONTENTFUL_ACCESS_TOKEN}`

const CONTENTFUL_URL_API = `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIROMENT_ID}`
const CONTENTFUL_MANAGER_ACCESS_TOKEN = 'CFPAT-af5B0RPsvxMEOd9_tHTKuLm3XkOdZdkb4B1H7nBXwNY'

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
