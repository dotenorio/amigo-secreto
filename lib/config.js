// Configuração lida das variáveis de ambiente (somente no servidor).
const required = (name, value) => {
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada`)
  }
  return value
}

export const config = () => ({
  spaceId: required('CONTENTFUL_SPACE_ID', process.env.CONTENTFUL_SPACE_ID),
  environmentId:
    process.env.CONTENTFUL_ENVIRONMENT_ID ||
    process.env.CONTENTFUL_ENVIROMENT_ID ||
    'master',
  deliveryToken: required('CONTENTFUL_ACCESS_TOKEN', process.env.CONTENTFUL_ACCESS_TOKEN),
  managementToken: process.env.CONTENTFUL_MANAGER_ACCESS_TOKEN,
  contentType: process.env.CONTENTFUL_CONTENT_TYPE || 'people',
  locale: process.env.CONTENTFUL_LOCALE || 'en-US',
  adminPassword: required('ADMIN_PASSWORD', process.env.ADMIN_PASSWORD),
  linkSecret: required('LINK_SECRET', process.env.LINK_SECRET),
})
