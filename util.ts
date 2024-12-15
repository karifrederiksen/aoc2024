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

export function compare(l: number, r: number): number {
    return l > r ? 1 : r > l ? -1 : 0;
}

export function* skip<A>(n: number, iterable: Iterable<A>): Iterable<A> {
    const iter = iterable[Symbol.iterator]();
    let done = false;
    for (let skipped = 0; !done && skipped < n; skipped++) {
        done = iter.next().done ?? false;
    }

    let val = iter.next();
    while (!val.done) {
        yield val.value;
        val = iter.next();
    }
}

export function* take<A>(n: number, iterable: Iterable<A>): Iterable<A> {
    const iter = iterable[Symbol.iterator]();
    let res = iter.next();
    for (let taken = 0; !res.done && taken < n; taken++) {
        yield res.value;
        res = iter.next();
    }
}

export function first<A>(iterable: Iterable<A>): A | undefined {
    const iter = iterable[Symbol.iterator]();
    const res = iter.next();
    if (res.done) {
        return undefined;
    }
    return res.value;
}

export class Vec2 {
    static zeroes: Vec2 = new Vec2(0, 0);
    static of(n: number): Vec2 {
        return new Vec2(n, n);
    }
    static compare(l: Vec2, r: Vec2): number {
        const xOrd = compare(l.x, r.x);
        return xOrd !== 0 ? xOrd : compare(l.y, r.y);
    }
    static min(...vecs: Vec2[]) {
        if (vecs.length === 0) {
            throw new Error("Missing argument");
        }
        let min = vecs[0];
        for (let i = 1; i < vecs.length; i++) {
            const vec = vecs[i];
            if (this.compare(min, vec) < 0) {
                min = vec;
            }
        }
        return min;
    }
    static max(...vecs: Vec2[]) {
        if (vecs.length === 0) {
            throw new Error("Missing argument");
        }
        let max = vecs[0];
        for (let i = 1; i < vecs.length; i++) {
            const vec = vecs[i];
            if (this.compare(max, vec) > 0) {
                max = vec;
            }
        }
        return max;
    }
    constructor(readonly x: number, readonly y: number) {}

    equals(r: Vec2): boolean {
        return this.x === r.x && this.y === r.y;
    }

    add(r: Vec2): Vec2 {
        return new Vec2(this.x + r.x, this.y + r.y);
    }

    sub(r: Vec2): Vec2 {
        return new Vec2(this.x - r.x, this.y - r.y);
    }

    mul(r: Vec2): Vec2 {
        return new Vec2(this.x * r.x, this.y * r.y);
    }

    mod(r: Vec2): Vec2 {
        return new Vec2(this.x % r.x, this.y % r.y);
    }

    div(r: Vec2): Vec2 {
        return new Vec2(this.x / r.x, this.y / r.y);
    }

    addN(r: number): Vec2 {
        return new Vec2(this.x + r, this.y + r);
    }

    subN(r: number): Vec2 {
        return new Vec2(this.x - r, this.y - r);
    }

    mulN(r: number): Vec2 {
        return new Vec2(this.x * r, this.y * r);
    }

    modN(r: number): Vec2 {
        return new Vec2(this.x % r, this.y % r);
    }

    divN(r: number): Vec2 {
        return new Vec2(this.x / r, this.y / r);
    }

    abs(): Vec2 {
        return new Vec2(Math.floor(this.x), Math.floor(this.y));
    }

    floor(): Vec2 {
        return new Vec2(Math.floor(this.x), Math.floor(this.y));
    }

    ceil(): Vec2 {
        return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
    }

    round(): Vec2 {
        return new Vec2(Math.round(this.x), Math.round(this.y));
    }

    map(f: (n: number) => number): Vec2 {
        return new Vec2(f(this.x), f(this.y));
    }

    mapX(f: (n: number) => number): Vec2 {
        return new Vec2(f(this.x), this.y);
    }

    mapY(f: (n: number) => number): Vec2 {
        return new Vec2(this.x, f(this.y));
    }

    up() {
        return new Vec2(this.x, this.y - 1);
    }

    down() {
        return new Vec2(this.x, this.y + 1);
    }

    left() {
        return new Vec2(this.x - 1, this.y);
    }

    right() {
        return new Vec2(this.x + 1, this.y);
    }

    assertIsInt(): Vec2 {
        if (this.x !== Math.round(this.x) || this.y !== Math.round(this.y)) {
            throw new Error(`Unexpected floating point: ${this}`);
        }
        return this;
    }

    *[Symbol.iterator](): Iterator<number> {
        yield this.x;
        yield this.y;
    }

    toString(): string {
        return `[${this.x},${this.y}]`;
    }
}

