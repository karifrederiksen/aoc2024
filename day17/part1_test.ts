import { assertEquals } from "@std/assert";
import { solvePart1 } from "./part1.ts";

Deno.test(function part1_example_small1() {
  const exampleInput = `Register A: 0
Register B: 0
Register C: 9

Program: 2,6`;
  const [regs, _out] = solvePart1(exampleInput);
  assertEquals(regs.B, 1n);
});

Deno.test(function part1_example_small2() {
  const exampleInput = `Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4`;
  const [_regs, out] = solvePart1(exampleInput);
  assertEquals(out, "0,1,2");
});

Deno.test(function part1_example_small3() {
  const exampleInput = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;
  const [_regs, out] = solvePart1(exampleInput);
  assertEquals(out, "4,2,5,6,7,7,7,7,3,1,0");
});

Deno.test(function part1_example_small4() {
  const exampleInput = `Register A: 0
Register B: 29
Register C: 0

Program: 1,7`;
  const [regs, _out] = solvePart1(exampleInput);
  assertEquals(regs.B, 26n);
});

Deno.test(function part1_example_small5() {
  const exampleInput = `Register A: 0
Register B: 2024
Register C: 43690

Program: 4,0`;
  const [regs, _out] = solvePart1(exampleInput);
  assertEquals(regs.B, 44354n);
});

Deno.test(function part1_example() {
  const exampleInput = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;
  const [_regs, out] = solvePart1(exampleInput);
  assertEquals(out, "4,6,3,5,6,3,5,2,1,0");
});
