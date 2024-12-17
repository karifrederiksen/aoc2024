import { MultiMap, numberLT, sum, Vec2 } from "../util/index.ts";

export type Scenario = {
  buttonA: Vec2;
  buttonB: Vec2;
  prizeLoc: Vec2;
};

export function solvePart1(text: string): number {
  const scenarios = parse(text);

  return sum(scenarios.map((x) => tokensRequired(x) ?? 0));
}

function tokensRequired(
  { buttonA, buttonB, prizeLoc }: Scenario,
): number | null {
  let queue = MultiMap.empty<number, Vec2>(
    numberLT,
    Vec2.lessThan,
  ).insert(
    0,
    Vec2.zeroes,
  );
  while (queue.size) {
    const [cost, loc, nextQueue] = queue.popFirst()!;
    queue = nextQueue;
    // console.log(cost, loc.toString(), queue.size);
    if (prizeLoc.x < loc.x || prizeLoc.y < loc.y) {
      continue;
    }
    if (loc.equals(prizeLoc)) {
      return cost;
    }
    queue = queue.insert(cost + 3, loc.add(buttonA));
    queue = queue.insert(cost + 1, loc.add(buttonB));
  }
  return null;
}

function parse(text: string): Scenario[] {
  return text.split("\n\n").map((s) => {
    const [buttonAText, buttonBText, prizeText] = s.split("\n");
    const [_a, ax, ay] = /^Button A: X\+(\d+), Y\+(\d+)$/.exec(buttonAText)!;
    const [_b, bx, by] = /^Button B: X\+(\d+), Y\+(\d+)$/.exec(buttonBText)!;
    const [_p, px, py] = /^Prize: X=(\d+), Y=(\d+)$/.exec(prizeText)!;
    return {
      buttonA: new Vec2(Number(ax), Number(ay)),
      buttonB: new Vec2(Number(bx), Number(by)),
      prizeLoc: new Vec2(Number(px), Number(py)),
    } as Scenario;
  });
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}
