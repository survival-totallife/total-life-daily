/// <reference types="vite/client" />
/// <reference types="vite-imagetools" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_YOUTUBE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
