// https://en.wikipedia.org/wiki/Jenkins_hash_function

export function one_at_a_time_hash(s) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash += s.charCodeAt(i);
    hash += hash << 10;
    hash ^= hash >> 6;
  }
  hash += hash << 3;
  hash ^= hash >> 11;
  hash += hash << 15;
  return hash;
}

export function toCssColor(hash) {
  let hue = hash % 360;
  return `hsl(${hue}, 50%, 70%)`;
}

export function colorize(nickname) {
  const color = toCssColor(one_at_a_time_hash(nickname));
  return `background-color: ${color};`;
}
