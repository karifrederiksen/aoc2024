import { assertEquals } from "@std/assert";
import { solvePart1 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 = `125 17`;
  assertEquals(solvePart1(exampleInput1), 55312);
});
