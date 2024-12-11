import { sum } from "../util.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const stones = text.split(" ").map(Number);

  return sum(stones.map((x) => blink(x, 25)));
}

export function solvePart2(text: string): number {
  const stones = text.split(" ").map(Number);

  return sum(stones.map((x) => blink(x, 75)));
}

function lazy2<A, B, C>(
  toKey: (arg1: A, arg2: B) => string,
  f: (arg1: A, arg2: B) => C,
) {
  const cache = new Map();
  return (arg1: A, arg2: B): C => {
    const key = toKey(arg1, arg2);
    let res;
    if (cache.has(key)) {
      res = cache.get(key);
    } else {
      res = f(arg1, arg2);
      cache.set(key, res);
    }
    return res;
  };
}

const blink = lazy2(
  (stones, count) => `${count}|${stones}`,
  (n: number, count: number) => {
    if (count === 0) {
      return 1;
    }
    let sum = 0;
    if (n === 0) {
      sum += blink(1, count - 1);
    } else if (n.toString().length % 2 === 0) {
      const s = n.toString();
      const left = s.substring(0, s.length / 2);
      const right = s.substring(left.length);
      sum += blink(Number(left), count - 1);
      sum += blink(Number(right), count - 1);
    } else {
      sum += blink(n * 2024, count - 1);
    }

    return sum;
  },
);

if (import.meta.main) {
  await main();
}
