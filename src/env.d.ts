interface ImportMetaEnv {
  readonly VITE_API_PATH: string;
  // tambahkan variabel lingkungan lainnya di sini jika diperlukan
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
