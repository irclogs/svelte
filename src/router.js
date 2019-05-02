import { readable } from 'svelte/store';

export function hashRouter() {
    let hash = decodeURI(location.hash);
    if (hash.startsWith('#/')) hash = hash.slice(2);

    return readable(hash, set => {
        function callback(ev) {
            let hash = decodeURI(location.hash);
            if (hash.startsWith('#/')) {
                hash = hash.slice(2);
                set(hash);
            } else {
                set(404);
            }
        }
        window.addEventListener('hashchange', callback, false);

        return function stop() {
		    window.removeEventListener('hashchange', callback), false;
	    };
    })
}
