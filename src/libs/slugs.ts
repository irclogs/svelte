import Hashids from "hashids";

// changing the salt will invalidate all permalinks
const hashids = new Hashids("Never change me in the lifetime of this application.", 3);
export const slugify = hashids.encode.bind(hashids);

/*
 * Several types of permalinks are supported, in order of preference:
 *  /#/<channel>/<hashid> - see https://hashids.org/
 *  /#/<channel>/YYYY-MM-DD - parsed as YYYY-MM-DDT00:00:00
 *  /#/<channel>/YYYY-MM-DDTHH:MM:SS
 *
 * Try to parse the timestamp, first to succeed wins.
 *
 * Returns a timestamp in seconds since unix epoch or null if parsing failed
 */
export function oportunisticParsePemalink(permalink: string): number | null {
  // try hashids first
  try {
    const t = hashids.decode(permalink);
    if (t.length > 0) return t[0] as number;
  } catch {} // noop - obviously not a hashid

  // next, assume it's a Date, for ex. '2020-02-03'
  // a string like that is parsed as UTC, so we add "T00:00:00" to it
  // assuming the user wanted the begining of the day in their local timezone
  const date = Date.parse(permalink + "T00:00:00");
  if (!Number.isNaN(date)) return date / 1000;

  // if that failed, then it might be some dateString
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
  const datetime = Date.parse(permalink);
  if (!Number.isNaN(datetime)) return datetime / 1000;

  console.warn("permalink couldn't be parsed:", permalink);
  return null;
}
