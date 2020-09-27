export interface Channel { name: string, total_messages: number };
export interface Message { timestamp: number, sender: string, channel: string, message: string, _id: string };
export interface ViewResponse { channel: string, rows: Message[], update_seq: string, total_rows: number, offset: number };


export async function fetchViewLatest(channel: string, limit=100): Promise<ViewResponse> {
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
  return page;
}


export async function fetchViewAtTimestamp(channel: string, timestamp: number, limit: number): Promise<ViewResponse> {
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
  return page;
}


export async function fetchViewBefore(channel: string, firstRow: Message, limit: number): Promise<ViewResponse> {
  const query = {
    limit: limit,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: true,
    skip: 1,
    startkey: [channel, firstRow.timestamp],
    startkey_docid: firstRow._id,
    endkey: [channel, 0]
  };
  const response = await postQuery(query);
  const view = await response.json(); // validation needed here
  view.rows.reverse();
  view.rows = view.rows.map( (row: {doc:Message}) => row.doc);
  return view;
}


export async function fetchViewAfter(channel: string, lastRow: Message, limit: number): Promise<ViewResponse> {
  const query = {
    limit: limit,
    include_docs: true,
    update_seq: true,
    reduce: false,
    descending: false,
    skip: 1,
    startkey: [channel, lastRow.timestamp],
    startkey_docid: lastRow._id,
    endkey: [channel, {}]
  };
  const response = await postQuery(query);
  const view = await response.json(); // validation needed here
  view.rows = view.rows.map( (row: {doc:Message}) => row.doc);
  return view;
}


export async function fetchChannelList(): Promise<Channel[]> {
  const query = {
    update_seq: true,
    reduce: true,
    group_level: 1
  };
  const response = await postQuery(query);
  const data = await response.json(); // validation needed here
  return data.rows?.map( extractChannelData ) ?? [];
}

function extractChannelData(row: { key: [string]; value: number; }): { name: string, total_messages: number}  {
  return { name: row.key[0], total_messages: row.value };
}


export async function fetchChanges(channel: string, since: string) {
  const feedUrl = new URL("https://irc.softver.org.mk/api/_changes");
  const query = {
    feed: "longpoll",
    timeout: "90000",
    include_docs: "true",
    filter: "log/channel",
    channel: channel,
    since: since
  };
  feedUrl.search = new URLSearchParams(query).toString();

  const options: RequestInit = {
    mode: "cors",
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    },
    method: "POST"
  };
  const response = await fetch(feedUrl.toString(), options);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return await response.json();
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
