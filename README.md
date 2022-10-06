[![Build and Deploy](https://github.com/irclogs/svelte/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/irclogs/svelte/actions)

# `Irclog CouchApp`
### a web app to view irclogs (svelte edition)

The logs are stored in couchdb.

The single page web app is written in angular and stored as a
[couchapp](https://github.com/irclogs/couchapp)
in couchdb attachments.

## Quick start - for developers

Run `yarn` and `yarn dev`.

> The public database server has localhost:8000 allowed for CORS requests, so running this app on localhost:8000
> will make the api available. If you want to run the app against a local couchdb run `yarn dev --mode test` (see .env.test).

## Production build

```
yarn build --mode production
```
the release asset files are in `./dist`.
