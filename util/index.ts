import { Seq } from "./seq.ts";
import { Vec2 } from "./vec2.ts";
import { Grid } from "./grid.ts";
import { MultiMap } from "./multimap.ts";
import { OrdMap } from "./ordmap.ts";
import { OrdSet } from "./ordset.ts";
import { Queue } from "./queue.ts";
import { compareNumber, numberLT } from "./shared.ts";
export {
    compareNumber,
    compareNumber as compare,
    Grid,
    MultiMap,
    numberLT,
    OrdMap,
    OrdSet,
    Queue,
    Seq,
    Vec2,
};

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
