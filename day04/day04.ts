import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day04/input.txt");
    const part1 = _.sum(lines.map(line => {
        const [game, numbers] = line.split(':');
        const [winning, mine] = numbers.split('|');
        const winningSet = winning.split(' ').map(s => Number(s)).filter(n => n > 0);
        const mySet = mine.split(' ').map(s => Number(s)).filter(n => n > 0);
        const winners = _.intersection(winningSet, mySet);
        return winners.length > 0 ? 2 ** (winners.length - 1) : 0;
    }))
    console.log(`Part 1: ${part1}`);

    const copies = Array(lines.length).fill(0);
    lines.forEach((line, index) => {
        const [game, numbers] = line.split(':');
        const [winning, mine] = numbers.split('|');
        const winningSet = winning.split(' ').map(s => Number(s)).filter(n => n > 0);
        const mySet = mine.split(' ').map(s => Number(s)).filter(n => n > 0);
        const winners = _.intersection(winningSet, mySet).length;
        const totalCopies = copies[index] + 1;
        for(var i = 1; i <= winners; i++) {
            copies[index + i] += totalCopies;
        }
    });
    const part2 = lines.length + _.sum(copies);
    console.log(`Part 2: ${part2}`)
}

main().catch(err => {
    console.error(err);
})