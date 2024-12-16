export class Seq<A> implements Iterable<A, void, void> {
    static range(first: number, last: number): Seq<number> {
        return new Seq(range(first, last));
    }

    constructor(private readonly iterable: Iterable<A, void, void>) {}

    map<B>(f: (val: A) => B): Seq<B> {
        return new Seq<B>(map(this.iterable, f));
    }

    flatMap<B>(f: (val: A) => Iterable<B>): Seq<B> {
        return new Seq<B>(flatMap(this.iterable, f));
    }

    filter(f: (val: A) => boolean): Seq<A> {
        return new Seq(filter(this.iterable, f));
    }

    first(): A | undefined {
        return first(this.iterable);
    }

    take(n: number): Seq<A> {
        return new Seq(take(n, this.iterable));
    }

    skip(n: number): Seq<A> {
        return new Seq(skip(n, this.iterable));
    }

    sorted(f: (l: A, r: A) => number): Seq<A> {
        const sorted = [...this.iterable].sort(f);
        return new Seq(sorted);
    }

    cached(): Seq<A> {
        return new Seq([...this.iterable]);
    }

    toArray(): A[] {
        return [...this.iterable];
    }

    [Symbol.iterator](): Iterator<A, void, void> {
        return this.iterable[Symbol.iterator]();
    }
}

function* skip<A>(
    n: number,
    iterable: Iterable<A, void, void>,
): Iterable<A, void, void> {
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

function* take<A>(
    n: number,
    iterable: Iterable<A, void, void>,
): Iterable<A, void, void> {
    const iter = iterable[Symbol.iterator]();
    let res = iter.next();
    for (let taken = 0; !res.done && taken < n; taken++) {
        yield res.value;
        res = iter.next();
    }
}

function first<A>(iterable: Iterable<A, void, void>): A | undefined {
    const iter = iterable[Symbol.iterator]();
    const res = iter.next();
    if (res.done) {
        return undefined;
    }
    return res.value;
}

function* filter<A>(
    iterable: Iterable<A, void, void>,
    f: (val: A) => boolean,
): Iterable<A, void, void> {
    for (const val of iterable) {
        if (f(val)) {
            yield val;
        }
    }
}

function* map<A, B>(
    iterable: Iterable<A, void, void>,
    f: (val: A) => B,
): Iterable<B, void, void> {
    for (const val of iterable) {
        yield f(val);
    }
}

function* flatMap<A, B>(
    iterable: Iterable<A, void, void>,
    f: (val: A) => Iterable<B>,
): Iterable<B, void, void> {
    for (const val of iterable) {
        const iterB = f(val);
        for (const valB of iterB) {
            yield valB;
        }
    }
}

function* range(first: number, last: number): Iterable<number, void, void> {
    if (first > last) {
        throw new Error(
            "invalid arguments: " + JSON.stringify({ first, last }),
        );
    }
    for (let n = first; n <= last; n++) {
        yield n;
    }
}
