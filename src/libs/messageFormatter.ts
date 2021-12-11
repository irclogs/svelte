import * as linkifyjs from "linkifyjs";
linkifyjs.options.defaults.defaultProtocol = "https";

function linkify(text: string): Node[] {
  let links = linkifyjs.find(text);

  let children: Node[] = [];
  let last = 0;
  links.forEach((match) => {
    if (!match.isLink) {
      return;
    }

    const prefix = text.substring(last, match.start)
    children.push(document.createTextNode(prefix));
    const a = document.createElement('a');
    a.href = match.href;
    a.target = "_blank";
    a.rel = "noreferrer noopener";
    a.innerText = match.value;
    children.push(a);

    last = match.end;
  });

  const suffix = text.substring(last);
  children.push(document.createTextNode(suffix));

  return children;
}

// TODO: format message text
export function formatMsg(msg: string): Node[] {
  return linkify(msg);
}
