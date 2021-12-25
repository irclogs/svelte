const defaults = {
  pageSize: 20,
  indexPageSize: 100,
};
const production = {
  ...defaults,
  CouchURL: "https://db.softver.org.mk/irclog/",
  HomeURL: "https://github.com/irclogs/svelte/",
};
const dev = {
  ...defaults,
  pageSize: 5,
  CouchURL: "https://db.softver.org.mk/irclog/",
  HomeURL: "https://github.com/irclogs/svelte/",
};
const test = {
  ...defaults,
  CouchURL: "http://localhost:5984/irclog/",
  HomeURL: "https://github.com/irclogs/svelte/",
};

export function getEnv() {
  switch (process.env.NODE_ENV) {
    case "production":
      return production;
    case "development":
      return dev;
    case "test":
      return test;
    default:
      throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
  }
}
