async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const reports = text.split("\n").map((x) => x.split(" ").map(Number));

  const safe = reports.filter((x) =>
    isSafelyIncreasing(x, false) || isSafelyDecreasing(x, false)
  );

  return safe.length;
}

export function solvePart2(text: string): number {
  const reports = text.split("\n").map((x) => x.split(" ").map(Number));

  const safe = reports.filter((x) =>
    isSafelyIncreasing(x, true) || isSafelyDecreasing(x, true)
  );

  return safe.length;
}

function isSafelyIncreasing(
  report: number[],
  allowRecursion: boolean,
): boolean {
  for (let i = 1; i < report.length; i++) {
    const prev = report[i - 1];
    const next = report[i];
    const delta = Math.abs(prev - next);
    const isSafe = prev < next && delta <= 3;
    if (!isSafe) {
      if (allowRecursion) {
        return withOneRemoved(report).some((x) => isSafelyIncreasing(x, false));
      }
      return false;
    }
  }
  return true;
}

function isSafelyDecreasing(
  report: number[],
  allowRecursion: boolean,
): boolean {
  for (let i = 1; i < report.length; i++) {
    const prev = report[i - 1];
    const next = report[i];
    const delta = Math.abs(prev - next);
    const isSafe = prev > next && delta <= 3;
    if (!isSafe) {
      if (allowRecursion) {
        return withOneRemoved(report).some((x) => isSafelyDecreasing(x, false));
      }
      return false;
    }
  }
  return true;
}

function withOneRemoved(report: number[]) {
  const all: number[][] = [];
  for (let i = 0; i < report.length; i++) {
    const x = report.slice();
    x.splice(i, 1);
    all.push(x);
  }
  return all;
}

if (import.meta.main) {
  await main();
}
