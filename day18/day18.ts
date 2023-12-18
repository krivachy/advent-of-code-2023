import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day18/input.txt");

    const instructions = lines.map(l => {
        const [dir, numberOfSteps, color] = l.split(' ');
        return {
            dir,
            numberOfSteps: Number(numberOfSteps),
            color: color.replace('(', '').replace(')', '').replace('#', '')
        }
    })

    // const part1 = solvePart1Slow(instructions);
    const part1 = solvePart2(instructions);
    console.log(`Part 1: ${part1} === 76387`);

    const part2Instructions = instructions.map(i => {
        const dirNum = i.color.at(5)!;
        const hexSteps = i.color.slice(0, 5);
        return {
            dir: { 0: 'R', 1: 'D', 2: 'L', 3: 'U' }[dirNum]!,
            numberOfSteps: parseInt(hexSteps, 16)
        }
    });
    const part2 = solvePart2(part2Instructions);
    console.log(`Part 2: ${part2} | ${250022188522074 - part2}`);
}

function solvePart1Slow(instructions: { dir: string, numberOfSteps: number }[]) {
    const maxLeftRight = Math.max(...(['L', 'R'].map(d => _.sumBy(instructions, i => i.dir === d ? i.numberOfSteps : 0))));
    const maxUpDown = Math.max(...(['U', 'D'].map(d => _.sumBy(instructions, i => i.dir === d ? i.numberOfSteps : 0))));
    const maxX = (maxLeftRight + 2) * 2;
    const maxY = (maxUpDown + 2) * 2;
    const grid = new Array(maxY).fill(null).map(_ => new Array(maxX).fill('.'));
    let currentPosition = [maxLeftRight + 1, maxUpDown + 1];
    grid[currentPosition[1]][currentPosition[0]] = '#';
    for (const i of instructions) {
        _.range(0, i.numberOfSteps).forEach(step => {
            const [x, y] = currentPosition;
            const newX = x + ({ 'L': -1, 'R': 1 }[i.dir] ?? 0)
            const newY = y + ({ 'U': -1, 'D': 1 }[i.dir] ?? 0)
            grid[newY][newX] = '#';
            currentPosition = [newX, newY];
        })
    }

    const queue = [[0, 0]];
    while (queue.length) {
        const [cx, cy] = queue.pop()!;
        grid[cy][cx] = 'W';
        const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]]
            .map(([dx, dy]) => [cx + dx, cy + dy])
            .filter(([x, y]) => x >= 0 && x < maxX && y >= 0 && y < maxY)
            .filter(([x, y]) => grid[y][x] === '.');
        queue.push(...neighbors);
    }
    return _.sum(grid.map(r => r.filter(s => s !== 'W').length));
}



function solvePart2(instructions: { dir: string, numberOfSteps: number }[]) {
    let currentPosition = [0, 0];
    let perimeter = 0;
    const coords: number[][] = [currentPosition];
    for (const i of instructions) {
        const [x, y] = currentPosition;
        const newX = x + ({ 'L': -1 * i.numberOfSteps, 'R': i.numberOfSteps }[i.dir] ?? 0)
        const newY = y + ({ 'U': -1 * i.numberOfSteps, 'D': i.numberOfSteps }[i.dir] ?? 0)
        currentPosition = [newX, newY];
        coords.push(currentPosition);
        perimeter += i.numberOfSteps;
    }
    return (perimeter / 2) + 1 + shoelaceFormulaArea(coords);

}

// Hint by reddit
// https://en.wikipedia.org/wiki/Shoelace_formula
function shoelaceFormulaArea(points: number[][]): number {
    const n = points.length;
    const area = _.sum(_.range(0, n).map(i => {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % n];
        return (x1 * y2 - x2 * y1);
    }));
    return Math.abs(area) / 2;
}

main().catch(err => {
    console.error(err);
})