import { loadInput } from "../util/file";
import * as _ from 'lodash';

type Coord = { x: number, y: number};
type Pipe = `${'bottom' | 'top'}-${'left' | 'right'}-corner` | 'horizontal' | 'vertical' | 'none';


async function main() {
    const lines = loadInput("./day10/input.txt");
    let starting: Coord | null = null;
    const grid: Pipe[][] = lines.map((l, y) => {
        return l.split('').map((s, x) => {
            if (s === 'S') {
                starting = { x, y};
            }
            return mapToPipe(s);
        });
    });
    const startingDirs = startingDirections(grid, starting!);

    let steps = 1;
    let previousCoord: Coord = starting!;
    let currentCoord = startingDirs[0];
    let network: Coord[] = [currentCoord];
    do {
        const next = nextCoord(grid, previousCoord, currentCoord);
        previousCoord = currentCoord;
        currentCoord = next;
        steps++;
        network.push(currentCoord)
    } while (!_.isEqual(currentCoord, starting));
    console.log(`Part 1: ${steps / 2} (${steps})`);

    const startingPipe: Pipe = 'top-right-corner';
    function isPartOfNetwork(coord: Coord): boolean {
        return network.some(c => _.isEqual(coord, c));
    }
    
    const updatedGrid: Pipe[][] = grid.map((row, y) => row.map((v, x) => {
        if (_.isEqual({x, y}, starting!)) return startingPipe;
        if (isPartOfNetwork({x,y})) return v;
        return 'none';
    }));

    updatedGrid.forEach(row => {
        row.unshift('none');
        row.push('none');
    });
    updatedGrid.unshift(new Array(updatedGrid[0].length).fill('none'))
    updatedGrid.push(new Array(updatedGrid[0].length).fill('none'))

    const expandedGrid: number[][] = new Array(updatedGrid.length * 3).fill(null).map(_ => []);
    for (let y = 0; y < updatedGrid.length; y++) {
        for (let pipe of updatedGrid[y]) {
            const tile = mapToTile(pipe);
            expandedGrid[y * 3].push(...tile[0])
            expandedGrid[y * 3 + 1].push(...tile[1])
            expandedGrid[y * 3 + 2].push(...tile[2])
        }
    }

    // expandedGrid.forEach(r => console.log(r.join('')));
    
    const yMax = expandedGrid.length;
    const xMax = expandedGrid[0].length;
    const stack = [[0, 0]]

    while (stack.length > 0) {
        const [y, x] = stack.pop()!;

        if (y < 0 || y >= yMax || x < 0 || x > xMax) continue;
        if (expandedGrid[y][x] === 1 || expandedGrid[y][x] === 8) continue;
        
        expandedGrid[y][x] = 8;

        stack.push([y - 1, x], [y, x - 1], [y, x + 1], [y + 1, x]);
    }

    // expandedGrid.forEach(r => console.log(r.join('')));

    let part2 = 0

    for (let y = 0; y < yMax; y += 3) {
        for (let x = 0; x < xMax; x += 3) {
            if (isEmptyTile(expandedGrid, y, x)) part2++;
        }
    }
    console.log(`Part 2: ${part2}`);

}

function isEmptyTile(grid: number[][], y: number, x: number): boolean {
    for (let j = y; j < y+3; j++) {
        for (let i = x; i < x+3; i++) {
            if (grid[i][j] !== 0) return false;
        }
    }
    return true;
}

function nextCoord(grid: Pipe[][], previousCoord: Coord, coord: Coord): Coord {
    const neighbors = neighboringCoords(grid, coord);
    return neighbors.filter(c => !_.isEqual(c, previousCoord))[0];
}

function neighboringCoords(grid: Pipe[][], coord: Coord): Coord[] {
    const pipe = get(grid, coord)
    switch(pipe) {
        case 'bottom-left-corner': return [up(coord), right(coord)];
        case 'bottom-right-corner': return [up(coord), left(coord)];
        case 'top-right-corner': return [down(coord), left(coord)];
        case 'top-left-corner': return [down(coord), right(coord)];
        case 'vertical': return [down(coord), up(coord)];
        case 'horizontal': return [left(coord), right(coord)];
        case 'none': throw new Error('ground');
    }
}

function startingDirections(grid: Pipe[][], starting: Coord): [Coord, Coord] {
    const coords: Coord[] = [];
    const leftCoord = get(grid, left(starting));
    const rightCoord = get(grid, right(starting));
    const downCoord = get(grid, down(starting));
    const upCoord = get(grid, up(starting));
    if (leftCoord === 'horizontal' || leftCoord === 'bottom-left-corner' || leftCoord === 'top-left-corner') {
        coords.push(left(starting));
    }
    if (rightCoord === 'horizontal' || rightCoord === 'bottom-right-corner' || rightCoord === 'top-right-corner') {
        coords.push(right(starting));
    }
    if (upCoord === 'vertical' || upCoord === 'top-right-corner' || upCoord === 'top-left-corner') {
        coords.push(up(starting));
    }
    if (downCoord === 'vertical' || downCoord === 'bottom-right-corner' || downCoord === 'bottom-left-corner') {
        coords.push(down(starting));
    }
    return [coords[0], coords[1]]
}


const get = (grid: Pipe[][], coord: Coord) => grid[coord.y][coord.x]
const left = (c: Coord): Coord => ({x: c.x - 1, y: c.y});
const right = (c: Coord): Coord => ({x: c.x + 1, y: c.y});
const up = (c: Coord): Coord => ({x: c.x, y: c.y - 1});
const down = (c: Coord): Coord => ({x: c.x, y: c.y + 1});


function mapToPipe(s: string): Pipe {
    switch(s) {
        case '|': return 'vertical';
        case '-': return 'horizontal';
        case 'J': return "bottom-right-corner";
        case 'L': return 'bottom-left-corner';
        case 'F': return 'top-left-corner';
        case '7': return 'top-right-corner';
        default: return 'none';
    }
}
type Tile = number[][];
function mapToTile(pipe: Pipe): Tile {
    switch (pipe) {
        case 'bottom-left-corner':
            return [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ];
        case 'bottom-right-corner':
            return [
                [0, 1, 0],
                [1, 1, 0],
                [0, 0, 0],
            ];
        case 'top-left-corner':
            return [
                [0, 0, 0],
                [0, 1, 1],
                [0, 1, 0],
            ];
        case 'top-right-corner':
            return [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 0],
            ];
        case 'vertical':
            return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ];
        case 'horizontal':
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ];
        case 'none':
            return [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ];
    }
}


main().catch(err => {
    console.error(err);
})