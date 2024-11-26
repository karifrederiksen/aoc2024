async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  return -1;
}

export function solvePart2(text: string): number {
  return -1;
}

if (import.meta.main) {
  await main();
}
