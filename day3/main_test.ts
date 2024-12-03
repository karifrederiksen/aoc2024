import { assertEquals } from "@std/assert";
import { solvePart1, solvePart2 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 =
    `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
  assertEquals(solvePart1(exampleInput1), 161);
});

Deno.test(function part2_example() {
  const exampleInput2 =
    `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
  assertEquals(solvePart2(exampleInput2), 48);
});
