/*
--- Day 12: Subterranean Sustainability ---
The year 518 is significantly more underground than your history books implied.
Either that, or you've arrived in a vast cavern network under the North Pole.

After exploring a little, you discover a long tunnel that contains a row of
small pots as far as you can see to your left and right. A few of them contain
plants - someone is trying to grow things in these geothermally-heated caves.

The pots are numbered, with 0 in front of you. To the left, the pots are
numbered -1, -2, -3, and so on; to the right, 1, 2, 3.... Your puzzle input
contains a list of pots from 0 to the right and whether they do (#) or do not
(.) currently contain a plant, the initial state. (No other pots currently
contain plants.) For example, an initial state of #..##.... indicates that pots
0, 3, and 4 currently contain plants.

Your puzzle input also contains some notes you find on a nearby table: someone
has been trying to figure out how these plants spread to nearby pots. Based on
the notes, for each generation of plants, a given pot has or does not have a
plant based on whether that pot (and the two pots on either side of it) had a
plant in the last generation. These are written as LLCRR => N, where L are pots
to the left, C is the current pot being considered, R are the pots to the
right, and N is whether the current pot will have a plant in the next
generation. For example:

A note like ..#.. => . means that a pot that contains a plant but with no
plants within two pots of it will not have a plant in it during the next
generation.
A note like ##.## => . means that an empty pot with two plants on each side of
it will remain empty in the next generation.
A note like .##.# => # means that a pot has a plant in a given generation if,
in the previous generation, there were plants in that pot, the one immediately
to the left, and the one two pots to the right, but not in the ones immediately
to the right and two to the left.
It's not clear what these plants are for, but you're sure it's important, so
you'd like to make sure the current configuration of plants is sustainable by
determining what will happen after 20 generations.

For example, given the following input:

initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #

For brevity, in this example, only the combinations which do produce a plant
are listed. (Your input includes all possible combinations.) Then, the next 20
generations will look like this:

                 1         2         3
       0         0         0         0
 0: ...#..#.#..##......###...###...........
 1: ...#...#....#.....#..#..#..#...........
 2: ...##..##...##....#..#..#..##..........
 3: ..#.#...#..#.#....#..#..#...#..........
 4: ...#.#..#...#.#...#..#..##..##.........
 5: ....#...##...#.#..#..#...#...#.........
 6: ....##.#.#....#...#..##..##..##........
 7: ...#..###.#...##..#...#...#...#........
 8: ...#....##.#.#.#..##..##..##..##.......
 9: ...##..#..#####....#...#...#...#.......
10: ..#.#..#...#.##....##..##..##..##......
11: ...#...##...#.#...#.#...#...#...#......
12: ...##.#.#....#.#...#.#..##..##..##.....
13: ..#..###.#....#.#...#....#...#...#.....
14: ..#....##.#....#.#..##...##..##..##....
15: ..##..#..#.#....#....#..#.#...#...#....
16: .#.#..#...#.#...##...#...#.#..##..##...
17: ..#...##...#.#.#.#...##...#....#...#...
18: ..##.#.#....#####.#.#.#...##...##..##..
19: .#..###.#..#.#.#######.#.#.#..#.#...#..
20: .#....##....#####...#######....#.#..##.

The generation is shown along the left, where 0 is the initial state. The pot
numbers are shown along the top, where 0 labels the center pot,
negative-numbered pots extend to the left, and positive pots extend toward the
right. Remember, the initial state begins at pot 0, which is not the leftmost
pot used in this example.

After one generation, only seven plants remain. The one in pot 0 matched the
rule looking for ..#.., the one in pot 4 matched the rule looking for .#.#.,
pot 9 matched .##.., and so on.

In this example, after 20 generations, the pots shown as # contain plants, the
furthest left of which is pot -2, and the furthest right of which is pot 34.
Adding up all the numbers of plant-containing pots after the 20th generation
produces 325.

After 20 generations, what is the sum of the numbers of all pots which contain a plant?

Your puzzle answer was 2281.

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---
You realize that 20 generations aren't enough. After all, these plants
will need to last another 1500 years to even reach your timeline, not to mention
your future.

After fifty billion (50000000000) generations, what is the sum of the numbers of
all pots which contain a plant?
 */

