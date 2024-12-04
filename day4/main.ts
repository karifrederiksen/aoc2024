import { range, sum } from "../util.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

type Pt = readonly [number, number];

export function solvePart1(text: string): number {
  const lines = text.split("\n");

  const up = [[0, 0], [0, -1], [0, -2], [0, -3]] as const;
  const down = [[0, 0], [0, 1], [0, 2], [0, 3]] as const;
  const left = [[0, 0], [-1, 0], [-2, 0], [-3, 0]] as const;
  const right = [[0, 0], [1, 0], [2, 0], [3, 0]] as const;
  const upRight = [[0, 0], [1, 1], [2, 2], [3, 3]] as const;
  const downRight = [[0, 0], [1, -1], [2, -2], [3, -3]] as const;
  const downLeft = [[0, 0], [-1, -1], [-2, -2], [-3, -3]] as const;
  const upLeft = [[0, 0], [-1, 1], [-2, 2], [-3, 3]] as const;

  const getPoint = ([x, y]: Pt) => lines[y]?.[x] ?? "";

  const xmasDirectionCount = ([x, y]: Pt) => {
    const directions = [
      up,
      down,
      left,
      right,
      upRight,
      downRight,
      downLeft,
      upLeft,
    ].map((
      [[x1, y1], [x2, y2], [x3, y3], [x4, y4]],
    ) =>
      [[x + x1, y + y1], [x + x2, y + y2], [x + x3, y + y3], [
        x + x4,
        y + y4,
      ]] as const
    );

    const matches = directions.filter(([p1, p2, p3, p4]) =>
      getPoint(p1) + getPoint(p2) + getPoint(p3) + getPoint(p4) === "XMAS"
    );
    return matches.length;
  };

  const allPositions = range(0, lines.length - 1).flatMap((y) =>
    range(0, lines[0].length - 1).map((x) => [x, y] as const)
  );
  return sum(allPositions.map(xmasDirectionCount));
}

export function solvePart2(text: string): number {
  const lines = text.split("\n");
  const upRight = [[-1, -1], [0, 0], [1, 1]] as const;
  const downRight = [[-1, 1], [0, 0], [1, -1]] as const;
  const downLeft = [[1, 1], [0, 0], [-1, -1]] as const;
  const upLeft = [[1, -1], [0, 0], [-1, 1]] as const;

  const getPoint = ([x, y]: Pt) => lines[y]?.[x] ?? "";

  const isXMas = ([x, y]: Pt) => {
    const directions = [
      upRight,
      downRight,
      downLeft,
      upLeft,
    ].map((
      [[x1, y1], [x2, y2], [x3, y3]],
    ) => [[x + x1, y + y1], [x + x2, y + y2], [x + x3, y + y3]] as const);

    const matches = directions.filter(([p1, p2, p3]) =>
      getPoint(p1) + getPoint(p2) +
          getPoint(p3) === "MAS"
    );
    return matches.length >= 2;
  };

  const allPositions = range(0, lines.length - 1).flatMap((y) =>
    range(0, lines[0].length - 1).map((x) => [x, y] as const)
  );
  return allPositions.filter(isXMas).length;
}

if (import.meta.main) {
  await main();
}
