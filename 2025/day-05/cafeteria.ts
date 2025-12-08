// find available ingredients

import { readFileSync } from "fs";

type FileInput = [number[][], number[]];

// given input in a file, split into ranges, get actual numbers, and flatten
function parseFile(path: string): FileInput {
  // expect input of 1-5,30-60,444-888
  const fileContent: string = readFileSync(path, "utf-8");
  const sections = fileContent
    .split("\n\n")
    .map((section) => section.split("\n"));
  const ranges = sections[0].map((line) =>
    line.split("-").map((num) => parseInt(num)),
  );
  const ingredients = sections[1].map((id) => parseInt(id));

  return [ranges, ingredients];
}

// merge overlapping ranges
function mergeRanges(ranges: number[][]): number[][] {
  const newRanges: number[][] = [];
  // sort by starting value
  ranges = ranges.sort((a, b) => a[0] - b[0]) 
  for (let i = 0; i < ranges.length; i++) {
    let range = ranges[i];
    if (newRanges.length == 0) {
      newRanges.push(range)
    } else {
      let prevRange = newRanges[newRanges.length - 1]
      let [prevStart, prevEnd] = prevRange;
      let [start, end] = range;
      if (start <= prevEnd) {
        newRanges[newRanges.length - 1][1] = Math.max(prevEnd, end)
      } else {
        newRanges.push(range)
      }
    }
  }
  return newRanges;
}

function isInRange(ranges:number[][], value: number): boolean {
  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i]
    if (value >= start && value <= end) {
      return true;
    }
  }
  return false;
}

// if part 1, we want count of fresh ingredients
// if part 2, we want all possible fresh ingredients in range
function getTotal(
  ranges: number[][],
  ingredients: number[],
  isPart2 = false,
): number {
  console.log(ranges)
  ranges = mergeRanges(ranges);
  console.log(ranges)
  if (!isPart2) {
    const freshIngredients = ingredients.filter((value) => isInRange(ranges, value))

    return freshIngredients.length
  } else {
    let result = 0;
    for (let i = 0; i < ranges.length; i++) {
      const [start, end] = ranges[i]
      result += end - start + 1
    }
    return result
  }

}

function main() {
  type TestData = [
    path: string,
    isPart2: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    ["example.txt", false, 3],
    ["input.txt", false, 529],
    ["example.txt", true, 14],
    ["input.txt", true, 344260049617193],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = parseFile(path);
    const result = getTotal(content[0], content[1], isPart2);
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
