/*
--- Day 10: The Stars Align ---
It's no use; your navigation system simply isn't capable of providing walking
directions in the arctic circle, and certainly not in 1018.

The Elves suggest an alternative. In times like these, North Pole rescue
operations will arrange points of light in the sky to guide missing Elves back
to base. Unfortunately, the message is easy to miss: the points move slowly
enough that it takes hours to align them, but have so much momentum that they
only stay aligned for a second. If you blink at the wrong time, it might be
hours before another message appears.

You can see these points of light floating in the distance, and record their
position in the sky and their velocity, the relative change in position per
second (your puzzle input). The coordinates are all given from your
perspective; given enough time, those positions and velocities will move the
points into a cohesive message!

Rather than wait, you decide to fast-forward the process and calculate what the
points will eventually spell.

For example, suppose you note the following points:

position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>

Each line represents one point. Positions are given as <X, Y> pairs: X
represents how far left (negative) or right (positive) the point appears, while
Y represents how far up (negative) or down (positive) the point appears.

At 0 seconds, each point has the position given. Each second, each point's
velocity is added to its position. So, a point with velocity <1, -2> is moving
to the right, but is moving upward twice as quickly. If this point's initial
position were <3, 9>, after 3 seconds, its position would become <6, 3>.

Over time, the points listed above would move like this:

Initially:
........#.............
................#.....
.........#.#..#.......
......................
#..........#.#.......#
...............#......
....#.................
..#.#....#............
.......#..............
......#...............
...#...#.#...#........
....#..#..#.........#.
.......#..............
...........#..#.......
#...........#.........
...#.......#..........

After 1 second:
......................
......................
..........#....#......
........#.....#.......
..#.........#......#..
......................
......#...............
....##.........#......
......#.#.............
.....##.##..#.........
........#.#...........
........#...#.....#...
..#...........#.......
....#.....#.#.........
......................
......................

After 2 seconds:
......................
......................
......................
..............#.......
....#..#...####..#....
......................
........#....#........
......#.#.............
.......#...#..........
.......#..#..#.#......
....#....#.#..........
.....#...#...##.#.....
........#.............
......................
......................
......................

After 3 seconds:
......................
......................
......................
......................
......#...#..###......
......#...#...#.......
......#...#...#.......
......#####...#.......
......#...#...#.......
......#...#...#.......
......#...#...#.......
......#...#..###......
......................
......................
......................
......................

After 4 seconds:
......................
......................
......................
............#.........
........##...#.#......
......#.....#..#......
.....#..##.##.#.......
.......##.#....#......
...........#....#.....
..............#.......
....#......#...#......
.....#.....##.........
...............#......
...............#......
......................
......................

After 3 seconds, the message appeared briefly: HI. Of course, your message will
be much longer and will take many more seconds to appear.

What message will eventually appear in the sky?

Your puzzle answer was PLBPGFRR.

--- Part Two ---
Good thing you didn't have to wait, because that would have taken a long
time - much longer than the 3 seconds in the example above.

Impressed by your sub-hour communication capabilities, the Elves are curious:
exactly how many seconds would they have needed to wait for that message
to appear?

Your puzzle answer was 10519.
 */

import fs from 'fs';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface State {
  iteration: number;
  area: number;
  grid: string;
  particles: Particle[];
}

const provideInput = (): State => {
  const regex: RegExp = /position=<(.*),(.*)> velocity=<(.*),(.*)>/;
  const particles: Particle[] = fs
    .readFileSync('input/input10.txt', 'utf8')
    .trim()
    .split('\n')
    .map(s => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0 };
      const match: string[] = regex.exec(s);
      if (match) {
        p.x = parseInt(match[1], 10);
        p.y = parseInt(match[2], 10);
        p.vx = parseInt(match[3], 10);
        p.vy = parseInt(match[4], 10);
      }
      return p;
    });
  return {
    area: area(particles),
    grid: '',
    iteration: 0,
    particles
  };
};

const limits = (particles: Particle[]): number[] => {
  const xmin: number =
    particles
      .map(p => p.x)
      .reduce((a, b) => (a < b ? a : b), Number.MAX_SAFE_INTEGER) - 2;
  const xmax: number =
    particles
      .map(p => p.x)
      .reduce((a, b) => (a > b ? a : b), -Number.MAX_SAFE_INTEGER) + 2;
  const ymin: number =
    particles
      .map(p => p.y)
      .reduce((a, b) => (a < b ? a : b), Number.MAX_SAFE_INTEGER) - 2;
  const ymax: number =
    particles
      .map(p => p.y)
      .reduce((a, b) => (a > b ? a : b), -Number.MAX_SAFE_INTEGER) + 2;
  return [xmin, ymin, xmax, ymax];
};

const area = (particles: Particle[]): number => {
  const [xmin, ymin, xmax, ymax]: number[] = limits(particles);
  return (xmax - xmin) * (ymax - ymin);
};

const iterate = (state: State) => {
  for (const p of state.particles) {
    p.x += p.vx;
    p.y += p.vy;
  }
  state.area = area(state.particles);
  state.grid = gridToString(state);
  state.iteration = state.iteration + 1;
};

const gridToString = (state: State): string => {
  let result = '';
  if (state.area < 250000) {
    const [xmin, ymin, xmax, ymax]: number[] = limits(state.particles);
    const grid: string[] = [];
    let i: number;
    let j: number;
    for (j = 0; j < ymax - ymin; j++) {
      for (i = 0; i < xmax - xmin; i++) {
        grid.push('.');
      }
    }
    for (const p of state.particles) {
      const x: number = p.x - xmin;
      const y: number = p.y - ymin;
      grid[y * (xmax - xmin) + x] = '*';
    }
    for (j = 0; j <= ymax - ymin; j++) {
      result =
        result +
        grid.slice(j * (xmax - xmin), (j + 1) * (xmax - xmin)).join('') +
        '\n';
    }
  }
  return result;
};

const solve = (): State => {
  const state: State = provideInput();
  let i: number;
  let minArea: number = Number.MAX_SAFE_INTEGER;
  let targetIteration: number = 0;
  let targetGrid: string = '';
  for (i = 0; i < 20000; i++) {
    iterate(state);
    if (state.area < minArea) {
      targetIteration = state.iteration;
      targetGrid = state.grid;
      minArea = state.area;
    }
  }
  return {
    area: minArea,
    grid: targetGrid,
    iteration: targetIteration,
    particles: []
  };
};

const advent10 = {
  part1: (): string => {
    return solve().grid;
  },

  part2: (): number => {
    return solve().iteration;
  }
};

export default advent10;
