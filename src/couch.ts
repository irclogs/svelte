export interface Message { timestamp: number, sender: string, channel: string, message: string, _id: string };
export interface ViewResponse { channel: string, rows: Message[], update_seq: string, total_rows: number, offset: number };

export async function getLast(channel: string, limit=100): Promise<ViewResponse> {
  const query = {
    limit: limit,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: true,
    startkey: [channel, {}],
    endkey: [channel, 0]
  };
  const response = await postQuery(query);
  const page = await response.json(); // validation needed here
  page.rows.reverse();
  page.rows = page.rows.map( (row: {doc:Message}) => row.doc);
  page.channel = channel;
  return page;
}


export async function getPageAt(channel: string, limit: number, timestamp: number): Promise<ViewResponse> {
  const query = {
    limit: limit,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: false,
    startkey: [channel, timestamp],
    endkey: [channel, {}]
  };
  const response = await postQuery(query);
  const page = await response.json(); // validation needed here
  page.rows = page.rows.map( (row: {doc:Message}) => row.doc);
  page.channel = channel;
  return page;
}


export async function getPrevPage(currentPage: ViewResponse, limit=100): Promise<ViewResponse> {
  const firstRow = currentPage.rows[0];
  const query = {
    limit: limit,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: true,
    skip: 1,
    startkey: [currentPage.channel, firstRow.timestamp],
    startkey_docid: firstRow._id,
    endkey: [currentPage.channel, 0]
  };
  const response = await postQuery(query);
  const prevPage = await response.json(); // validation needed here
  prevPage.rows.reverse();
  prevPage.rows = prevPage.rows.map( (row: {doc:Message}) => row.doc);
  prevPage.channel = currentPage.channel;
  return prevPage;
}


export async function getNextPage(currentPage: ViewResponse, limit=100): Promise<ViewResponse> {
  const lastRow = currentPage.rows[currentPage.rows.length-1];
  const query = {
    limit: limit,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: false,
    skip: 1,
    startkey: [currentPage.channel, lastRow.timestamp],
    startkey_docid: lastRow._id,
    endkey: [currentPage.channel, {}]
  };
  const response = await postQuery(query);
  const nextPage = await response.json(); // validation needed here
  nextPage.rows = nextPage.rows.map( (row: {doc:Message}) => row.doc);
  nextPage.channel = currentPage.channel;
  return nextPage;
}


interface IChannel { name: string, total_messages: number };

export async function getChannelList(): Promise<IChannel[]> {
  const query = {
    update_seq: true,
    reduce: true,
    group_level: 1
  };
  const response = await postQuery(query);
  const data = await response.json(); // validation needed here
  return data.rows?.map( (row: {key:[any], value:string}) => ({name: row.key[0], total_messages: row.value}));
}


import { writable } from 'svelte/store';

export function channelFeed(channel: string) {
    const store = writable([]);

    return {
        subscribe: store.subscribe,
        next: (n: number) => {

        },
        prev: (n: number) => {

        },
    };
}


async function postQuery(query: any) {
  const url = "https://irc.softver.org.mk/ddoc/_view/channel";
  const options: RequestInit = {
    mode: "cors",
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    },
    method: "POST"
  };
  const response = await fetch(url, {
    ...options,
    body: JSON.stringify(query)
  });
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response;
}
