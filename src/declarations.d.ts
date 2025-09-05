// src/declarations.d.ts
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_EPIC_CLIENT_ID: string
  readonly VITE_EPIC_REDIRECT_URI: string
  readonly VITE_EPIC_ISS_URL: string
  // Add other VITE_ prefixed environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
