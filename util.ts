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

export function range(start: number, end: number): number[] {
    return new Array(end - start + 1).fill(0).map((_, i) => i + start);
}
