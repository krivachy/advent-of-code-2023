import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day12/input.txt");
    const part1 = solve(lines);
    console.log(`Part 1: ${part1}`);
    let part2 = 0;
    for (const line of lines) {
        const [springs, numbers] = line.split(' ');
        const expandedSprings = `${springs}?${springs}?${springs}?${springs}?${springs}`;
        const arrangements = `${numbers},${numbers},${numbers},${numbers},${numbers}`.split(',').map(s => Number(s));
        const minLength = arrangements.reduce((a, b) => a + b + 1);
        part2 += recursePart2(expandedSprings, 0, arrangements, minLength, []);
    }
    console.log(`Part 2: ${part2}`);
}

function solve(lines: string[]): number {
    return _.sum(lines.map(l => {
        const [springsInput, arrangementsInput] = l.split(' ');
        const arrangements = arrangementsInput.split(',').map(a => Number(a));
        const springs = springsInput.split('');
        let permutations: string[][] = springs[0] === '?' ? [['#'], ['.']] : [[springs[0]]];
        for (let i = 1; i < springs.length; i++) {        
            if (springs[i] === '?') {
                const newPermutations = _.cloneDeep(permutations);
                permutations.forEach(s => s.push('.'));
                newPermutations.forEach(s => {
                    s.push('#');
                    if (isValidPartially(s, arrangements)) {
                        permutations.push(s);
                    }
                });
            } else {
                permutations.forEach(s => s.push(springs[i]));
            }
            // Only continue with permutations that actually make sense
            permutations = permutations.filter(p => isValidPartially(p, arrangements));
        }
        return permutations.filter(p => isValid(p, arrangements)).length;
    }))
}

function isValidPartially(partialSprings: string[], arrangements: number[]): boolean {
    const arr = toArrangements(partialSprings);
    // Last may be incomplete group
    const excludingLast = arr.slice(0, -1);
    const matching = arrangements.slice(0, excludingLast.length);
    if (arr.length > 1) {
        return _.zip(excludingLast, matching).every(([a, b]) => a === b);
    } else {
        return true;
    }

}

function isValid(springs: string[], arrangements: number[]): boolean {
    const arr = toArrangements(springs);
    const result = arr.length === arrangements.length && _.zip(arr, arrangements).every(([a, b]) => a === b);
    return result;
}

function toArrangements(partialSprings: string[]): number[] {
    const results: number[] = [];
    let currentGroup = 0;
    for (let i = 0; i < partialSprings.length; i++) {
        if (partialSprings[i] === '#') {
            currentGroup++;
        } else if (currentGroup !== 0) {
            results.push(currentGroup);
            currentGroup = 0;
        }
    }
    if (currentGroup !== 0) {
        results.push(currentGroup);
    }
    return results;
}

function recursePart2(springs: string, index: number, arrangements: number[], minLength: number, cache: number[][]): number {
    function memoize(result: number) {
        return (cache[index] ??= [])[cache.length] = result;
    }

    if (typeof cache[index]?.[arrangements.length] === "number") {
        return cache[index][arrangements.length];
    }
    if (arrangements.length === 0) {
        return springs.indexOf('#', index) >= 0 ? 0 : 1;
    }
    else if (index + minLength > springs.length) {
        return memoize(0);
    }
    else if (springs[index] === '.') {
        let next = index;
        while (springs[next] === '.') next++;
        return memoize(recursePart2(springs, next, arrangements, minLength, cache));
    }
    else if (index >= springs.length) {
        return memoize(arrangements.length === 0 ? 1 : 0);
    }
    else if (springs[index] === '#') {
        if (springs.length - index < arrangements[0]) return memoize(0);
        for (let i = 0; i < arrangements[0]; i++) {
            if (springs[index + i] === '.') return memoize(0);
        }
        if (springs[index + arrangements[0]] === '#') return memoize(0);
        return memoize(recursePart2(springs, index + arrangements[0] + 1, arrangements.slice(1), minLength - arrangements[0] - 1, cache));
    }
    else if (springs[index] === '?') {
        let result = recursePart2(springs, index + 1, arrangements, minLength, cache);

        if (springs.length - index < arrangements[0]) return memoize(result);
        for (let i = 0; i < arrangements[0]; i++) {
            if (springs[index + i] === '.') return memoize(result);
        }
        if (springs[index + arrangements[0]] === '#') return memoize(result);


        result += recursePart2(springs, index + arrangements[0] + 1, arrangements.slice(1), minLength - arrangements[0] - 1, cache);
        return memoize(result);
    }
    throw Error();
}


main().catch(err => {
    console.error(err);
})