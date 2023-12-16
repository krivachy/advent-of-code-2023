import { loadInput } from "../util/file";
import * as _ from 'lodash';

const directions = {
    up: { y: -1, x: 0 },
    down: { y: 1, x: 0 },
    left: { y: 0, x: -1 },
    right: { y: 0, x: 1 }
} as const;

type Coord = { x: number, y: number };

function hash(currentDir: Coord, currentPos: Coord): string {
    return `dir.x=${currentDir.x},dir.y=${currentDir.y},pos.x=${currentPos.x},pos.y=${currentPos.y}`;
}

async function main() {
    const lines = loadInput("./day16/input.txt");
    const grid = lines.map(l => l.split(''));

    const beams: { dir: Coord, pos: Coord }[] = [{ dir: directions.right, pos: { x: 0, y: 0 } }];
    const part1 = runBeams(beams, grid);
    console.log(`Part 1: ${part1} === 8539`);

    const startingBeams: { dir: Coord, pos: Coord }[] = [
        ...(_.range(0, grid[0].length).flatMap(i => [{ dir: directions.down, pos: { x: i, y: 0 } }, { dir: directions.up, pos: { x: i, y: grid.length - 1 } }])),
        ...(_.range(0, grid.length).flatMap(i => [{ dir: directions.right, pos: { x: 0, y: i } }, { dir: directions.left, pos: { x: grid[0].length - 1, y: i } }])),
    ]
    const part2 = _.max(startingBeams.map(beam => runBeams([beam], grid)));
    console.log(`Part 2: ${part2} === 8674`);
}

function runBeams(beams: { dir: Coord, pos: Coord }[], grid: string[][]): number {
    const energized = new Array(grid.length).fill(null).map(_ => new Array(grid[0].length).fill('.'));
    const seenBeams = new Set<string>();
    while (beams.length > 0) {
        let i = beams.length;
        while (i--) {
            let { dir: currentDir, pos: currentPos } = beams[i];
            if (currentPos.x < 0 || currentPos.x >= grid[0].length || currentPos.y < 0 || currentPos.y >= grid.length) {
                beams.splice(i, 1);
                continue;
            }
            const currentHash = hash(currentDir, currentPos);
            if (seenBeams.has(currentHash)) {
                beams.splice(i, 1);
                continue;
            } else {
                seenBeams.add(currentHash);
            }
            energized[currentPos.y][currentPos.x] = '#';
            const nextDirs = calculateNextDirs(currentDir, grid[currentPos.y][currentPos.x]);
            beams.splice(i, 1);
            beams.push(...(nextDirs.map(nextDir => ({ dir: nextDir, pos: applyDirection(currentPos, nextDir) }))));
        }
    }
    return _.sum(energized.map(r => r.filter(s => s === '#').length));
}

function applyDirection(position: Coord, direction: Coord): Coord {
    return { x: position.x + direction.x, y: position.y + direction.y };
}

const invalidState: () => never = () => { throw new Error('invalid') };

function calculateNextDirs(currentDir: Coord, mirror: string): Coord[] {
    if (mirror === '.') return [currentDir];
    if (_.isEqual(currentDir, directions.right)) {
        switch (mirror) {
            case '/': return [directions.up];
            case '\\': return [directions.down];
            case '-': return [directions.right];
            case '|': return [directions.up, directions.down];
            default: return invalidState();
        }
    }

    if (_.isEqual(currentDir, directions.left)) {
        switch (mirror) {
            case '/': return [directions.down];
            case '\\': return [directions.up];
            case '-': return [directions.left];
            case '|': return [directions.up, directions.down];
            default: return invalidState();
        }
    }

    if (_.isEqual(currentDir, directions.down)) {
        switch (mirror) {
            case '/': return [directions.left];
            case '\\': return [directions.right];
            case '-': return [directions.left, directions.right];
            case '|': return [directions.down];
            default: return invalidState();
        }
    }

    if (_.isEqual(currentDir, directions.up)) {
        switch (mirror) {
            case '/': return [directions.right];
            case '\\': return [directions.left];
            case '-': return [directions.left, directions.right];
            case '|': return [directions.up];
            default: return invalidState();
        }
    }
    return invalidState();
}

main().catch(err => {
    console.error(err);
})