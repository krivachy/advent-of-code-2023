import { loadInput } from "../util/file";
import * as _ from 'lodash';

const RED_LIMIT = 12;
const GREEN_LIMIT = 13;
const BLUE_LIMIT = 14;

async function main() {
    const lines = loadInput("./day02/input.txt");
    const input = lines.map(parseLine);
    const part1 = _.sumBy(input.filter(game => game.turns.every(t => t.blue <= BLUE_LIMIT && t.green <= GREEN_LIMIT && t.red <= RED_LIMIT)), 'gameNum');
    console.log(`Part 1: ${part1}`);

    const part2 = _.sum(input.map(game => (_.maxBy(game.turns, 'red')?.red ?? 1) * (_.maxBy(game.turns, 'blue')?.blue ?? 1) * (_.maxBy(game.turns, 'green')?.green ?? 1)))
    console.log(`Part 2: ${part2}`);
}

function parseLine(line: string): {gameNum: number, turns: {red: number, green: number, blue: number}[]} {
        const [game, rest] = line.split(': ');
        const gameNum = parseInt(game.replace('Game ', ''));
        const turns = rest.split(';');
        return {
            gameNum,
            turns: turns.map(parseTurn)
        };
}

function parseTurn(turn: string): {red: number, green: number, blue: number} {
    const colors = turn.split(',');
    return {
        red: getColor(colors, 'red'),
        green: getColor(colors, 'green'),
        blue: getColor(colors, 'blue'),
    }
}

function getColor(colors: string[], color: string): number {
    return parseInt(colors.find(c => c.endsWith(` ${color}`))?.replace(` ${color}`, '') ?? '0');
}

main().catch(err => {
    console.error(err);
})