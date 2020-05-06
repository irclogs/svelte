[![Build and Deploy](https://github.com/irclogs/svelte/workflows/make%20github-pages%20site/badge.svg)](https://github.com/irclogs/svelte/actions)

# `Irclog CouchApp`
### a web app to view irclogs (svelte edition)

The logs are stored in couchdb.

The single page web app is written in angular and stored as a
[couchapp](https://github.com/irclogs/couchapp)
in couchdb attachments.

## Quick start - for developers

Run `yarn` and `yarn start`.

> The public server has localhost:5000 allowed for CORS requests, so running on port 5000
> will make the api available

## Production

```
yarn build
```
the release is in `./dist`
