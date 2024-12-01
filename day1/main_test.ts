import { assertEquals } from "@std/assert";
import { solvePart1, solvePart2 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 = `3   4
4   3
2   5
1   3
3   9
3   3`;
  assertEquals(solvePart1(exampleInput1), 11);
});

Deno.test(function part2_example() {
  const exampleInput2 = `3   4
4   3
2   5
1   3
3   9
3   3`;
  assertEquals(solvePart2(exampleInput2), 31);
});
