import { Vec2 } from "./vec2.ts";

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
