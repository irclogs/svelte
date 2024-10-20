[![Build and Deploy](https://github.com/irclogs/svelte/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/irclogs/svelte/actions)

# `Irclog CouchApp`
### a web app to view irclogs (svelte edition)

The logs are stored in couchdb.

The single page web app is written in angular and stored as a
[couchapp](https://github.com/irclogs/couchapp)
in couchdb attachments.

## Quick start - for developers

Run `pnpm i` and `pnpm dev`.

> The public database server has localhost:8000 allowed for CORS requests, so running this app on localhost:8000
> will make the api available. If you want to run the app against a local couchdb, setup
> `VITE_COUCHDB_URL=http://localhost:5984/irclog/` in `.env.local`.

## Production build

```
pnpm build:production
```
the release asset files are in `./dist`.

## License

All files licensed under the Apache-2.0 license (see `LICENSE`),
except for `src/libs/ansi.js`, taken from the [gamja project](https://sr.ht/~emersion/gamja/),
which is licensed under the AGPL-3.0 (see `LICENSE.AGPL`)
