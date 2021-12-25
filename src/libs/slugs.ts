import Hashids from 'hashids';

// changing the salt will invalidate all permalinks
const hashids = new Hashids('Never change me in the lifetime of this application.', 3);
export const slugify = hashids.encode.bind(hashids);


/*
 * Several types of permalinks are supported, in order of preference:
 *  /#/<channel>/<hashid> - see https://hashids.org/
 *  /#/<channel>/YYYY-MM-DD
 *  /#/<channel>/YYYY-MM-DDTHH:MM:SS
 *
 * Try to parse the timestamp, first to succeed wins.
 *
 * Returns a timestamp in seconds since unix epoch or null if parsing failed
 */
export function oportunisticParsePemalink(permalink: string): number | null {
  // try hashids first
  try {
    let t = hashids.decode(permalink);
    if (t.length > 0) return (t[0] as number);
  } catch { } // noop - obviously not a hashid

  // try a Date second, for ex. '2020-02-03'
  // since for this permalink makes the most sense for the users local timezone,
  // add the 0th hour to the string, otherwise it would be parsed as UTC timezone
  let date = Date.parse(permalink + 'T00:00:00');
  if (!Number.isNaN(date)) return date / 1000;

  // if all failed, it might be just a timestamp or full DateTime
  let datetime = Date.parse(permalink);
  if (!Number.isNaN(datetime)) return datetime / 1000;

  console.warn("permalink couldn't be parsed:", permalink);
  return null;
}
