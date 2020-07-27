const CONFIG_PREFIX = 'REACT_APP_'

export const loadConfig = (...requiredEnvVariables) => {
  const hasMissingRequired = requiredEnvVariables.some(variable => !process.env[`${CONFIG_PREFIX}${variable}`])

  if (hasMissingRequired) {
    throw new TypeError(`Invalid configuration. Following env variables are required ${requiredEnvVariables.map(i => CONFIG_PREFIX + i).join()}`)
  }

  return {
    ClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
    ClientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
  }
}