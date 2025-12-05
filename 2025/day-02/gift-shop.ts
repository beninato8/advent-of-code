// find ids made up of sequence digits repeated twice

import { readFileSync } from "fs";

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

// given input in a file, split into ranges, get actual numbers, and flatten
function parseFile(path: string): number[] {
  // expect input of 1-5,30-60,444-888
  const fileContent: string = readFileSync(path, "utf-8");
  const values = fileContent.split(",").flatMap((line) => {
    const [start, end] = line.split("-").map((num) => parseInt(num));
    // console.log(`${start}, ${end}`);
    const values = range(start, end);
    // console.log(values);
    return values;
  });
  return values;
}

function isRepeatedOnce(value: number): boolean {
  return /^(\d+)\1$/.test(value.toString());
}

function isRepeatedMultiple(value: number): boolean {
  return /^(\d+)\1+$/.test(value.toString());
}

function sumInvalid(ids: number[], isPart2 = false): number {
  let total = 0;
  for (const value of ids) {
    if (
      (!isPart2 && isRepeatedOnce(value)) ||
      (isPart2 && isRepeatedMultiple(value))
    ) {
      // console.log(`invalid: ${value}`);
      total += value;
    }
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
    ["example.txt", false, 1227775554],
    ["example.txt", true, 4174379265],
    ["input.txt", false, 53420042388],
    ["input.txt", true, undefined],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = parseFile(path);
    const result = sumInvalid(content, isPart2);
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
