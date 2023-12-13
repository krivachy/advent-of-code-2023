import { loadInput } from "../util/file";
import * as _ from 'lodash';

type Coord = { x: number, y: number};
type UniversePart = 'galaxy' | 'space';

async function part1() {
    const lines = loadInput("./day11/input.txt");
    const universe: UniversePart[][] = lines.map(l => l.split('').map(x => x === '#' ? 'galaxy' : 'space' ));
    const rowExpandedUniverse = universe.flatMap(r => r.every(x => x === 'space') ? [r, r] : [r]);
    const expandedUniverse: UniversePart[][] = new Array(rowExpandedUniverse.length).fill(null).map(_ => []);
    for (let i = 0; i < rowExpandedUniverse[0].length; i++) {
        if (rowExpandedUniverse.every(r => r[i] === 'space')) {
            expandedUniverse.forEach(r => r.push('space', 'space'));
        } else {
            expandedUniverse.forEach((r, j) => r.push(rowExpandedUniverse[j][i]));
        }
    }
    const galaxies: Coord[] = [];
    expandedUniverse.forEach((r, x) => r.forEach((v, y) => {
        if (v === 'galaxy') {
            galaxies.push({x, y});
        }
    }));
    const pairs = galaxies.flatMap(
        (a, i) => galaxies.slice(i + 1).map(b => [a, b])
    );
    const part1 = _.sum(pairs.map(([a, b]) => manhattanDistance(a, b)));
    console.log(`Part 1: ${part1}`);
}

async function part2() {
    const lines = loadInput("./day11/input.txt");
    const universe: UniversePart[][] = lines.map(l => l.split('').map(x => x === '#' ? 'galaxy' : 'space' ));
    const rowsExpanded: number[] = [];
    const columnsExpanded: number[] = [];
    universe.forEach((r, i) => { if (r.every(x => x === 'space')) rowsExpanded.push(i) });
    for (let i = 0; i < universe[0].length; i++) {
        if (universe.every(r => r[i] === 'space')) {
            columnsExpanded.push(i);
        }
    }
    const galaxies: Coord[] = [];
    universe.forEach((r, x) => r.forEach((v, y) => {
        if (v === 'galaxy') {
            galaxies.push({x, y});
        }
    }));
    const pairs = galaxies.flatMap(
        (a, i) => galaxies.slice(i + 1).map(b => [a, b])
    );
    const part2 = _.sum(pairs.map(([a, b]) => {
        return manhattanDistance(a, b) + _.range(a.x, b.x).filter(x => rowsExpanded.includes(x)).length * 999999 + _.range(a.y, b.y).filter(y => columnsExpanded.includes(y)).length * 999999;
    }));
    console.log(`Part 2: ${part2}`);
}

function manhattanDistance(a: Coord, b: Coord): number {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

part1().catch(err => {
    console.error(err);
})

part2().catch(err => {
    console.error(err);
})