/*
 --- Day 4: Repose Record ---
You've sneaked into another supply closet - this time, it's across from the
prototype suit manufacturing lab. You need to sneak inside and fix the issues
with the suit, but there's a guard stationed outside the lab, so this is as
close as you can safely get.

As you search the closet for anything that might help, you discover that you're
not the first person to want to sneak in. Covering the walls, someone has spent
an hour starting every midnight for the past few months secretly observing this
guard post! They've been writing down the ID of the one guard on duty that
night - the Elves seem to have decided that one guard was enough for the
overnight shift - as well as when they fall asleep or wake up while at their
post (your puzzle input).

For example, consider the following records, which have already been organized
into chronological order:

[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
Timestamps are written using year-month-day hour:minute format. The guard
falling asleep or waking up is always the one whose shift most recently
started. Because all asleep/awake times are during the midnight hour (00:00 -
00:59), only the minute portion (00 - 59) is relevant for those events.

Visually, these records show that the guards are asleep at these times:

Date   ID   Minute
            000000000011111111112222222222333333333344444444445555555555
            012345678901234567890123456789012345678901234567890123456789
11-01  #10  .....####################.....#########################.....
11-02  #99  ........................................##########..........
11-03  #10  ........................#####...............................
11-04  #99  ....................................##########..............
11-05  #99  .............................................##########.....
The columns are Date, which shows the month-day portion of the relevant day;
ID, which shows the guard on duty that day; and Minute, which shows the minutes
during which the guard was asleep within the midnight hour. (The Minute
column's header shows the minute's ten's digit in the first row and the one's
digit in the second row.) Awake is shown as ., and asleep is shown as #.

Note that guards count as asleep on the minute they fall asleep, and they count
as awake on the minute they wake up. For example, because Guard #10 wakes up at
00:25 on 1518-11-01, minute 25 is marked as awake.

If you can figure out the guard most likely to be asleep at a specific time,
you might be able to trick that guard into working tonight so you can have the
best chance of sneaking in. You have two strategies for choosing the best
guard/minute combination.

Strategy 1: Find the guard that has the most minutes asleep. What minute does
that guard spend asleep the most?

In the example above, Guard #10 spent the most minutes asleep, a total of 50
minutes (20+25+5), while Guard #99 only slept for a total of 30 minutes
(10+10+10). Guard #10 was asleep most during minute 24 (on two days, whereas
any other minute the guard was asleep was only seen on one day).

While this example listed the entries in chronological order, your entries are
in the order you found them. You'll need to organize them before they can be
analyzed.

What is the ID of the guard you chose multiplied by the minute you chose? (In
the above example, the answer would be 10 * 24 = 240.)

Your puzzle answer was 87681.

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---
Strategy 2: Of all guards, which guard is most frequently asleep on the same
minute?

In the example above, Guard #99 spent minute 45 asleep more than any other
guard or minute - three times in total. (In all other cases, any guard spent
any minute asleep at most twice.)

What is the ID of the guard you chose multiplied by the minute you chose? (In
the above example, the answer would be 99 * 45 = 4455.)

Your puzzle answer was 136461.
 */

import fs from 'fs';

const provideTestEvents = (): string[] => {
  return [
    '[1518-11-01 00:00] Guard #10 begins shift',
    '[1518-11-01 00:05] falls asleep',
    '[1518-11-01 00:25] wakes up',
    '[1518-11-01 00:30] falls asleep',
    '[1518-11-01 00:55] wakes up',
    '[1518-11-01 23:58] Guard #99 begins shift',
    '[1518-11-02 00:40] falls asleep',
    '[1518-11-02 00:50] wakes up',
    '[1518-11-03 00:05] Guard #10 begins shift',
    '[1518-11-03 00:24] falls asleep',
    '[1518-11-03 00:29] wakes up',
    '[1518-11-04 00:02] Guard #99 begins shift',
    '[1518-11-04 00:36] falls asleep',
    '[1518-11-04 00:46] wakes up',
    '[1518-11-05 00:03] Guard #99 begins shift',
    '[1518-11-05 00:45] falls asleep',
    '[1518-11-05 00:55] wakes up'
  ];
};

