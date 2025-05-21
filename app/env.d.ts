// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    // Add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }