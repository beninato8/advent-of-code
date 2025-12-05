// find max joltage from battery banks

import { readFileSync } from "fs";

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

// given input in a file, split into ranges, get actual numbers, and flatten
function parseFile(path: string): number[][] {
  // expect input of 123\n456\n369
  const fileContent: string = readFileSync(path, "utf-8");
  const values = fileContent.split("\n").map((bank) => {
    return bank.split("").map((value) => parseInt(value));
  });
  return values;
}

// get biggest value in array within a range
function getNthValue(
  bank: number[],
  startIdx: number,
  remainingDigits: number,
): number {
  let maxIndex = bank.length - remainingDigits;
  let maxValue = 0;
  for (let i = bank.length - remainingDigits; i >= startIdx; i--) {
    if (bank[i] > maxValue) {
      maxValue = bank[i];
      maxIndex = i;
    } else if (bank[i] == maxValue && i < maxIndex) {
      maxIndex = i;
    }
  }
  return maxIndex;
}

// get largest possible number from selection n values left to right
function getLargestFromBank(bank: number[], nDigits: number): number {
  let total = 0;
  let multiplier = Math.pow(10, nDigits - 1);
  let prevIdx = -1;
  for (let i = 0; i < nDigits; i++) {
    let idx = getNthValue(bank, prevIdx + 1, nDigits - i);
    total += multiplier * bank[idx];
    prevIdx = idx;
    multiplier /= 10;
  }
  return total;
}

function getTotal(banks: number[][], isPart2 = false): number {
  let total = 0;
  for (const bank of banks) {
    const result = getLargestFromBank(bank, isPart2 ? 12 : 2);
    // console.log(`got ${result} from ${bank}`);
    total += result;
  }
  return total;
}

function main() {
  type TestData = [
    path: string,
    isPart2: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    ["example.txt", false, 357],
    ["example.txt", true, 3121910778619],
    ["input.txt", false, 17166],
    ["input.txt", true, undefined],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = parseFile(path);
    const result = getTotal(content, isPart2);
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
