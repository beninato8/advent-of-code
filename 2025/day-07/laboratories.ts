// solve beam splits

import { readFileSync } from "fs";

type FileOutput = [number[][], number];

// given input in a file, get splitter locations
function parseFile(path: string): FileOutput {
  const fileContent: string = readFileSync(path, "utf-8");
  const sections = fileContent.split("\n");

  const startingLocation = sections[0].indexOf("S");

  const splitters: number[][] = [];
  const slice = sections.slice(1);
  for (let i = 0; i < slice.length - 1; i++) {
    let temp = [];
    for (let j = 0; j < slice[0].length; j++) {
      if (slice[i][j] == "^") {
        temp.push(j);
      }
    }
    splitters.push(temp);
  }

  return [splitters, startingLocation];
}

// if part1, we count n splits
function getTotal(splitters: number[][], starting: number): number {
  let splitCount = 0;
  let currentSplits = new Set([starting]);

  for (let i = 0; i < splitters.length; i++) {
    for (let j = 0; j < splitters[i].length; j++) {
      const splitVal = splitters[i][j];
      // console.log(splitVal, currentSplits);
      if (currentSplits.has(splitVal)) {
        let split1 = splitVal - 1;
        let split2 = splitVal + 1;
        currentSplits.delete(splitVal);
        if (split1 >= 0 && !currentSplits.has(split1)) {
          currentSplits.add(split1);
        }
        if (!currentSplits.has(split2)) {
          currentSplits.add(split2);
        }
        splitCount++;
      }
    }
  }
  return splitCount;
}

const cache = new Map();

// if part2 we count all possible splits
function getTotalPart2(splitters: number[][], starting: number): number {
  // console.log(splitters, starting);
  if (splitters.length == 0) {
    return 0;
  }

  if (starting < 0) {
    return 0;
  }

  const cacheKey = JSON.stringify([splitters, starting]);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (splitters[0].length == 0) {
    const result = getTotalPart2(splitters.slice(1), starting);
    cache.set(cacheKey, result);
    return result;
  }

  if (splitters[0].includes(starting)) {
    const result =
      1 +
      getTotalPart2(splitters.slice(1), starting - 1) +
      getTotalPart2(splitters.slice(1), starting + 1);
    cache.set(cacheKey, result);
    return result;
  }

  const result = getTotalPart2(splitters.slice(1), starting);
  cache.set(cacheKey, result);
  return result;
}

function main() {
  type TestData = [
    path: string,
    isPart2: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    ["example.txt", false, 21],
    ["input.txt", false, 1638],
    ["test.txt", true, 2],
    ["example.txt", true, 40],
    ["input.txt", true, 7759107121385],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = parseFile(path);
    const result = isPart2
      ? 1 + getTotalPart2(content[0], content[1])
      : getTotal(content[0], content[1]);
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
