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
