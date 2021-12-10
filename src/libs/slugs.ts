import Hashids from 'hashids';

// changing the salt will invalidate all permalinks
const hashids = new Hashids('Never change me in the lifetime of this application.', 3);
export const slugify = hashids.encode.bind(hashids);


// returns timestamp in seconds since unix epoch or null if parsing failed
export function oportunisticParsePemalink(permalink: string): number | null {
  // try hashids of a timestamp in seconds
  try {
    let t = hashids.decode(permalink);
    if (t !== []) return (t[0] as number);
  } catch { } // noop - obviously not a hashid

  // next try Date - for ex. '2020-02-03' add the 0th hour to force local zone, otherwise it's parsed as UTC timezone
  let date = Date.parse(permalink + 'T00:00:00');
  if (date !== NaN) return date / 1000;

  // the above will fail if permalink was already datetime, so try that next
  let datetime = Date.parse(permalink);
  if (datetime !== NaN) return datetime / 1000;

  console.warn("permalink couldn't be parsed:", permalink);
  return null;
}
