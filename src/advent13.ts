/*
--- Day 13: Mine Cart Madness ---
A crop of this size requires significant logistics to transport produce, soil,
fertilizer, and so on. The Elves are very busy pushing things around in carts
on some kind of rudimentary system of tracks they've come up with.

Seeing as how cart-and-track systems don't appear in recorded history for
another 1000 years, the Elves seem to be making this up as they go along. They
haven't even figured out how to avoid collisions yet.

You map out the tracks (your puzzle input) and see where you can help.

Tracks consist of straight paths (| and -), curves (/ and \), and intersections
(+). Curves connect exactly two perpendicular pieces of track; for example,
this is a closed loop:

/----\
|    |
|    |
\----/

Intersections occur when two perpendicular paths cross. At an intersection, a
cart is capable of turning left, turning right, or continuing straight. Here
are two loops connected by two intersections:

/-----\
|     |
|  /--+--\
|  |  |  |
\--+--/  |
   |     |
   \-----/

Several carts are also on the tracks. Carts always face either up (^), down
(v), left (<), or right (>). (On your initial map, the track under each cart is
a straight path matching the direction the cart is facing.)

Each time a cart has the option to turn (by arriving at any intersection), it
turns left the first time, goes straight the second time, turns right the third
time, and then repeats those directions starting again with left the fourth
time, straight the fifth time, and so on. This process is independent of the
particular intersection at which the cart has arrived - that is, the cart has
no per-intersection memory.

Carts all move at the same speed; they take turns moving a single step at a
time. They do this based on their current location: carts on the top row move
first (acting from left to right), then carts on the second row move (again
from left to right), then carts on the third row, and so on. Once each cart has
moved one step, the process repeats; each of these loops is called a tick.

For example, suppose there are two carts on a straight track:

|  |  |  |  |
v  |  |  |  |
|  v  v  |  |
|  |  |  v  X
|  |  ^  ^  |
^  ^  |  |  |
|  |  |  |  |

First, the top cart moves. It is facing down (v), so it moves down one square.
Second, the bottom cart moves. It is facing up (^), so it moves up one square.
Because all carts have moved, the first tick ends. Then, the process repeats,
starting with the first cart. The first cart moves down, then the second cart
moves up - right into the first cart, colliding with it! (The location of the
crash is marked with an X.) This ends the second and last tick.

Here is a longer example:

/->-\
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/

/-->\
|   |  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \->--/
  \------/

/---v
|   |  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-+>-/
  \------/

/---\
|   v  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-+->/
  \------/

/---\
|   |  /----\
| /->--+-\  |
| | |  | |  |
\-+-/  \-+--^
  \------/

/---\
|   |  /----\
| /-+>-+-\  |
| | |  | |  ^
\-+-/  \-+--/
  \------/

/---\
|   |  /----\
| /-+->+-\  ^
| | |  | |  |
\-+-/  \-+--/
  \------/

/---\
|   |  /----<
| /-+-->-\  |
| | |  | |  |
\-+-/  \-+--/
  \------/

/---\
|   |  /---<\
| /-+--+>\  |
| | |  | |  |
\-+-/  \-+--/
  \------/

/---\
|   |  /--<-\
| /-+--+-v  |
| | |  | |  |
\-+-/  \-+--/
  \------/

/---\
|   |  /-<--\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/

/---\
|   |  /<---\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-<--/
  \------/

/---\
|   |  v----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \<+--/
  \------/

/---\
|   |  /----\
| /-+--v-\  |
| | |  | |  |
\-+-/  ^-+--/
  \------/

/---\
|   |  /----\
| /-+--+-\  |
| | |  X |  |
\-+-/  \-+--/
  \------/

After following their respective paths for a while, the carts eventually crash.
To help prevent crashes, you'd like to know the location of the first crash.
Locations are given in X,Y coordinates, where the furthest left column is X=0
and the furthest top row is Y=0:

           111
 0123456789012
0/---\
1|   |  /----\
2| /-+--+-\  |
3| | |  X |  |
4\-+-/  \-+--/
5  \------/

In this example, the location of the first crash is 7,3.
*/

import fs from 'fs';

const provideInput = (): string[] => {
  return fs
    .readFileSync('input/input13.txt', 'utf8')
    .trim()
    .split('\n');
};

const provideTestInput = (): string[] => {
  return [
    '/->-\\',
    '|   |  /----\\',
    '| /-+--+-  |',
    '| | |  | v  |',
    '-+-/  -+--/',
    '------/'
  ];
};

enum Orientation {
  VERTICAL,
  HORIZONTAL,
  INTERSECTION,
  LEFT_CURVE,
  RIGHT_CURVE
}

enum Direction {
  UP,
  DOWN,
  RIGHT,
  LEFT
}

interface Cart {
  x: number;
  y: number;
  direction: Direction;
}

interface MapNode {
  x: number;
  y: number;
  orientation: Orientation;
}

const keyFromLoc = (x: number, y: number): string => {
  return '' + x + '.' + y;
};

const generateCarts = (input: string[]): Set<Cart> => {
  const result: Set<Cart> = new Set();
  let y: number = 0;
  let x: number = 0;
  for (const s of input) {
    for (x === 0; x < s.length; x++) {
      const c: string = s.charAt(x);
      switch (c) {
        case '^':
          result.add({ x, y, direction: Direction.UP });
          break;
        case 'V':
        case 'v':
          result.add({ x, y, direction: Direction.DOWN });
          break;
        case '>':
          result.add({ x, y, direction: Direction.RIGHT });
          break;
        case '<':
          result.add({ x, y, direction: Direction.LEFT });
          break;
        default:
          break;
      }
    }
    y++;
  }
  return result;
};

const generateMap = (
  input: string[],
  carts: Set<Cart>
): Map<string, Partial<MapNode>> => {
  const result: Map<string, Partial<MapNode>> = new Map();
  let y: number = 0;
  let x: number = 0;
  // First pass: get locations
  for (const s of input) {
    for (x === 0; x < s.length; x++) {
      if (s.charAt(x) !== ' ') {
        result.set(keyFromLoc(x, y), { x, y });
      }
    }
    y++;
  }
  // Second pass: look for track
  y = 0;
  for (const s of input) {
    for (x === 0; x < s.length; x++) {
      const c: string = s.charAt(x);
      const m: Partial<MapNode> = result.get(keyFromLoc(x, y));
      switch (c) {
        case '-':
          m.orientation = Orientation.HORIZONTAL;
          break;
        case '|':
          m.orientation = Orientation.VERTICAL;
          break;
        case '/':
          m.orientation = Orientation.LEFT_CURVE;
          break;
        case '\\':
          m.orientation = Orientation.RIGHT_CURVE;
          break;
        case '+':
          m.orientation = Orientation.INTERSECTION;
          break;
        default:
          break;
      }
    }
    y++;
  }
  // Go through carts and make sure track underneath is defined
  for (const c of carts) {
    switch (c.direction) {
      case Direction.UP:
      case Direction.DOWN:
        result.set(keyFromLoc(c.x, c.y), {
          orientation: Orientation.VERTICAL,
          x,
          y
        });
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
        result.set(keyFromLoc(c.x, c.y), {
          orientation: Orientation.HORIZONTAL,
          x,
          y
        });
        break;
    }
  }
  return result;
};

const advent13 = {
  part1: (): number => {
    return 0;
  },

  part2: (): number => {
    return 0;
  }
};

export default advent13;
