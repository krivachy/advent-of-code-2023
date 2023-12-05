import { loadInput } from "../util/file";
import * as _ from 'lodash';

type Map = {
    destinationStartRange: number
    sourceStartRange: number
    rangeLength: number
}

async function main() {
    const lines = loadInput("./day05/input.txt");
    var seeds: number[] = [];
    const maps: Map[][] = [];
    lines.forEach(line => {
        if (line.startsWith("seeds: ")) {
            seeds = line.replace("seeds: ", "").split(" ").map(s => Number(s))
            return;
        }
        if (line.endsWith(' map:')) {
            maps.push([]);
            return;
        }
        if (line === '') {
            return;
        }
        const [dStart, sStart, len] = line.split(' ');
        _.last(maps)?.push({
            destinationStartRange: Number(dStart),
            sourceStartRange: Number(sStart),
            rangeLength: Number(len)
        });
    });
    
    function doMapping(seed: number): number {
        var currentMapping = seed;
        maps.forEach(map => {
            const correctMapping = map.find(m => currentMapping >= m.sourceStartRange && currentMapping < (m.sourceStartRange + m.rangeLength));
            if (correctMapping) {
                const newMapping = correctMapping.destinationStartRange + (currentMapping - correctMapping.sourceStartRange);
                currentMapping = newMapping;
            }
        }); 
        return currentMapping;
    }
    const part1 = _.min(seeds.map(s => doMapping(s)));
    console.log(`Part 1: ${part1}`);
    var part2 = Number.MAX_VALUE;
    _.chunk(seeds, 2).forEach(([start, len]) => {
        console.log(`From ${start} to ${start +len}, curr min=${part2}`);
        for (var i = start; i < start + len; i++) {
            const n = doMapping(i);
            if (n < part2) part2 = n;
        }
    });
    console.log(`Part 2: ${part2}`);
}

main().catch(err => {
    console.error(err);
})