const provideEvents = (): string[] => {
  const rawEvents: string[] = fs
    .readFileSync('input/input04.txt', 'utf8')
    .trim()
    .split('\n');
  return rawEvents;
};

const processEvents = (rawEvents: string[]): any[] => {
  rawEvents.sort();
  const events: any[] = rawEvents.map(s => {
    const event: any = {};
    const regex = /\[(\d*)-(\d*)-(\d*) (\d*):(\d*)\] (.*)/;
    const match: string[] = regex.exec(s);
    if (match) {
      event.year = parseInt(match[1], 10);
      event.month = parseInt(match[2], 10);
      event.day = parseInt(match[3], 10);
      event.hour = parseInt(match[4], 10);
      event.minute = parseInt(match[5], 10);
      event.description = match[6];
    }
    return event;
  });

  return events;
};

const mostSleepyGuard = (events: any): any => {
  const map: any = {};
  let currentGuard: string = '';
  let sleepStartTime = -1;
  let minutesAsleep = 0;
  for (const event of events) {
    const tokens: string[] = event.description.split(' ');
    if (tokens[0] === 'Guard') {
      currentGuard = tokens[1];
    } else if (tokens[1] === 'asleep') {
      sleepStartTime = event.minute;
    } else if (tokens[0] === 'wakes') {
      minutesAsleep = event.minute - sleepStartTime;
      map[currentGuard] = (map[currentGuard] || 0) + minutesAsleep;
    }
  }
  let guardMax: string = '';
  let max: number = -1;
  for (const guard in map) {
    if (map[guard] > max) {
      guardMax = guard;
      max = map[guard];
    }
  }
  return {
    guard: guardMax,
    max
  };
};

const mostCommonMinute = (events: any, guard: string): any => {
  const minuteArray: number[] = [];
  let i: number = 0;
  for (i = 0; i < 60; i++) {
    minuteArray.push(0);
  }
  let currentGuard: string = '';
  let sleepStartTime = -1;
  for (const event of events) {
    const tokens: string[] = event.description.split(' ');
    if (tokens[0] === 'Guard') {
      currentGuard = tokens[1];
    } else if (tokens[1] === 'asleep') {
      sleepStartTime = event.minute;
    } else if (tokens[0] === 'wakes') {
      if (guard === currentGuard) {
        let j: number = sleepStartTime;
        for (j = sleepStartTime; j < event.minute; j++) {
          minuteArray[j] = minuteArray[j] + 1;
        }
      }
    }
  }
  let minute: number = -1;
  let max: number = -1;
  for (i = 0; i < 60; i++) {
    if (minuteArray[i] > max) {
      minute = i;
      max = minuteArray[i];
    }
  }
  return { minute, max };
};

const advent04 = {
  part1: (): number => {
    const events = processEvents(provideEvents());
    const guardAndMax: any = mostSleepyGuard(events);
    const maxMinute: number = mostCommonMinute(events, guardAndMax.guard)
      .minute;
    return parseInt(guardAndMax.guard.slice(1), 10) * maxMinute;
  },

  part2: (): number => {
    const guards: Set<string> = new Set();
    const events = processEvents(provideEvents());
    for (const event of events) {
      const tokens: string[] = event.description.split(' ');
      if (tokens[0] === 'Guard') {
        guards.add(tokens[1]);
      }
    }
    let guardSleepingSameMinute: string = '';
    let minuteAndMax: any = { minute: -1, max: -1 };
    for (const guard of guards) {
      const m = mostCommonMinute(events, guard);
      if (m.max > minuteAndMax.max) {
        guardSleepingSameMinute = guard;
        minuteAndMax = m;
      }
    }

    return parseInt(guardSleepingSameMinute.slice(1), 10) * minuteAndMax.minute;
  }
};

export default advent04;
