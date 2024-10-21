/// <reference types="svelte" />
/// <reference types="vite/client" />

/**
 * Build time configuration.
 *
 * VITE_* environment variables supplied at build time are passed in
 * the `import.meta.env` object. Here we parse/validate them or set
 * them to default values.
 *
 * see https://vitejs.dev/guide/env-and-mode
 */
declare const __APP_RELEASE_VERSION__: string;

export const config = {
  version: __APP_RELEASE_VERSION__ ?? "local-dev",
  githubArchive: import.meta.env.VITE_GITHUB_ARCHIVE_URL ?? "local-dev",
  homePage: import.meta.env.BASE_URL, // "https://irc.softver.org.mk/",
  indexPageSize: toInt(import.meta.env.VITE_IRCLOG_INDEX_PAGE_SIZE, 100),
  pageSize: toInt(import.meta.env.VITE_IRCLOG_PAGE_SIZE, 20),
  couchDbUrl: import.meta.env.VITE_COUCHDB_URL ?? "https://db.softver.org.mk/irclog/",
  projectUrl: import.meta.env.VITE_PROJECT_URL ?? "https://github.com/irclogs/svelte/",
};

function toInt(s: string | undefined, Default: number): number {
  if (!s) {
    return Default;
  }
  const n = parseInt(s, 10);
  if (isNaN(n)) {
    return Default;
  } else {
    return n;
  }
}
