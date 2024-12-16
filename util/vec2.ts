import { compareNumber, numberLT } from "./shared.ts";

export class Vec2 {
    static zeroes: Vec2 = new Vec2(0, 0);
    static of(n: number): Vec2 {
        return new Vec2(n, n);
    }
    static compare(l: Vec2, r: Vec2): number {
        const xOrd = compareNumber(l.x, r.x);
        return xOrd !== 0 ? xOrd : compareNumber(l.y, r.y);
    }
    static lessThan(l: Vec2, r: Vec2): boolean {
        return numberLT(l.x, r.x) ||
            (!numberLT(r.x, l.x) && numberLT(l.y, r.y));
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
