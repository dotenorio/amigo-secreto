const CONTENTFUL_SPACE_ID = 'igpp70sqnk3e'
const CONTENTFUL_ENVIROMENT_ID = 'master'
const CONTENTFUL_ACCESS_TOKEN = 'kDiN4Rv4G4HzO_Ik68xqLkHX-dqXr3KPGew5hjqVr3g'
const CONTENTFUL_URL_BEFORE = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIROMENT_ID}`
const CONTENTFUL_URL_AFTER = `?access_token=${CONTENTFUL_ACCESS_TOKEN}`

const contentfulAdaptUrl = (route) => {
  return `${CONTENTFUL_URL_BEFORE}${route}${CONTENTFUL_URL_AFTER}`
}

export default contentfulAdaptUrl
