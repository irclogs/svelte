/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_ARCHIVE_URL: string;
  readonly VITE_COUCHDB_URL: string;
  readonly VITE_PROJECT_URL: string;
  readonly VITE_IRCLOG_PAGING_SIZE: string;
  readonly VITE_IRCLOG_INDEX_PAGE_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
