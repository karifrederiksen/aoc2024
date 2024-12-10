import { assertEquals } from "@std/assert";
import { solvePart1, solvePart2 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
  assertEquals(solvePart1(exampleInput1), 36);
});

Deno.test(function part2_example() {
  const exampleInput2 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
  assertEquals(solvePart2(exampleInput2), 81);
});
