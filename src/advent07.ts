/*
--- Day 7: The Sum of Its Parts ---
You find yourself standing on a snow-covered coastline; apparently, you landed
a little off course. The region is too hilly to see the North Pole from here,
but you do spot some Elves that seem to be trying to unpack something that
washed ashore. It's quite cold out, so you decide to risk creating a paradox by
asking them for directions.

"Oh, are you the search party?" Somehow, you can understand whatever Elves from
the year 1018 speak; you assume it's Ancient Nordic Elvish. Could the device on
your wrist also be a translator? "Those clothes don't look very warm; take
this." They hand you a heavy coat.

"We do need to find our way back to the North Pole, but we have higher
priorities at the moment. You see, believe it or not, this box contains
something that will solve all of Santa's transportation problems - at least,
that's what it looks like from the pictures in the instructions." It doesn't
seem like they can read whatever language it's in, but you can: "Sleigh kit.
Some assembly required."

"'Sleigh'? What a wonderful name! You must help us assemble this 'sleigh' at
once!" They start excitedly pulling more parts out of the box.

The instructions specify a series of steps and requirements about which steps
must be finished before others can begin (your puzzle input). Each step is
designated by a single letter. For example, suppose you have the following
instructions:

Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
Visually, these requirements look like this:

  -->A--->B--
 /    \      \
C      -->D----->E
 \           /
  ---->F-----
Your first goal is to determine the order in which the steps should be
completed. If more than one step is ready, choose the step which is first
alphabetically. In this example, the steps would be completed as follows:

Only C is available, and so it is done first.
Next, both A and F are available. A is first alphabetically, so it is done next.
Then, even though F was available earlier, steps B and D are now also
available, and B is the first alphabetically of the three.
After that, only D and F are available. E is not available because only some of
its prerequisites are complete. Therefore, D is completed next.
F is the only choice, so it is done next.
Finally, E is completed.
So, in this example, the correct order is CABDFE.

In what order should the steps in your instructions be completed?

--- Part Two ---
As you're about to begin construction, four of the Elves offer to help. "The
sun will set soon; it'll go faster if we work together." Now, you need to
account for multiple people working on steps simultaneously. If multiple steps
are available, workers should still begin them in alphabetical order.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1,
B=2, C=3, and so on. So, step A takes 60+1=61 seconds, while step Z takes
60+26=86 seconds. No time is required between steps.

To simplify things for the example, however, suppose you only have help from
one Elf (a total of two workers) and that each step takes 60 fewer seconds (so
that step A takes 1 second and step Z takes 26 seconds). Then, using the same
instructions as above, this is how each second would be spent:

Second   Worker 1   Worker 2   Done
   0        C          .
   1        C          .
   2        C          .
   3        A          F       C
   4        B          F       CA
   5        B          F       CA
   6        D          F       CAB
   7        D          F       CAB
   8        D          F       CAB
   9        D          .       CABF
  10        E          .       CABFD
  11        E          .       CABFD
  12        E          .       CABFD
  13        E          .       CABFD
  14        E          .       CABFD
  15        .          .       CABFDE

Each row represents one second of time. The Second column identifies how many
seconds have passed as of the beginning of that second. Each worker column
shows the step that worker is currently doing (or . if they are idle). The Done
column shows completed steps.

Note that the order of the steps has changed; this is because steps now take
time to finish and multiple workers can begin multiple steps simultaneously.

In this example, it would take 15 seconds for two workers to complete these steps.

With 5 workers and the 60+ second step durations described above, how long will
it take to complete all of the steps?

Your puzzle answer was 946.
 */

import fs from 'fs';

class Vertex {
  public value: string;
  public previous: Set<string>;
  public next: Set<string>;

  constructor(value: string) {
    this.value = value;
    this.previous = new Set();
    this.next = new Set();
  }
}

const provideInput = (): string[][] => {
  return fs
    .readFileSync('input/input07.txt', 'utf8')
    .trim()
    .split('\n')
    .map(s => {
      const tokens: string[] = s.split(' ');
      return [tokens[1], tokens[7]];
    });
};

const provideTestInput = (): string[][] => {
  return [
    ['C', 'A'],
    ['C', 'F'],
    ['A', 'B'],
    ['A', 'D'],
    ['B', 'E'],
    ['D', 'E'],
    ['F', 'E']
  ];
};

const buildGraph = (input: string[][]): Map<string, Vertex> => {
  const values: Set<string> = new Set();
  const map: Map<string, Vertex> = new Map();
  const vertices: Set<Vertex> = new Set();
  for (const pair of input) {
    values.add(pair[0]);
    values.add(pair[1]);
  }
  for (const v of values) {
    map.set(v, new Vertex(v));
  }
  for (const pair of input) {
    const first: string = pair[0];
    const second: string = pair[1];
    map.get(first).next.add(second);
    map.get(second).previous.add(first);
  }
  return map;
};

const findFirstSteps = (graph: Map<string, Vertex>): string[] => {
  const result: string[] = [];
  for (const k of graph.keys()) {
    if (graph.get(k).previous.size === 0) {
      result.push(k);
    }
  }
  result.sort();
  return result;
};

const removeStep = (graph: Map<string, Vertex>, step: string) => {
  for (const k of graph.keys()) {
    if (graph.get(k).next.has(step)) {
      graph.get(k).next.delete(step);
    }
    if (graph.get(k).previous.has(step)) {
      graph.get(k).previous.delete(step);
    }
  }
  graph.delete(step);
};

const numberOfWorkers: number = 5; // = 2 for test input

const stepTime = (step: string): number => {
  return step.charCodeAt(0) - 4; // A = 61, B = 62, etc.
  // For test input, change 4 to 64 so that A = 1, B = 2,
};

const advent07 = {
  part1: (): string => {
    const input: string[][] = provideInput();
    const graph: Map<string, Vertex> = buildGraph(input);
    let readySteps: string[] = findFirstSteps(graph);
    let result: string = '';
    while (readySteps.length > 0) {
      const nextStep: string = readySteps.shift();
      removeStep(graph, nextStep);
      result = result.concat(nextStep);
      readySteps = findFirstSteps(graph);
    }
    return result;
  },

  part2: (): number => {
    const input: string[][] = provideInput();
    const graph: Map<string, Vertex> = buildGraph(input);
    let readySteps: string[] = findFirstSteps(graph);
    const processingSteps: Map<string, number> = new Map();
    for (const step of readySteps) {
      if (processingSteps.size < numberOfWorkers) {
        processingSteps.set(step, stepTime(step));
      }
    }
    let totalTime: number = 0;
    while (graph.size > 0 || processingSteps.size > 0) {
      let stepsToDelete: string[] = [];
      for (const step of processingSteps.keys()) {
        const time: number = processingSteps.get(step);
        if (time === 1) {
          stepsToDelete.push(step);
        } else {
          processingSteps.set(step, time - 1);
        }
      }
      if (stepsToDelete.length > 0) {
        for (const step of stepsToDelete) {
          processingSteps.delete(step);
          removeStep(graph, step);
        }
        stepsToDelete = [];
        readySteps = findFirstSteps(graph);
        for (const step of readySteps) {
          if (
            !processingSteps.has(step) &&
            processingSteps.size < numberOfWorkers
          ) {
            processingSteps.set(step, stepTime(step));
          }
        }
      }
      totalTime++;
    }

    return totalTime;
  }
};

export default advent07;
