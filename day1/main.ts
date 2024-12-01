import { sum } from "../util.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const pairs = text.split("\n").map((s) =>
    s.split("   ").map((z) => Number(z))
  );
  const left = pairs.map((x) => x[0]).sort();
  const right = pairs.map((x) => x[1]).sort();
  const dists = left.map((x, i) => Math.abs(x - right[i]));

  return sum(dists);
}

export function solvePart2(text: string): number {
  const pairs = text.split("\n").map((s) =>
    s.split("   ").map((z) => Number(z))
  );
  const left = pairs.map((x) => x[0]);
  const right = pairs.map((x) => x[1]);

  const rightCount: number[] = [];
  for (const n of right) {
    rightCount[n] = (rightCount.at(n) ?? 0) + 1;
  }

  const similarities = left.map((n) => n * (rightCount.at(n) ?? 0));

  return sum(similarities);
}

if (import.meta.main) {
  await main();
}
