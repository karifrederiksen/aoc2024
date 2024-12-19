import { sum } from "../util/index.ts";

export function solvePart2(text: string): number {
  const [typesText, patternsText] = text.split("\n\n");
  const types = new Set(typesText.split(", "));
  const patterns = patternsText.split("\n");

  return sum(patterns.map((p) => countCombinations(types, p)));
}

const cache = new Map<string, number>();
function countCombinations(types: Set<string>, p: string): number {
  if (p === "") {
    return 1;
  }
  if (cache.has(p)) {
    return cache.get(p)!;
  }
  let n = 0;
  for (let i = 1; i < p.length + 1; i++) {
    const pre = p.substring(0, i);
    const post = p.substring(i);
    if (!types.has(pre)) {
      continue;
    }
    n += countCombinations(types, post);
  }
  cache.set(p, n);
  return n;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}
