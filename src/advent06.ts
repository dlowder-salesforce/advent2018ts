/*
--- Day 6: Chronal Coordinates ---
The device on your wrist beeps several times, and once again you feel like
you're falling.

"Situation critical," the device announces. "Destination indeterminate. Chronal
interference detected. Please specify new target coordinates."

The device then produces a list of coordinates (your puzzle input). Are they
places it thinks are safe or dangerous? It recommends you check manual page
729. The Elves did not give you a manual.

If they're dangerous, maybe you can minimize the danger by finding the
coordinate that gives the largest distance from the other points.

Using only the Manhattan distance, determine the area around each coordinate by
counting the number of integer X,Y locations that are closest to that
coordinate (and aren't tied in distance to any other coordinate).

Your goal is to find the size of the largest area that isn't infinite. For
example, consider the following list of coordinates:

1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
If we name these coordinates A through F, we can draw them on a grid, putting
0,0 at the top left:

..........
.A........
..........
........C.
...D......
.....E....
.B........
..........
..........
........F.
This view is partial - the actual grid extends infinitely in all directions.
Using the Manhattan distance, each location's closest coordinate can be
determined, shown here in lowercase:

aaaaa.cccc
aAaaa.cccc
aaaddecccc
aadddeccCc
..dDdeeccc
bb.deEeecc
bBb.eeee..
bbb.eeefff
bbb.eeffff
bbb.ffffFf
Locations shown as . are equally far from two or more coordinates, and so they
don't count as being closest to any.

In this example, the areas of coordinates A, B, C, and F are infinite - while
not shown here, their areas extend forever outside the visible grid. However,
the areas of coordinates D and E are finite: D is closest to 9 locations, and E
is closest to 17 (both including the coordinate's location itself). Therefore,
in this example, the size of the largest area is 17.

What is the size of the largest area that isn't infinite?

Your puzzle answer was 3882.

--- Part Two ---
On the other hand, if the coordinates are safe, maybe the best you can do is
try to find a region near as many coordinates as possible.

For example, suppose you want the sum of the Manhattan distance to all of the
coordinates to be less than 32. For each location, add up the distances to all
of the given coordinates; if the total of those distances is less than 32, that
location is within the desired region. Using the same coordinates as above, the
resulting region looks like this:

..........
.A........
..........
...###..C.
..#D###...
..###E#...
.B.###....
..........
..........
........F.
In particular, consider the highlighted location 4,3 located at the top middle
of the region. Its calculation is as follows, where abs() is the absolute value
function:

Distance to coordinate A: abs(4-1) + abs(3-1) =  5
Distance to coordinate B: abs(4-1) + abs(3-6) =  6
Distance to coordinate C: abs(4-8) + abs(3-3) =  4
Distance to coordinate D: abs(4-3) + abs(3-4) =  2
Distance to coordinate E: abs(4-5) + abs(3-5) =  3
Distance to coordinate F: abs(4-8) + abs(3-9) = 10
Total distance: 5 + 6 + 4 + 2 + 3 + 10 = 30
Because the total distance to all coordinates (30) is less than 32, the
location is within the region.

This region, which also includes coordinates D and E, has a total size of 16.

Your actual region will need to be much larger than this example, though,
instead including all locations with a total distance of less than 10000.

What is the size of the region containing all locations which have a total
distance to all given coordinates of less than 10000?
 */

import fs from 'fs';

class Point {
  public x: number;
  public y: number;
  public isEdge: boolean;
  public closestVertex: string | null;
  public distToClosestVertex: number;
  public surroundingArea: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.isEdge = false;
    this.closestVertex = null;
    this.distToClosestVertex = -1;
    this.surroundingArea = 0;
  }
}

const provideTestInput = (): string => {
  return '1, 1\n1, 6\n8, 3\n3, 4\n5, 5\n8, 9\n';
};

const provideInput = (): string => {
  return fs.readFileSync('input/input06.txt', 'utf8');
};

