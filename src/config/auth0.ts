export interface Auth0Environment {
  domain: string
  clientId: string
  audience?: string
  rolesClaim: string
}

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined
const rolesClaim = import.meta.env.VITE_AUTH0_ROLES_CLAIM as string | undefined

export const auth0Environment: Auth0Environment = {
  domain: domain ?? '',
  clientId: clientId ?? '',
  audience,
  rolesClaim: rolesClaim ?? 'https://taskatlas.app/roles',
}

export const isAuthConfigured = Boolean(auth0Environment.domain && auth0Environment.clientId)