import fs from 'fs';

const provideTestInput = (): string[] => {
  return [
    'initial state: #..#.#..##......###...###',
    '',
    '...## => #',
    '..#.. => #',
    '.#... => #',
    '.#.#. => #',
    '.#.## => #',
    '.##.. => #',
    '.#### => #',
    '#.#.# => #',
    '#.### => #',
    '##.#. => #',
    '##.## => #',
    '###.. => #',
    '###.# => #',
    '####. => #'
  ];
};

const provideInput = (): string[] => {
  return fs
    .readFileSync('input/input12.txt', 'utf8')
    .trim()
    .split('\n');
};

const parseInitialState = (s: string): Set<number> => {
  const r: RegExp = /initial state: (.*)/;
  const initialState: Set<number> = new Set();
  const match: string[] = r.exec(s);
  if (match) {
    const initialStateString: string = match[1];
    let i: number;
    for (i = 0; i < initialStateString.length; i++) {
      if (initialStateString[i] === '#') {
        initialState.add(i);
      }
    }
  }
  return initialState;
};

const stateMinimum = (state: Set<number>): number => {
  let m: number = Number.MAX_SAFE_INTEGER;
  for (const n of state) {
    if (n < m) {
      m = n;
    }
  }
  return m;
};

const stateMaximum = (state: Set<number>): number => {
  let m: number = -Number.MAX_SAFE_INTEGER;
  for (const n of state) {
    if (n > m) {
      m = n;
    }
  }
  return m;
};

const stateString = (state: Set<number>, min: number, max: number): string => {
  const array: string[] = [];
  let n: number;
  for (n = min; n <= max; n++) {
    array.push(state.has(n) ? '#' : '.');
  }
  return array.join('');
};

const iterateState = (
  state: Set<number>,
  rules: Map<number, boolean>
): Set<number> => {
  const min: number = stateMinimum(state);
  const max: number = stateMaximum(state);
  const s: string = stateString(state, min - 5, max + 5);
  let n: number;
  const nextState: Set<number> = new Set();
  for (n = min - 3; n <= max + 3; n++) {
    const p = n - min + 3;
    if (rules.get(ruleToInt(s.substring(p, p + 5)))) {
      nextState.add(n);
    }
  }
  return nextState;
};

const ruleToInt = (ruleString: string): number => {
  let result: number = 0;
  let factor: number = 1;
  while (ruleString.length > 0) {
    result += factor * (ruleString[0] === '#' ? 1 : 0);
    factor *= 2;
    ruleString = ruleString.slice(1);
  }
  return result;
};

const parseRules = (ruleLines: string[]): Map<number, boolean> => {
  const rules: Map<number, boolean> = new Map();
  let i: number;
  for (i = 0; i < 32; i++) {
    rules.set(i, false);
  }
  for (const s of ruleLines) {
    const tokens: string[] = s.split(' => ');
    const n: number = ruleToInt(tokens[0]);
    const p: boolean = tokens[1] === '#' ? true : false;
    rules.set(n, p);
  }
  return rules;
};

const advent12 = {
  part1: (): number => {
    const input: string[] = provideInput();
    let state: Set<number> = parseInitialState(input[0]);
    const rules: Map<number, boolean> = parseRules(input.slice(2));
    const min: number = stateMinimum(state) - 20;
    const max: number = stateMaximum(state) + 20;
    let i: number;
    // console.log('0: ' + stateString(state, min, max));
    for (i = 1; i <= 20; i++) {
      state = iterateState(state, rules);
      // console.log('' + i + ': ' + stateString(state, min, max));
    }
    let sum: number = 0;
    for (const n of state) {
      sum += n;
    }
    return sum;
  },

  part2: (): number => {
    return 0;
  }
};

export default advent12;
