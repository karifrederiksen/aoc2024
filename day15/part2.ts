import { Grid, sum, Vec2 } from "../util.ts";

export function solvePart2(text: string): number {
  const [gridSrc, movesSrc] = text.split("\n\n");
  const grid = new Grid(
    expand(gridSrc.split("\n").map((x) => [...x])),
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
        if (tryMoveLeft(grid, robotPos)) {
          robotPos = robotPos.left();
        }
        break;
      case ">":
        if (tryMoveRight(grid, robotPos)) {
          robotPos = robotPos.right();
        }
        break;
      case "^":
        if (tryMoveUp(grid, robotPos)) {
          robotPos = robotPos.up();
        }
        break;
      case "v":
        if (tryMoveDown(grid, robotPos)) {
          robotPos = robotPos.down();
        }
        break;
      default:
        throw new Error("unexpected direction: " + move);
    }
  }

  const boxCoords = [...grid.iter()].filter(({ val }) => val === "[").map((
    { coord },
  ) => 100 * coord.y + coord.x);

  return sum(boxCoords);
}

function tryMoveLeft(
  grid: Grid<string>,
  pos: Vec2,
): boolean {
  switch (grid.get(pos.left())) {
    case undefined:
    case "#":
      return false;
    case ".":
      grid.set(pos.left(), grid.get(pos)!);
      grid.set(pos, ".");
      return true;
    case "]": {
      const rightEdge = pos.left();
      const leftEdge = rightEdge.left();
      if (!tryMoveLeft(grid, leftEdge)) {
        return false;
      }
      const nextPos = leftEdge.left();
      grid.set(rightEdge, ".");
      grid.set(leftEdge, "]");
      grid.set(nextPos, "[");
      return true;
    }
    default: {
      const nextVal = grid.get(pos.left());
      throw new Error("unexpected value: " + nextVal);
    }
  }
}

function tryMoveRight(
  grid: Grid<string>,
  pos: Vec2,
): boolean {
  switch (grid.get(pos.right())) {
    case undefined:
    case "#":
      return false;
    case ".":
      grid.set(pos.right(), grid.get(pos)!);
      grid.set(pos, ".");
      return true;
    case "[": {
      const leftEdge = pos.right();
      const rightEdge = leftEdge.right();
      if (!tryMoveRight(grid, rightEdge)) {
        return false;
      }
      const nextPos = rightEdge.right();
      grid.set(leftEdge, ".");
      grid.set(rightEdge, "[");
      grid.set(nextPos, "]");
      return true;
    }
    default: {
      const nextVal = grid.get(pos.left());
      throw new Error("unexpected value: " + nextVal);
    }
  }
}

function tryMoveUp(
  grid: Grid<string>,
  pos: Vec2,
): boolean {
  const nextPos = pos.up();
  switch (grid.get(nextPos)) {
    case undefined:
    case "#":
      return false;
    case ".":
      grid.set(nextPos, grid.get(pos)!);
      grid.set(pos, ".");
      return true;
    case "[": {
      const leftEdge = nextPos;
      const rightEdge = nextPos.right();
      if (
        tryMoveUp(grid.cloneLayout(), leftEdge) && tryMoveUp(grid, rightEdge)
      ) {
        tryMoveUp(grid, leftEdge);
        grid.set(leftEdge.up(), "[");
        grid.set(rightEdge.up(), "]");
        grid.set(leftEdge, ".");
        grid.set(rightEdge, ".");
        return true;
      }
      return false;
    }
    case "]": {
      const leftEdge = nextPos.left();
      const rightEdge = nextPos;
      if (
        tryMoveUp(grid.cloneLayout(), leftEdge) && tryMoveUp(grid, rightEdge)
      ) {
        tryMoveUp(grid, leftEdge);
        grid.set(leftEdge.up(), "[");
        grid.set(rightEdge.up(), "]");
        grid.set(leftEdge, ".");
        grid.set(rightEdge, ".");
        return true;
      }
      return false;
    }
    default:
      throw new Error("unexpected value: " + grid.get(nextPos));
  }
}

function tryMoveDown(
  grid: Grid<string>,
  pos: Vec2,
): boolean {
  const nextPos = pos.down();
  switch (grid.get(nextPos)) {
    case undefined:
    case "#":
      return false;
    case ".":
      grid.set(nextPos, grid.get(pos)!);
      grid.set(pos, ".");
      return true;
    case "[": {
      const leftEdge = nextPos;
      const rightEdge = nextPos.right();
      if (
        tryMoveDown(grid.cloneLayout(), leftEdge) &&
        tryMoveDown(grid, rightEdge)
      ) {
        tryMoveDown(grid, leftEdge);
        grid.set(leftEdge.down(), "[");
        grid.set(rightEdge.down(), "]");
        grid.set(leftEdge, ".");
        grid.set(rightEdge, ".");
        return true;
      }
      return false;
    }
    case "]": {
      const leftEdge = nextPos.left();
      const rightEdge = nextPos;
      if (
        tryMoveDown(grid.cloneLayout(), leftEdge) &&
        tryMoveDown(grid, rightEdge)
      ) {
        tryMoveDown(grid, leftEdge);
        grid.set(leftEdge.down(), "[");
        grid.set(rightEdge.down(), "]");
        grid.set(leftEdge, ".");
        grid.set(rightEdge, ".");
        return true;
      }
      return false;
    }
    default:
      throw new Error("unexpected value: " + grid.get(nextPos));
  }
}

function expand(grid: string[][]): string[][] {
  const output: string[][] = [];
  for (const row of grid) {
    const outRow: string[] = [];
    for (const cell of row) {
      switch (cell) {
        case "@":
          outRow.push(..."@.");
          break;
        case ".":
          outRow.push(..."..");
          break;
        case "#":
          outRow.push(..."##");
          break;
        case "O":
          outRow.push(..."[]");
          break;
        default:
          throw new Error("unexpected cell value: " + cell);
      }
    }
    output.push(outRow);
  }
  return output;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}