export class Grid<A> {
    readonly width: number;
    readonly height: number;
    constructor(readonly grid: A[][]) {
        this.height = grid.length;
        this.width = grid[0].length;
        for (const row of grid) {
            if (row.length !== grid[0].length) {
                throw new Error(
                    "Rows length are not the same.\n" + JSON.stringify(grid),
                );
            }
        }
    }

    cloneLayout(): Grid<A> {
        return new Grid(this.grid.map((x) => x.slice()));
    }

    scalarGetUnsafe(x: number, y: number): A {
        this.#checkBounds(x, y);
        return this.grid[y][x];
    }

    scalarGet(x: number, y: number): A | undefined {
        return this.grid[y]?.[x];
    }

    getUnsafe({ x, y }: Vec2): A | undefined {
        return this.scalarGetUnsafe(x, y);
    }

    get({ x, y }: Vec2): A | undefined {
        return this.scalarGet(x, y);
    }

    scalarSetUnsafe(x: number, y: number, val: A) {
        this.#checkBounds(x, y);
        this.grid[y][x] = val;
    }

    scalarSet(x: number, y: number, val: A) {
        if (this.scalarIsInBounds(x, y)) {
            this.grid[y][x] = val;
        }
    }

    set({ x, y }: Vec2, val: A) {
        this.scalarSet(x, y, val);
    }

    setUnsafe({ x, y }: Vec2, val: A) {
        this.scalarSetUnsafe(x, y, val);
    }

    getRow(y: number): readonly A[] {
        this.#checkBounds(0, y);
        return this.grid[y];
    }

    *getColumn(x: number): Iterable<A> {
        this.#checkBounds(x, 0);
        for (const row of this.grid) {
            yield row[x];
        }
    }

    count(f: (val: A, coord: Vec2) => boolean): number {
        let sum = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const val = this.grid[y][x];
                if (f(val, new Vec2(x, y))) {
                    sum++;
                }
            }
        }
        return sum;
    }

    *iter(): Iterable<{ val: A; coord: Vec2 }> {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const val = this.grid[y][x];
                const coord = new Vec2(x, y);
                yield { val, coord };
            }
        }
    }

    toString(): string;
    toString(f: (val: A, coord: Vec2) => string): string;
    toString(
        f?: ((val: A, coord: Vec2) => string) | undefined,
    ): string {
        const defF = (val: A, _coord: Vec2): string => "" + val;
        f = f ?? defF;

        const parts: string[] = [];
        for (let x = 0; x < this.width; x++) {
            const val = this.grid[0][x];
            parts.push(f(val, new Vec2(x, 0)));
        }
        for (let y = 1; y < this.height; y++) {
            parts.push("\n");
            for (let x = 0; x < this.width; x++) {
                const val = this.grid[y][x];
                parts.push(f(val, new Vec2(x, y)));
            }
        }
        return parts.join("");
    }

    scalarIsInBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    isInBounds({ x, y }: Vec2): boolean {
        return this.scalarIsInBounds(x, y);
    }

    find(f: (val: A, coord: Vec2) => boolean): { val: A; coord: Vec2 } | null {
        for (const x of this.iter()) {
            if (f(x.val, x.coord)) {
                return x;
            }
        }
        return null;
    }

    #checkBounds(x: number, y: number) {
        if (x !== Math.round(x) || y !== Math.round(y)) {
            throw new Error(`Unexpected floating point: [${x},${y}]`);
        }
        if (this.scalarIsInBounds(x, y)) {
            throw new Error(
                `Out of bounds [${x},${y}]. Width=${this.width}. Height=${this.height}.\n${this}`,
            );
        }
    }
}

export class MultiMap<K, V> {
    readonly #map = new Map<K, Set<V>>();

    get(key: K): ReadonlySet<V> {
        let set = this.#map.get(key);
        if (!set) {
            set = new Set();
            this.#map.set(key, set);
        }
        return set;
    }

    add(key: K, val: V): void {
        let set = this.#map.get(key);
        if (!set) {
            set = new Set();
            this.#map.set(key, set);
        }
        set.add(val);
    }

    *[Symbol.iterator](): Iterator<[K, ReadonlySet<V>]> {
        for (const x of this.#map) {
            yield x;
        }
    }
}

export class Queue<A> {
    #read: A[];
    #write: A[];
    constructor(items?: Iterable<A>) {
        this.#read = items ? [...items] : [];
        this.#write = [];
    }
    get length() {
        return this.#read.length + this.#write.length;
    }
    add(val: A): void {
        this.#write.push(val);
    }
    next(): A | null {
        if (this.#read.length > 0) {
            return this.#read.pop()!;
        }
        if (this.#write.length > 0) {
            const tmp = this.#write;
            tmp.reverse();
            this.#write = this.#read;
            this.#read = tmp;
            return this.#read.pop()!;
        }
        return null;
    }
}
