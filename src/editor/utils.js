const CONFIG_PREFIX = 'REACT_APP_'

export const loadConfig = (...requiredEnvVariables) => {
  const hasMissingRequired = requiredEnvVariables.some(variable => !process.env[`${CONFIG_PREFIX}${variable}`])

  if (hasMissingRequired) {
    throw new TypeError(`Invalid configuration. Following env variables are required ${requiredEnvVariables.map(i => CONFIG_PREFIX + i).join()}`)
  }

  return {
    Token: process.env.REACT_APP_CMA_TOKEN,
    SpaceId: process.env.REACT_APP_SPACE_ID,
    EnvironmentId: process.env.REACT_APP_ENVIRONMENT_ID ?? 'master',
  }
}