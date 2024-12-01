export function add(l: number, r: number) {
    return l + r;
}

export function sum(xs: readonly number[]) {
    let n = 0;
    for (let i = 0; i < xs.length; i++) {
        n += xs[i];
    }
    return n;
}
