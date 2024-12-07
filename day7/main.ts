import { sum } from "../util.ts";
async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const equations = text.split("\n");

  const results = equations.map((x) => {
    const [lhss, rhs] = x.split(": ");
    const xs = rhs.split(" ").map((x) => Number(x));
    const lhs = Number(lhss);
    if (combinations(xs).some((x) => x === lhs)) {
      return lhs;
    }
    return 0;
  });
  return sum(results);
}

function combinations(xs: readonly number[]): number[] {
  const res: number[] = [];
  const opss: Op[][] = [[]];
  generateCombinations(opss, xs.length - 1);

  for (const ops of opss) {
    let lhs = xs[0];
    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];
      const rhs = xs[i + 1];
      lhs = op(lhs, rhs);
    }
    res.push(lhs);
  }
  return res;
}

function generateCombinations(opss: Op[][], goalLen: number) {
  const startCount = opss.length;
  const startLen = opss.at(0)?.length ?? 0;
  for (let i = 0; i < startCount; i++) {
    const addOps = opss[i];
    const mulOps = addOps.slice();
    opss.push(mulOps);
    addOps.push(add);
    mulOps.push(mul);
  }
  if (startLen + 1 < goalLen) {
    generateCombinations(opss, goalLen);
  }
}

export function solvePart2(text: string): number {
  const equations = text.split("\n");

  const results = equations.map((x) => {
    const [lhss, rhs] = x.split(": ");
    const xs = rhs.split(" ").map((x) => Number(x));
    const lhs = Number(lhss);
    if (combinations2(xs).some((x) => x === lhs)) {
      return lhs;
    }
    return 0;
  });
  return sum(results);
}

function combinations2(xs: readonly number[]): number[] {
  const res: number[] = [];
  const opss: Op[][] = [[]];
  generateCombinations2(opss, xs.length - 1);

  for (const ops of opss) {
    let lhs = xs[0];
    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];
      const rhs = xs[i + 1];
      lhs = op(lhs, rhs);
    }
    res.push(lhs);
  }
  return res;
}

function generateCombinations2(opss: Op[][], goalLen: number) {
  const startCount = opss.length;
  const startLen = opss.at(0)?.length ?? 0;
  for (let i = 0; i < startCount; i++) {
    const addOps = opss[i];
    const mulOps = addOps.slice();
    const catOps = addOps.slice();
    opss.push(mulOps);
    opss.push(catOps);
    addOps.push(add);
    mulOps.push(mul);
    catOps.push(cat);
  }
  if (startLen + 1 < goalLen) {
    generateCombinations2(opss, goalLen);
  }
}

type Op = (l: number, r: number) => number;

function add(l: number, r: number) {
  return l + r;
}

function mul(l: number, r: number) {
  return l * r;
}

function cat(l: number, r: number) {
  const rLen = Math.floor(Math.log10(r) + 1);
  return l * (10 ** rLen) + r;
}

if (import.meta.main) {
  await main();
}
