// count the number of times the dial is left pointing at 0 after any rotation in the sequence

import { readFileSync } from "fs";

function parseFile(path: string): number[] {
  const fileContent: string = readFileSync(path, "utf-8");
  const values = fileContent
    .replaceAll("R", "+")
    .replaceAll("L", "-")
    .split("\n")
    .map((line) => parseInt(line));
  return values;
}

type DivModResult = [number, number];

function divmod(value: number, divisor: number): DivModResult {
  const div = Math.floor(value / divisor);
  const mod = value % divisor;
  return [div, mod];
}

// if trackAllZeros is true, also count zeros that we go past, not just ones we land on
function countZeros(rotations: number[], trackAllZeros = false): number {
  let zeroCount = 0;
  let total = 50;
  for (let rotation of rotations) {
    let negativeMultiplier = rotation < 0 ? -1 : 1;
    const [zeros, remainder] = divmod(Math.abs(rotation), 100);
    // console.log(`${zeros} ${remainder}`);

    if (trackAllZeros) {
      console.log(`zeroCount += ${zeros}`);
      zeroCount += zeros;
    }

    total += negativeMultiplier * remainder;
    while (total > 99) {
      total -= 100;
      if (trackAllZeros) {
        console.log("zeroCount++ (total > 99)");
        zeroCount++;
      }
    }
    while (total < 0) {
      total += 100;
      if (trackAllZeros) {
        console.log("zeroCount++ (total < 0)");
        zeroCount++;
      }
    }
    if (total == 0 && !trackAllZeros) {
      console.log("zeroCount++ (total == 0)");
      zeroCount++;
    }
    console.log(`${rotation} rotates to ${total}`);
  }
  return zeroCount;
}

function main() {
  type TestData = [
    path: string,
    trackAllZeros: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    ["example.txt", false, 3],
    ["example.txt", true, 6],
    ["input.txt", false, 999],
    ["input.txt", true, 6099],
  ];

  for (const [path, trackAllZeros, expected] of tests) {
    const content = parseFile(path);
    const result = countZeros(content, trackAllZeros);
    if (expected != undefined) {
      if (result != expected) {
        console.log(`error: ${result} != ${expected}`);
        return;
      }
    }
    console.log(result);
  }
}

main();
