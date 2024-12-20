import { assertEquals } from "@std/assert";
import { solvePart1 } from "./part1.ts";

const EXAMPLE_GRID = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

Deno.test(function part1_example() {
  const res = solvePart1(EXAMPLE_GRID);
  assertEquals(res.filter((x) => x.saved === 2).length, 14);
  assertEquals(res.filter((x) => x.saved === 4).length, 14);
  assertEquals(res.filter((x) => x.saved === 6).length, 2);
  assertEquals(res.filter((x) => x.saved === 8).length, 4);
  assertEquals(res.filter((x) => x.saved === 10).length, 2);
  assertEquals(res.filter((x) => x.saved === 12).length, 3);
  assertEquals(res.filter((x) => x.saved === 20).length, 1);
  assertEquals(res.filter((x) => x.saved === 36).length, 1);
  assertEquals(res.filter((x) => x.saved === 38).length, 1);
  assertEquals(res.filter((x) => x.saved === 40).length, 1);
  assertEquals(res.filter((x) => x.saved === 64).length, 1);
});
