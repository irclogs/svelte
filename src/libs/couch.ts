/*
 * Higher level CouchDB apis related to the existing components
 *
 * the apis send a query and return a Promise of a Page (which extends a Svelte Store)
 *
 */

import type { Readable, Writable } from 'svelte/store';
import type { Message as _Message  } from './couch-api';
export type Message = _Message;

export interface MessageView extends Message {
  date: string, time: string, slug: string, html: Node[],
}

export interface Page extends Readable<Message[]> {
  prev: (arg0: number) => Promise<void>,
  next: (arg0: number) => Promise<void>,
};


import { writable, derived } from 'svelte/store';
import { fetchChanges, fetchViewLatest, fetchViewAtTimestamp, fetchViewAfter, fetchViewBefore } from './couch-api';
import { formatMsg } from './messageFormatter';
import { slugify } from './slugs';


async function runFeed(channel: string, since: string, store: Writable<Message[]>, signal: AbortSignal) {
  let last_seq = since;
  while (true) {
    try {
      let changes = await fetchChanges(channel, last_seq, signal);
      if (changes.results.length > 0) {
        let newRows = changes.results
          .map((row: { doc: any }) => row.doc)         // extract just the docs
          .sort((a, b) => a.timestamp - b.timestamp);  // and sort them, since the _changes feed is not guaranteed to be sorted
        store.update(rows => rows.concat(newRows));
      }
      last_seq = changes.last_seq;
    } catch (e) {
      if (signal.aborted) return; // expected exception, quit!
      console.log("fetchChanges errored:", e, "… retrying in 15s");
      await sleep(15_000);
    }
  }
}


export async function getLatest(channel: string, limit = 100): Promise<Page> {
  const controller = new AbortController();
  const store = writable([] as Message[], () => {
    return () => controller.abort(); // no more subscribers
  });

  const page = await fetchViewLatest(channel, limit);
  store.set(page.rows);

  // this is an async function, but we don't await on it here
  // we let it run unhinged, controlled by the signal, and output going to the store
  runFeed(channel, page.update_seq, store, controller.signal);

  // internal mutable state
  let first = page.rows.at(0);
  return {
    subscribe: store.subscribe,

    prev: async (n: number) => {
      if (first === undefined) return;
      const resp = await fetchViewBefore(channel, first, n);
      first = resp.rows.at(0);
      store.update(r => resp.rows.concat(r));
    },
    // this page doesn't have the next command
    next: async (_) => { }
  };
}


export async function getPage(channel: string, timestamp: number, limit: number): Promise<Page> {
  const store = writable([] as Message[]);
  const page = await fetchViewAtTimestamp(channel, timestamp, limit);
  store.set(page.rows);

  // internal mutable state
  let first = page.rows.at(0);
  let last = page.rows.at(-1);
  return {
    subscribe: store.subscribe,

    prev: async (n: number) => {
      if (first === undefined) return;
      const resp = await fetchViewBefore(channel, first, n);
      first = resp.rows.at(0);
      store.update(r => resp.rows.concat(r));
    },

    next: async (n: number) => {
      if (last === undefined) return;
      const resp = await fetchViewAfter(channel, last, n);
      last = resp.rows.at(-1);
      store.update(r => r.concat(resp.rows));
    },
  };
}


function datetime(timestamp: number): { date: string, time: string } {
  // poor mans strftime to ISO 8601
  const date = new Date(timestamp * 1000);
  const YYYY = date.getFullYear().toString().padStart(4, "0");
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const DD = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return { time: `${hh}:${mm}:${ss}`, date: `${YYYY}-${MM}-${DD}` };
}

function msg2View(msg: Message): MessageView {
  return {
    ...msg,
    ...datetime(msg.timestamp),
    slug: slugify(Math.trunc(msg.timestamp)),
    html: formatMsg(msg.message),
  }
}


function groupByDate(acc: Map<string, MessageView[]>, msg: MessageView) {
  // push to Map['date']=[] if it exists, create Map['date']=[msg] if it doesn't
  acc.get(msg.date)?.push(msg) ?? acc.set(msg.date, [msg]);
  return acc;
};

export function groupRows(rows: Readable<Message[]>): Readable<Map<string, MessageView[]>> {
  return derived(rows,
    $rows => $rows.map(msg2View).reduce(groupByDate, new Map())
  )
}

// awaitable sleep/setTimeout
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