const key = (x: number, y: number): string => {
  return '' + x + '.' + y;
};

const generateVertices = (input: string): Map<string, Point> => {
  const vertices: Map<string, Point> = new Map();
  const rows: string[] = input.trim().split('\n');
  for (const s of rows) {
    const tokens = s.split(', ');
    const p = new Point();
    p.x = parseInt(tokens[0], 10);
    p.y = parseInt(tokens[1], 10);
    p.isEdge = false;
    p.closestVertex = key(p.x, p.y);
    p.distToClosestVertex = 0;
    vertices.set(key(p.x, p.y), p);
  }
  return vertices;
};

const dist = (p1: Point, p2: Point): number => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

const closestVertex = (p: Point, vertices: Map<string, Point>): string => {
  let found: string = '';
  let minDist: number = Number.MAX_SAFE_INTEGER;
  for (const k of vertices.keys()) {
    const d: number = dist(p, vertices.get(k));
    if (d < minDist) {
      found = k;
      minDist = d;
    }
  }
  return found;
};

const distToAllVertices = (p: Point, vertices: Map<string, Point>): number => {
  let d: number = 0;
  for (const k of vertices.keys()) {
    d = d + dist(p, vertices.get(k));
  }
  return d;
};

const generateMap = (vertices: Map<string, Point>): Map<string, Point> => {
  const map: Map<string, Point> = new Map();
  let x1: number = Number.MAX_SAFE_INTEGER;
  let x2: number = Number.MIN_SAFE_INTEGER;
  let y1: number = Number.MAX_SAFE_INTEGER;
  let y2: number = Number.MIN_SAFE_INTEGER;
  for (const k of vertices.keys()) {
    const p: Point = vertices.get(k);
    if (p.x < x1) {
      x1 = p.x;
    }
    if (p.x > x2) {
      x2 = p.x;
    }
    if (p.y < y1) {
      y1 = p.y;
    }
    if (p.y > y2) {
      y2 = p.y;
    }
  }
  x1 = x1 - 1;
  x2 = x2 + 1;
  y1 = y1 - 1;
  y2 = y2 + 1;
  let i: number;
  let j: number;
  for (i = x1; i < x2; i++) {
    for (j = y1; j < y2; j++) {
      const p: Point = new Point();
      p.x = i;
      p.y = j;
      p.isEdge = i === x1 || i === x2 || j === y1 || j === y2;
      p.closestVertex = closestVertex(p, vertices);
      p.distToClosestVertex = dist(p, vertices.get(p.closestVertex));
      map.set(key(i, j), p);
    }
  }
  return map;
};

const advent06 = {
  part1: (): number => {
    const vertices: Map<string, Point> = generateVertices(provideInput());
    const map: Map<string, Point> = generateMap(vertices);
    for (const k1 of vertices.keys()) {
      const p1: Point = vertices.get(k1);
      p1.surroundingArea = 0;
      for (const k2 of map.keys()) {
        const p2: Point = map.get(k2);
        if (p2.closestVertex === k1) {
          if (p2.isEdge) {
            p1.surroundingArea = Number.MIN_SAFE_INTEGER;
          } else {
            p1.surroundingArea = p1.surroundingArea + 1;
          }
        }
      }
    }
    let maxArea: number = Number.MIN_SAFE_INTEGER;
    for (const k of vertices.keys()) {
      if (vertices.get(k).surroundingArea > maxArea) {
        maxArea = vertices.get(k).surroundingArea;
      }
    }
    return maxArea;
  },

  part2: (): number => {
    const vertices: Map<string, Point> = generateVertices(provideInput());
    let i: number;
    let j: number;
    let total: number = 0;
    for (i = -100; i < 500; i++) {
      for (j = -100; j < 500; j++) {
        let p: Point = new Point();
        p.x = i;
        p.y = j;
        if (distToAllVertices(p, vertices) < 10000) {
          total = total + 1;
        }
      }
    }
    return total;
  }
};

export default advent06;
