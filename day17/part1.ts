import {} from "../util/index.ts";

export function solvePart1(text: string): [Registers, string] {
  const [regs, program] = parse(text);
  return [regs, run(regs, program).join(",")];
}

export function parse(text: string): [Registers, bigint[]] {
  const [registerText, programText] = text.split("\n\n");
  const registers = registerText.split("\n").map((s) => {
    const [_, key, value] = /^Register ([A-C]): (\d+)$/.exec(s)!;
    return { key, value: BigInt(value) };
  });
  const program = programText.substring("Program: ".length).split(",").map(
    BigInt,
  );

  const regs = {
    A: registers.find((x) => x.key === "A")!.value,
    B: registers.find((x) => x.key === "B")!.value,
    C: registers.find((x) => x.key === "C")!.value,
  };
  return [regs, program];
}

export type Registers = {
  A: bigint;
  B: bigint;
  C: bigint;
};

export function run(regs: Registers, program: readonly bigint[]): bigint[] {
  const output: bigint[] = [];
  let instrPtr = 0;

  let iCnt = 0;
  while (instrPtr < program.length) {
    if (iCnt++ > 10_000_000) {
      throw new Error("taking too long");
    }
    const instr = program[instrPtr++];
    const operand = program[instrPtr++];

    switch (instr) {
      case 0n:
        regs.A = regs.A / (2n ** comboOperandValue(regs, operand));
        break;
      case 1n:
        regs.B = regs.B ^ operand;
        break;
      case 2n:
        regs.B = comboOperandValue(regs, operand) % 8n;
        break;
      case 3n:
        if (regs.A !== 0n) {
          instrPtr = Number(operand);
        }
        break;
      case 4n:
        regs.B = regs.B ^ regs.C;
        break;
      case 5n:
        output.push(comboOperandValue(regs, operand) % 8n);
        break;
      case 6n:
        regs.B = regs.A / (2n ** comboOperandValue(regs, operand));
        break;
      case 7n:
        regs.C = regs.A / (2n ** comboOperandValue(regs, operand));
        break;
    }
  }
  return output;
}

export function comboOperandValue(
  registers: Readonly<Registers>,
  operand: bigint,
): bigint {
  switch (operand) {
    case 0n:
      return 0n;
    case 1n:
      return 1n;
    case 2n:
      return 2n;
    case 3n:
      return 3n;
    case 4n:
      return registers.A;
    case 5n:
      return registers.B;
    case 6n:
      return registers.C;
    default:
      throw new Error("invalid combo operand: " + operand);
  }
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}
