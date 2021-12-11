import * as linkifyjs from "linkifyjs";
linkifyjs.options.defaults.defaultProtocol = "https";

function linkify(text: string) {
	let links = linkifyjs.find(text);

	let children = [];
	let last = 0;
	links.forEach((match) => {
		if (!match.isLink) {
			return;
		}

		const prefix = text.substring(last, match.start)
		children.push(prefix);
        const a = document.createElement('a');
        a.href= match.href;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
        a.innerText = match.value;
		children.push(a.outerHTML);

		last = match.end;
	});

	const suffix = text.substring(last)
	children.push(suffix);

	return children;
}

// TODO: format message text
export function formatMsg(msg: string): string[] {
    return linkify(msg);
}
