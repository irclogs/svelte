import { createSubscriber } from "svelte/reactivity";
import { on } from "svelte/events";

class Router {
  #subscribe;

  constructor() {
    this.#subscribe = createSubscriber((update) => {
      const off = on(window, "hashchange", update);
      return () => off();
    });
  }

  get hash() {
    this.#subscribe();
    return normalizeHash(window.location.hash);
  }
  get location() {
    this.#subscribe();
    return window.location;
  }
  go(hash: string) {
    window.location.hash = hash;
  }
}

/**
 * if hash is "" or "#" return "/"
 * remove leading "#" if it exists
 */
function normalizeHash(hash: string): string {
  switch (hash) {
    case "":
      return "/";
    case "#":
      return "/";
    default:
      return hash.startsWith("#") ? hash.slice(1) : hash;
  }
}

export const router = new Router();
