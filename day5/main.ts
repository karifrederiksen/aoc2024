async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const [depsLines, orderLines] = text.split("\n\n").map((x) => x.split("\n"));

  const depGraph: Map<string, Set<string>> = new Map();
  for (
    const [before, after] of depsLines.map((x) => x.split("|"))
  ) {
    const deps: Set<string> = depGraph.get(after) ?? new Set();
    deps.add(before);
    depGraph.set(after, deps);
  }

  let sum = 0;
  for (const line of orderLines.map((x) => x.split(","))) {
    const reorderedLine = reorder(line, depGraph);
    if (line.every((v, i) => v === reorderedLine[i])) {
      sum += Number(reorderedLine[Math.floor(line.length / 2)]);
    }
  }
  return sum;
}

export function solvePart2(text: string): number {
  const [depsLines, orderLines] = text.split("\n\n").map((x) => x.split("\n"));

  const depGraph: Map<string, Set<string>> = new Map();
  for (
    const [before, after] of depsLines.map((x) => x.split("|"))
  ) {
    const deps: Set<string> = depGraph.get(after) ?? new Set();
    deps.add(before);
    depGraph.set(after, deps);
  }

  let sum = 0;
  for (const line of orderLines.map((x) => x.split(","))) {
    const reorderedLine = reorder(line, depGraph);
    if (line.some((v, i) => v !== reorderedLine[i])) {
      sum += Number(reorderedLine[Math.floor(line.length / 2)]);
    }
  }
  return sum;
}

function reorder(
  line: readonly string[],
  depGraph: Map<string, Set<string>>,
): string[] {
  const line2 = line.slice();
  line2.sort((l, r) => {
    const rDeps = depGraph.get(r) ?? new Set();
    const lDeps = depGraph.get(l) ?? new Set();
    if (rDeps.has(l)) {
      return -1;
    }
    if (lDeps.has(r)) {
      return 1;
    }
    return 0;
  });
  return line2;
}

if (import.meta.main) {
  await main();
}
