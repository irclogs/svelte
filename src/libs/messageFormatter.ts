import { strip as stripAnsi } from "./ansi";
import * as linkifyjs from "linkifyjs";
linkifyjs.options.defaults.defaultProtocol = "https";

function codify(s: string): Node[] {
  const re = new RegExp("`.*?`", "g");
  let out = [];
  let match: RegExpExecArray | null;
  let last = 0;
  while ((match = re.exec(s))) {
    let prefix = s.slice(last, match.index);
    if (prefix) out.push(document.createTextNode(prefix));

    let needle = match[0];
    last = match.index + needle.length;

    let el = document.createElement("code");
    el.innerText = needle;
    out.push(el);
  }
  let rest = s.slice(last);
  if (rest) out.push(document.createTextNode(rest));
  return out;
}

function linkify(text: string): Node[] {
  let links = linkifyjs.find(text);

  let out: Node[] = [];
  let last = 0;
  links.forEach((match) => {
    if (!match.isLink) {
      return;
    }

    const prefix = text.substring(last, match.start);
    out.push(document.createTextNode(prefix));
    const a = document.createElement("a");
    a.href = match.href;
    a.innerText = match.value;
    out.push(a);

    last = match.end;
  });

  const suffix = text.substring(last);
  out.push(document.createTextNode(suffix));

  return out;
}

export function formatMsg(msg: string): Node[] {
  const msg_ = stripAnsi(msg);
  return codify(msg_).flatMap((n) =>
    n instanceof Text ? linkify(n.textContent ?? "") : n
  );
}
