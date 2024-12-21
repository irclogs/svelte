/*
 * Higher level CouchDB apis related to the existing components
 *
 * the apis send a query and return a Promise of a Page (which extends a Svelte Store)
 *
 */

import { tick } from "svelte";
import type { Message } from "./couch-api";
export type { Message };

type MessageView = {
  _id: string;
  sender: string;
  date: string;
  time: string;
  slug: string;
  html: Node[];
};

type Page = {
  prev: (arg0: number) => Promise<void>;
  next: (arg0: number) => Promise<void>;
  rows: Message[];
};

import {
  fetchChanges,
  fetchViewLatest,
  fetchViewAtTimestamp,
  fetchViewAfter,
  fetchViewBefore,
  genChanges,
} from "./couch-api";
import { formatMsg } from "./messageFormatter";
import { slugify } from "./slugs";

/**
 * async task running continuously until the abort signal is flaged and updates the `rows` $state
 *
 * @param channel
 * @param since
 * @param signal
 */
function runFeed(channel: string, since: string, signal: AbortSignal) {
  let rows = $state<Message[]>([]);

  // run forever until aborted
  (async () => {
    for await (const values of genChanges(channel, since, signal)) {
      const newRows = values
        .map((row: { doc: Message }) => row.doc) // extract just the docs
        .sort((a, b) => a.timestamp - b.timestamp); // and sort them, since the _changes feed is not guaranteed to be sorted
      rows = [...rows, ...newRows];
    }
  })();

  return {
    get rows() {
      return rows;
    },
  };
}

export async function getLatest(channel: string, limit = 100): Promise<Page> {
  const controller = new AbortController();
  let subscribers = 0;

  const page = await fetchViewLatest(channel, limit);
  // internal mutable state for the pagination
  let first = page.rows.at(0);

  let rows = $state<Message[]>(page.rows);
  const feed = runFeed(channel, page.update_seq, controller.signal);

  const combined = $derived([...rows, ...feed.rows]);

  return {
    get rows() {
      if ($effect.tracking()) {
        $effect(() => {
          //console.log($host());
          subscribers++;
          return () => {
            tick().then(() => {
              if (--subscribers === 0) {
                console.log("No more component/state subscribers. abort the changes feed connection");
                controller.abort();
              }
            });
          };
        });
      }

      return combined;
    },

    async prev(n: number) {
      if (first === undefined) return;
      const resp = await fetchViewBefore(channel, first, n);
      first = resp.rows.at(0);
      rows = resp.rows.concat(rows);
    },
    // this page doesn't have the next command
    async next() {},
  };
}

export async function getPage(channel: string, timestamp: number, limit: number): Promise<Page> {
  let rows = $state<Message[]>([]);
  const page = await fetchViewAtTimestamp(channel, timestamp, limit);
  rows = page.rows;

  // internal mutable state
  let first = page.rows.at(0);
  let last = page.rows.at(-1);
  return {
    get rows() {
      return rows;
    },

    prev: async (n: number) => {
      if (first === undefined) return;
      const resp = await fetchViewBefore(channel, first, n);
      first = resp.rows.at(0);
      rows = resp.rows.concat(rows);
    },

    next: async (n: number) => {
      if (last === undefined) return;
      const resp = await fetchViewAfter(channel, last, n);
      last = resp.rows.at(-1);
      rows = rows.concat(resp.rows);
    },
  };
}

// Given the list of all messages, groupBy the message timestamp, where groups are per-day (YYYY-MM-dd)
export function groupRows(rows: Readonly<Message[]>): Map<string, MessageView[]> {
  const rows_ = rows.map(msg2View);
  return Map.groupBy(rows_, ({ date }) => {
    return date;
  });
}

function datetime(timestamp: number): { date: string; time: string } {
  // poor-man's strftime to ISO 8601
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
  let html: Node[] = [];
  if (msg.message) {
    html = formatMsg(msg.message);
  } else if (msg.topic) {
    const el = document.createTextNode(msg.topic);
    html = [el];
  }

  const { _id, sender } = msg;
  return {
    _id,
    sender,
    html,
    ...datetime(msg.timestamp),
    slug: slugify(Math.trunc(msg.timestamp)),
  };
}
