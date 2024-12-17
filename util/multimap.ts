import { OrdSet } from "./ordset.ts";
import { OrdMap } from "./ordmap.ts";
import { LessThan } from "./shared.ts";

export class MultiMap<K, V> {
    static empty<K, V>(klt: LessThan<K>, vlt: LessThan<V>): MultiMap<K, V> {
        const map = OrdMap.empty<K, OrdSet<V>>(klt);
        return new MultiMap(map, vlt, 0);
    }

    readonly #map: OrdMap<K, OrdSet<V>>;
    readonly #vlt: LessThan<V>;
    readonly size: number;

    private constructor(
        map: OrdMap<K, OrdSet<V>>,
        vlt: LessThan<V>,
        size: number,
    ) {
        this.#map = map;
        this.#vlt = vlt;
        this.size = size;
    }

    popFirst(): [K, V, MultiMap<K, V>] | undefined {
        const first = this.#map.min();
        if (!first) {
            return undefined;
        }
        const [key, firstSet] = first;
        const firstVal = firstSet.min()!;
        const nextFirstSet = firstSet.remove(firstVal);
        if (nextFirstSet.size === 0) {
            const nextMap = this.#map.remove(key);
            return [
                key,
                firstVal,
                new MultiMap(nextMap, this.#vlt, this.size - 1),
            ];
        }
        const nextMap = this.#map.insert(key, nextFirstSet);
        return [
            key,
            firstVal,
            new MultiMap(nextMap, this.#vlt, this.size - 1),
        ];
    }

    find(key: K): OrdSet<V> {
        return this.#map.find(key) ?? OrdSet.empty(this.#vlt);
    }

    insert(key: K, val: V): MultiMap<K, V> {
        const set = this.#map.find(key);
        if (!set) {
            const nextSet = OrdSet.of(val, this.#vlt);
            return new MultiMap(
                this.#map.insert(key, nextSet),
                this.#vlt,
                this.size + 1,
            );
        }
        const preLen = set.size;
        const nextSet = set.insert(val);
        const sizeD = nextSet.size - preLen;
        return new MultiMap(
            this.#map.insert(key, nextSet),
            this.#vlt,
            this.size + sizeD,
        );
    }

    *[Symbol.iterator](): Iterator<[K, OrdSet<V>]> {
        for (const x of this.#map) {
            yield x;
        }
    }
}
