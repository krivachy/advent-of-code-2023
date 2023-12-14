import { loadInput } from "../util/file";
import * as _ from 'lodash';

const cacheKey = (map: string[][]): string => map.map(r => r.join('')).join('|');

async function main() {
    const lines = loadInput("./day14/input.txt");
    // Part 1:
    const part1 = calculateLoad(tiltNorth(lines.map(l => l.split(''))));
    console.log(`Part 1: ${part1} === 106997`);

    // Part 2:
    let part2Map = lines.map(l => l.split(''));
    const seenMaps: Map<string, number> = new Map();
    let currentCycle = 0;
    while (currentCycle < 1000000000 && !seenMaps.has(cacheKey(part2Map))) {
        seenMaps.set(cacheKey(part2Map), currentCycle);
        part2Map = allDirectionsTilt(part2Map);
        currentCycle++;
    }

    let startOfCycle = seenMaps.get(cacheKey(part2Map))!;
    let remainingCycles = (1000000000 - startOfCycle) % (currentCycle - startOfCycle);

    for (let j = 0; j < remainingCycles; j++) {
        part2Map = allDirectionsTilt(part2Map);
      }

    const part2 = calculateLoad(part2Map);
    console.log(`Part 2: ${part2} === 99641`);
}

function allDirectionsTilt(mapIn: string[][]): string[][] {
    let map = mapIn;
    for (let i = 0; i < 4; i++) map = rotateMap(tiltNorth(map));
    return map;
}

function tiltNorth(mapIn: string[][]): string[][] {
    let map = _.cloneDeep(mapIn);
    for (let y = 1; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'O') {
                let i = y - 1;
                // Go until edge or only ground
                while (i > 0 && map[i][x] === '.') i--;
                map[y][x] = '.';
                if (map[i][x] === '.') map[i][x] = 'O';
                else map[i + 1][x] = 'O';
            }
        }
    }
    return map;
}

function rotateMap(map: string[][]): string[][] {
    const width = map.length;
    const height = map[0].length;
    let newMap = new Array(height);
  
    for (let y = 0; y < height; y++) {
      newMap[y] = new Array(width);
  
      for (let x = 0; x < width; x++) {
        newMap[y][x] = map[width - 1 - x][y];
      }
    }
  
    return newMap;
}

function calculateLoad(map: string[][]): number {
    return _.sum(map.map((row, i) => row.filter(x => x === 'O').length * (map.length - i)));
}

main().catch(err => {
    console.error(err);
})