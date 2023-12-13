import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day13/input.txt");
    const patterns: string[][] = lines.join('\n').split('\n\n').map(p => p.split('\n'));
    const part1 = _.sum(patterns.map(p => {
        const rowReflection = findReflection(p);
        const columnReflection = findReflection(transpose(p));
        return calculateScore(rowReflection, columnReflection);
    }));
    console.log(`Part 1: ${part1}`);

    const part2 = _.sum(patterns.map(p => {
        const originalRowReflection = findReflection(p);
        const originalColumnReflection = findReflection(transpose(p));
        const patternString = p.join('\n');
        for (let i = 0; i < patternString.length; i++) {
            if (patternString[i] === '\n') continue;
            const fixedPattern = fixSmudge(patternString, i);
            let newRowReflection = findReflection(fixedPattern.split('\n'));
            if (newRowReflection === originalRowReflection) newRowReflection = null;
            let newColumnReflection = findReflection(transpose(fixedPattern.split('\n')));
            if (newColumnReflection === originalColumnReflection) newColumnReflection = null;
            if (newRowReflection || newColumnReflection) {
                return calculateScore(newRowReflection, newColumnReflection);
            }
        }
        
    }));
    console.log(`Part 2: ${part2}`);
}

function findReflection(lines: string[]): number | null {
    for (let i = 1; i < lines.length; i++) {
        const reflectingRow = Math.min(i, lines.length - i);
        const before = _.reverse(lines.slice(i - reflectingRow, i)).join('|');
        const after = lines.slice(i, i + reflectingRow).join('|');
        if (before === after) {
            return i;
        }
    }
    return null;
}

function calculateScore(row: number | null, col: number | null) {
    return (row ?? 0) * 100 + (col ?? 0);
}

function transpose(lines: string[]): string[] {
    return lines[0].split('').map((c, i) => lines.map((r) => r[i])).map(c => c.join(''));
}

function fixSmudge(pattern: string, i: number): string {
    const split = pattern.split('');
    split[i] = split[i] === '#' ? '.' : '#';
    return split.join('');
}

main().catch(err => {
    console.error(err);
})