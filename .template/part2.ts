import { sum } from "../util.ts";

export function solvePart2(text: string): number {
  return -1;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}
