import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

export interface Page extends Readable<Message[]> {
  prev: (arg0: number) => Promise<void>,
  next: (arg0: number) => Promise<void>,
};

import { fetchChanges, fetchViewLatest, fetchViewAtTimestamp, fetchViewAfter, fetchViewBefore } from './couch-api';
import type { Message } from './couch-api';

const sleep = (ms:number) => new Promise(f => setTimeout(f, ms));

async function runFeed(channel: string, since: string, store: Writable<Message[]>, signal: AbortSignal) {
  while (true) {
    try {
      let changes = await fetchChanges(channel, since, signal);
      if (changes.results.length > 0)
        store.update(rows => rows.concat(changes.results.map((row: { doc: any }) => row.doc)));
    } catch (e) {
      if (signal.aborted) return; // expected exception, quit!
      console.log("fetchChanges errored:", e, "… retrying in 15s");
      await sleep(15_000);
    }
  }
}


export async function getLatest(channel: string, limit = 100): Promise<Page> {
  var controller = new AbortController();
  const store = writable([] as Message[], () => {
    return () => controller.abort(); // no more subscribers
  });

  let page = await fetchViewLatest(channel, limit);
  store.set(page.rows);

  runFeed(channel, page.update_seq, store, controller.signal);

  let rows = page.rows;
  return {
    subscribe: store.subscribe,

    prev: async (n: number) => {
      let prev = await fetchViewBefore(channel, rows[0], n);
      rows = prev.rows.concat(rows);
      store.set(rows);
    },
    next: async (_) => { }
  };
}


export async function getPage(channel: string, timestamp: number, limit: number): Promise<Page> {
  const { subscribe, set } = writable([] as Message[]);
  let page = await fetchViewAtTimestamp(channel, timestamp, limit);
  set(page.rows);

  let rows = page.rows;
  return {
    subscribe,

    prev: async (n: number) => {
      let prev = await fetchViewBefore(channel, rows[0], n);
      rows = prev.rows.concat(rows);
      set(rows);
    },

    next: async (n: number) => {
      let next = await fetchViewAfter(channel, rows[rows.length - 1], n);
      rows = rows.concat(next.rows);
      set(rows);
    },
  };
}
