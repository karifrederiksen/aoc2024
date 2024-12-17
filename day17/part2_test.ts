import { assertEquals } from "@std/assert";
import { solvePart2 } from "./part2.ts";

Deno.test(function part2_example() {
  const exampleInput = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;
  assertEquals(solvePart2(exampleInput), 117440n);
});
