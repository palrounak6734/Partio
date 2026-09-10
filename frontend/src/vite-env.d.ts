/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIDNIGHT_NETWORK?: string;
  readonly VITE_MIDNIGHT_RPC_URL?: string;
  readonly VITE_INDEXER_URL?: string;
  readonly VITE_INDEXER_WS_URL?: string;
  readonly VITE_CONTRACT_ADDRESS?: string;
  readonly VITE_EXPLORER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
