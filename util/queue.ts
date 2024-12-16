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
