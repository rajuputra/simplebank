/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GRPC_BASE_URL?: string
  readonly VITE_API_GIN_BASE_URL?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
