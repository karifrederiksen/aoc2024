import { Grid, sum, Vec2 } from "../util/index.ts";

export function solvePart1(text: string): number {
  const [gridSrc, movesSrc] = text.split("\n\n");
  const grid = new Grid(
    gridSrc.split("\n").map((x) => [...x]),
  );
  const moves = [...movesSrc.split("\n").join("")];
  const robot = grid.find((x) => x === "@");
  if (!robot) {
    throw new Error("robot not found");
  }

  let robotPos = robot.coord;
  grid.set(robotPos, ".");
  for (const move of moves) {
    switch (move) {
      case "<":
        robotPos = tryMove(grid, (v) => v.left(), robotPos) ?? robotPos;
        break;
      case ">":
        robotPos = tryMove(grid, (v) => v.right(), robotPos) ?? robotPos;
        break;
      case "^":
        robotPos = tryMove(grid, (v) => v.up(), robotPos) ?? robotPos;
        break;
      case "v":
        robotPos = tryMove(grid, (v) => v.down(), robotPos) ?? robotPos;
        break;
      default:
        throw new Error("unexpected direction: " + move);
    }
  }

  const boxCoords = [...grid.iter()].filter(({ val }) => val === "O").map((
    { coord },
  ) => 100 * coord.y + coord.x);

  return sum(boxCoords);
}

function tryMove(
  grid: Grid<string>,
  dir: (val: Vec2) => Vec2,
  pos: Vec2,
): Vec2 | null {
  const nextPos = dir(pos);
  const nextVal = grid.get(nextPos);
  switch (grid.get(nextPos)) {
    case undefined:
    case "#":
      return null;
    case ".":
      grid.set(nextPos, grid.get(pos)!);
      grid.set(pos, ".");
      return nextPos;
    case "O": {
      const subMovePos = tryMove(grid, dir, nextPos);
      if (!subMovePos) {
        return null;
      }
      grid.set(nextPos, grid.get(pos)!);
      grid.set(pos, ".");
      return nextPos;
    }
    default:
      throw new Error("unexpected value: " + nextVal);
  }
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}
