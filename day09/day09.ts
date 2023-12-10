import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day09/input.txt");
    const part1 = _.chain(lines).map(line => {
        const numbers = line.split(' ').map(s => Number(s));
        const lastNumbers = recurse1(numbers, [numbers.at(-1)!]);
        return _.sum(lastNumbers)
    }).sum().value();
    console.log(`Part 1: ${part1}`);


    const part2 = _.chain(lines).map(line => {
        const numbers = line.split(' ').map(s => Number(s));
        const firstNumbers = recurse2(numbers, [numbers.at(0)!]);
        return firstNumbers.reduceRight((acc, next) => next - acc, 0);

    }).sum().value();
    console.log(`Part 2: ${part2}`);
}

function recurse1(seq: number[], lastNumbers: number[]) {
    if (seq.every(n => n === 0)) return lastNumbers;
    const nextSeq = finiteDifference(seq);
    return recurse1(nextSeq, lastNumbers.concat(nextSeq.at(-1)!));
}

function recurse2(seq: number[], firstNumbers: number[]) {
    if (seq.every(n => n === 0)) return firstNumbers;
    const nextSeq = finiteDifference(seq);
    return recurse2(nextSeq, firstNumbers.concat(nextSeq.at(0)!));
}

function finiteDifference(seq: number[]): number[] {
    const reduced = _.reduce<number, {previous: null | number, results: number[]}>(seq, (acc, next) => ({
            previous: next,
            results: acc.previous !== null ? acc.results.concat(next - acc.previous) : acc.results,
        }), { previous: null, results: []});
    return reduced.results;
}

main().catch(err => {
    console.error(err);
})