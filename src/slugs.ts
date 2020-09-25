import Hashids from 'hashids';
// changing this will invalidate all permalinks
export const hashids = new Hashids('', 8);

export const slugify = hashids.encode.bind(hashids);
export const deslugify = hashids.decode.bind(hashids);
