import { assertEquals } from "@std/assert";
import { solvePart1, solvePart2 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 = `2333133121414131402`;
  assertEquals(solvePart1(exampleInput1), 1928);
});

Deno.test(function part2_example() {
  const exampleInput2 = `2333133121414131402`;
  assertEquals(solvePart2(exampleInput2), 2858);
});
