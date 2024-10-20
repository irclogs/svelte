// Global Singleton Router state (rune)
let router = $state<string>(mapLocationToRoute(window.location));

// Update the state whenever the hash changes
window.addEventListener(
  "hashchange",
  (ev) => {
    router = mapLocationToRoute(window.location);
  },
  false,
);

export const Router = {
  get hash() {
    return router;
  },
  go(route: string) {
    window.location.hash = route;
  },
};

function mapLocationToRoute(loc: Location): string {
  let hash = loc.hash;
  console.debug("[Router]", hash);

  if (hash == "") {
    loc.hash = "/"; // to mutate or not ?!
    return "/";
  }
  if (hash.startsWith("#")) {
    return hash.slice(1);
  }

  return hash; // this should never happen
}
