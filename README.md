[![Build and Deploy](https://github.com/irclogs/svelte/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/irclogs/svelte/actions)

# `Irclog CouchApp`
### a web app to view irclogs (svelte edition)

The logs are stored in couchdb.

The single page web app is written in angular and stored as a
[couchapp](https://github.com/irclogs/couchapp)
in couchdb attachments.

## Quick start - for developers

Run `yarn` and `yarn watch`.

> The public server has localhost:8000 allowed for CORS requests, so running on port 8000
> will make the api available

## Production

```
yarn build
```
the release is in `./dist`
