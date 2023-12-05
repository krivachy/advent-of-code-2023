import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day03/input.txt");
    const part1 = _.sum(lines.map((line, y) => {
        var lineSum = 0;
        const chars = line.split('');
        for (var x = 0; x < chars.length; x++) {
            const char = chars[x];
            if (!isNumeric(char)) {
                continue;
            }
            const numberDigits: string[] = [];
            var shouldAdd = false;
            for (; x < chars.length; x++) {
                if (isNumeric(chars[x])) {
                    numberDigits.push(chars[x]);
                    shouldAdd = shouldAdd || surroundHasAPart(lines, x, y);
                } else {
                    break;
                }
            }
            if (shouldAdd) {
                lineSum += Number(numberDigits.join(''));
            }
        }
        return lineSum;
    }))
    console.log(`Part 1: ${part1}`);

    const gears: Map<string, number[]> = new Map();
    lines.forEach((line, y) => {
        const chars = line.split('');
        for (var x = 0; x < chars.length; x++) {
            const char = chars[x];
            if (!isNumeric(char)) {
                continue;
            }
            const numberDigits: string[] = [];
            const numberGears: Set<string> = new Set();
            for (; x < chars.length; x++) {
                if (isNumeric(chars[x])) {
                    numberDigits.push(chars[x]);
                    getSurroundingGears(lines, x, y).forEach(g => numberGears.add(g));
                } else {
                    break;
                }
            }
            const number = Number(numberDigits.join(''));
            numberGears.forEach(g => {
                if (!gears.has(g)) {
                    gears.set(g, []);
                }
                gears.get(g)?.push(number);
            })
        }
    });
    const part2 = _.sum(Array.from(gears).map(([gear, ratios]) => ratios.length === 2 ? ratios[0] * ratios[1] : 0));
    console.log(`Part 2: ${part2}`);
}

function surroundHasAPart(lines: string[], x: number, y: number): boolean {
    return isPart(getChar(lines, x - 1, y - 1)) ||
        isPart(getChar(lines, x - 1, y)) ||
        isPart(getChar(lines, x - 1, y + 1)) ||   
        isPart(getChar(lines, x, y + 1)) ||
        isPart(getChar(lines, x + 1, y + 1)) ||
        isPart(getChar(lines, x + 1, y)) ||
        isPart(getChar(lines, x + 1, y - 1)) ||
        isPart(getChar(lines, x, y - 1));
}

function getSurroundingGears(lines: string[], x: number, y: number): string[] {
    const gears: string[] = [];
    if(isPart(getChar(lines, x - 1, y - 1))) gears.push(gearCoordinates(x-1,y-1));
    if(isPart(getChar(lines, x - 1, y))) gears.push(gearCoordinates(x-1,y));
    if(isPart(getChar(lines, x - 1, y + 1))) gears.push(gearCoordinates(x-1,y+1));
    if(isPart(getChar(lines, x, y + 1))) gears.push(gearCoordinates(x,y+1));
    if(isPart(getChar(lines, x + 1, y + 1))) gears.push(gearCoordinates(x+1,y+1));
    if(isPart(getChar(lines, x + 1, y))) gears.push(gearCoordinates(x+1,y));
    if(isPart(getChar(lines, x + 1, y - 1))) gears.push(gearCoordinates(x+1,y-1));
    if(isPart(getChar(lines, x, y - 1))) gears.push(gearCoordinates(x,y-1));
    return gears;
}

function getChar(lines: string[], x: number, y: number): string | null {
    if (y >= lines.length || y < 0) {
        return null;
    }
    const line = lines[y];
    if (x >= line.length || x < 0) {
        return null;
    }
    return line.charAt(x);
}

const isNumeric = (val: string) : boolean => {
    return !isNaN(Number(val));
 }

 const isPart = (val: string | null): boolean => {
    return val !== null && !isNumeric(val) && val !== '.';
 }

 const isGear = (val: string | null): boolean => {
    return val !== null && val === '*';
 }
 
 const gearCoordinates = (x: number, y: number) => {
    return `x=${x};y=${y}`
 }

main().catch(err => {
    console.error(err);
})