/*
--- Day 3: No Matter How You Slice It ---
The Elves managed to locate the chimney-squeeze prototype fabric for Santa's
suit (thanks to someone who helpfully wrote its box IDs on the wall of the
warehouse in the middle of the night). Unfortunately, anomalies are still
affecting them - nobody can even agree on how to cut the fabric.

The whole piece of fabric they're working on is a very large square - at least
1000 inches on each side.

Each Elf has made a claim about which area of fabric would be ideal for Santa's
suit. All claims have an ID and consist of a single rectangle with edges
parallel to the edges of the fabric. Each claim's rectangle is defined as
follows:

The number of inches between the left edge of the fabric and the left edge of the rectangle.
The number of inches between the top edge of the fabric and the top edge of the rectangle.
The width of the rectangle in inches.
The height of the rectangle in inches.
A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3
inches from the left edge, 2 inches from the top edge, 5 inches wide, and 4
inches tall. Visually, it claims the square inches of fabric represented by #
(and ignores the square inches of fabric represented by .) in the diagram
below:

...........
...........
...#####...
...#####...
...#####...
...#####...
...........
...........
...........
The problem is that many of the claims overlap, causing two or more claims to
cover part of the same areas. For example, consider the following claims:

#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
Visually, these claim the following areas:

........
...2222.
...2222.
.11XX22.
.11XX22.
.111133.
.111133.
........
The four square inches marked with X are claimed by both 1 and 2. (Claim 3,
while adjacent to the others, does not overlap either of them.)

If the Elves all proceed with their own plans, none of them will have enough
fabric. How many square inches of fabric are within two or more claims?

Your puzzle answer was 101469.

--- Part Two ---
Amidst the chaos, you notice that exactly one claim doesn't overlap by even a
single square inch of fabric with any other claim. If you can somehow draw
attention to it, maybe the Elves will be able to make Santa's suit after all!

For example, in the claims above, only claim 3 is intact after all claims are made.

What is the ID of the only claim that doesn't overlap?

Your puzzle answer was 1067.
 */
import fs from 'fs';

const provideSquares = (): Array<Map<string, number | string>> => {
  return fs
    .readFileSync('input/input03.txt', 'utf8')
    .trim()
    .split('\n')
    .map(s => {
      const regex = /#(\d*) @ (\d*),(\d*): (\d*)x(\d*)/;
      const result: Map<string, number | string> = new Map();
      const match: string[] = regex.exec(s);
      if (match) {
        result.set('index', match[1]);
        result.set('x', parseInt(match[2], 10));
        result.set('y', parseInt(match[3], 10));
        result.set('w', parseInt(match[4], 10));
        result.set('h', parseInt(match[5], 10));
      }
      return result;
    });
};

const key = (x: number, y: number): string => {
  return '' + x + '.' + y;
};

const addSquare = (
  map: Map<string, string[]>,
  x: number,
  y: number,
  index: string
) => {
  const value = map.get(key(x, y)) || [];
  value.push(index);
  map.set(key(x, y), value);
};

const addClaim = (map: Map<string, string[]>, sq: Map<string, any>) => {
  for (let x = sq.get('x'); x < sq.get('x') + sq.get('w'); x++) {
    for (let y = sq.get('y'); y < sq.get('y') + sq.get('h'); y++) {
      addSquare(map, x, y, sq.get('index'));
    }
  }
};

const deleteClaim = (map: Map<string, string[]>, sq: Map<string, any>) => {
  for (let x = sq.get('x'); x < sq.get('x') + sq.get('w'); x++) {
    for (let y = sq.get('y'); y < sq.get('y') + sq.get('h'); y++) {
      const k: string = key(x, y);
      if (map.has(k)) {
        map.delete(k);
      }
    }
  }
};

const createMap = (): Map<string, string[]> => {
  const squares: Array<Map<string, any>> = provideSquares();
  const map: Map<string, string[]> = new Map();
  for (const sq of squares) {
    addClaim(map, sq);
  }
  return map;
};

const advent03 = {
  part1: () => {
    const map: Map<string, string[]> = createMap();
    let count: number = 0;
    for (const k of map.keys()) {
      if (map.get(k).length > 1) {
        count++;
      }
    }
    return count;
  },

  part2: () => {
    const map: Map<string, string[]> = createMap();
    const squares: Array<Map<string, any>> = provideSquares();
    const indexesToDelete: Set<string> = new Set();
    for (const k of map.keys()) {
      if (map.get(k).length > 1) {
        for (const m of map.get(k)) {
          indexesToDelete.add(m);
        }
      }
    }
    for (const index of indexesToDelete) {
      const sq = squares[parseInt(index, 10) - 1];
      deleteClaim(map, sq);
    }
    for (const k of map.keys()) {
      if (map.get(k)) {
        return parseInt(map.get(k)[0], 10);
      }
    }
    return 0;
  }
};

export default advent03;
