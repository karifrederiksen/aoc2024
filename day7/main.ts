import { sum } from "../util.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  return sum(
    text.split("\n").map((eq) => {
      const [lhs, rhs] = eq.split(": ");
      const target = Number(lhs);
      const xs = rhs.split(" ").map(Number);
      return canSolveEquationPart1(target, xs) ? target : 0;
    }),
  );
}

function canSolveEquationPart1(
  target: number,
  xs: readonly number[],
): boolean {
  if (xs.length === 1) {
    return target === xs[0];
  }
  if (target < 0) {
    return false;
  }
  const tail = xs[xs.length - 1];
  const headSlice = xs.slice(0, xs.length - 1);
  return canSolveEquationPart1(target - tail, headSlice) ||
    canSolveEquationPart1(target % tail === 0 ? target / tail : -1, headSlice);
}

export function solvePart2(text: string): number {
  return sum(
    text.split("\n").map((eq) => {
      const [lhs, rhs] = eq.split(": ");
      const target = Number(lhs);
      const xs = rhs.split(" ").map(Number);
      return canSolveEquationPart2(target, xs) ? target : 0;
    }),
  );
}

function canSolveEquationPart2(
  target: number,
  xs: readonly number[],
): boolean {
  if (xs.length === 1) {
    return target === xs[0];
  }
  if (target < 0) {
    return false;
  }
  const tail = xs[xs.length - 1];
  const headSlice = xs.slice(0, xs.length - 1);
  if (canSolveEquationPart2(target - tail, headSlice)) {
    return true;
  }
  if (
    canSolveEquationPart2(target % tail === 0 ? target / tail : -1, headSlice)
  ) {
    return true;
  }
  return canSolveEquationPart2(uncat(target, tail), headSlice);
}

function uncat(l: number, r: number): number {
  const delta = l - r;
  const rMag = 10 ** (Math.floor(Math.log10(r)) + 1);
  return delta > 0 && delta % rMag === 0 ? delta / rMag : -1;
}

if (import.meta.main) {
  await main();
}
