const options = {
  mode: "cors",
  headers: {
    accept: "application/json",
    "content-type": "application/json"
  },
  method: "POST"
};

export async function getLast100(channel) {
  const url = new URL("https://irc.softver.org.mk/ddoc/_view/channel");
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
  const data = await response.json();
  return data.results[0];
}

export async function getChannelList() {
  const url = new URL("https://irc.softver.org.mk/ddoc/_view/channel");
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
  const data = await response.json();
  return data.results[0].rows.map(row => row.key[0]);
}
