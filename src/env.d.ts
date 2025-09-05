/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EPIC_CLIENT_ID: string
  readonly VITE_EPIC_REDIRECT_URI: string
  readonly VITE_EPIC_ISS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
