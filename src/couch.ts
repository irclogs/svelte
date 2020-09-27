import { writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
export declare type Page = Readable<Message[]> & { prev: (arg0:number)=> Promise<void>, next: (arg0:number)=> Promise<void> };

import { fetchChanges, fetchViewLatest, fetchViewAtTimestamp, fetchViewAfter, fetchViewBefore } from './couch-api';
import type { Message } from './couch-api';


function runFeed(channel: string, since: string, store: Writable<Message[]>) {
  fetchChanges(channel, since).then( async (changes) => {
    store.update(rows => rows.concat(changes.results.map( (row: {doc:any}) => row.doc)));
    runFeed(channel, changes.last_seq, store);
  });
}


export async function getLatest(channel: string, limit=100): Promise<Page> {
    const store = writable([] as Message[]);
    let page = await fetchViewLatest(channel, limit);
    store.set(page.rows);

    // @ts-ignore: the Updater type is not exported by svelte
    runFeed(channel, page.update_seq, store);

    let rows = page.rows;
    return {
        subscribe: store.subscribe,

        prev: async (n: number) => {
            let prev = await fetchViewBefore(channel, rows[0], n);
            rows = prev.rows.concat(rows);
            store.set(rows);
        },
        next: async (_)=> {}
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
        let next = await fetchViewAfter(channel, rows[rows.length-1], n);
        rows = rows.concat(next.rows);
        set(rows);
    },
  };
}
