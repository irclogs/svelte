const options: RequestInit = {
  mode: "cors",
  headers: {
    "accept": "application/json",
    "content-type": "application/json"
  },
  method: "POST"
};

interface IMessage { timestamp: number, sender: string, channel: string, message: string, _id: string };
interface IMessageList { rows: IMessage[], update_seq: string };

export async function getLast100(channel: string, from, to): Promise<any> {
  const url = "https://irc.softver.org.mk/ddoc/_view/channel";
  const query = {
    limit: 100,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: true,
    startkey: [channel, {}],
    endkey: [channel, 0]
  };
  const response = await fetch(url, {
    ...options,
    body: JSON.stringify({ queries: [query] })
  });
  if(!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const data = await response.json(); // validation needed here
  return data.results[0];
}


interface IChannel { name: string, total_messages: number };

export async function getChannelList(): Promise<IChannel[]> {
  const url = "https://irc.softver.org.mk/ddoc/_view/channel";
  const query = {
    update_seq: true,
    reduce: true,
    group_level: 1
  };
  const response = await fetch(url, {
    ...options,
    body: JSON.stringify({ queries: [query] })
  });
  if(!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const data = await response.json(); // validation needed here
  const rows  = data.results[0].rows;
  return rows.map(row => ({name: row.key[0], total_messages: row.value}));
}


import { writable } from 'svelte/store';

export function createChannelStore(channel) {
    const store = writable([]);

    return {
        subscribe: store.subscribe,
        next: (n: number) => {

        },
        prev: (n: number) => {

        },
    };
}


function addDateAndTime(doc: IMessage) {
  let t = new Date(doc.timestamp * 1000);
  // poor mans strftime
  let time = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0') }:${t.getSeconds().toString().padStart(2, '0')}`;
  let date = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`;
  let datetime = `${date}T${time}`;
  return {...doc, time, date, datetime};
};

function groupByDate (acc, doc) {
  if (! acc.has(doc.date)) { acc.set(doc.date, []) };
  acc.get(doc.date).push(doc);
  return acc;
};

let response = getLast100(name)
  .then(result =>
    result.rows
      .reverse()
      .map(row => addDateAndTime(row.doc))
      .reduce(groupByDate, new Map())
);
