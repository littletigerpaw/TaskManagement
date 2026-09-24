import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider, type AppState } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'
import { auth0Environment } from './config/auth0'

const onRedirectCallback = (appState?: AppState) => {
  const returnTo = appState?.returnTo ?? window.location.pathname
  window.history.replaceState({}, document.title, returnTo)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Environment.domain || 'dev-placeholder.us.auth0.com'}
      clientId={auth0Environment.clientId || 'dev-placeholder-client-id'}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Environment.audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
