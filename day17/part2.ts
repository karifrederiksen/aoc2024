import { parse, run } from "./part1.ts";

export function solvePart2(text: string): bigint {
  const [regs, program] = parse(text);

  let a = regs.A;
  while (true) {
    const out = run({ ...regs, A: a }, program);
    const outputEqualsProgramEnd = program.slice(program.length - out.length)
      .every((v, i) => v === out[i]);
    if (outputEqualsProgramEnd) {
      if (out.length === program.length) {
        return a;
      }
      a *= 8n;
    } else {
      a += 1n;
    }
  }
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}
