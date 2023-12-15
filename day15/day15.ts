import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day15/input.txt");
    const part1 = _.sum(lines[0].split(',').map(s => hashFn(s)));
    console.log(`Part 1: ${part1}`); 

    const hashMap = new Array(256).fill(null).map(_ => new Array());
    for (const lens of lines[0].split(',')) {
        const label = lens.replace('-', '').split('=')[0];
        const hash = hashFn(label);
        if(lens.includes('=')) {
            const existingLensIndex = hashMap[hash].findIndex(l => l.split('=')[0] === label);
            if (existingLensIndex >= 0) {
                hashMap[hash][existingLensIndex] = lens;
            } else {
                hashMap[hash].push(lens);
            }
        }
        if (lens.endsWith('-')) {
            const existingLensIndex = hashMap[hash].findIndex(l => l.split('=')[0] === label);
            if (existingLensIndex >= 0) hashMap[hash].splice(existingLensIndex, 1);
        }
        
    }
    const part2 = _.sum(hashMap.flatMap((box, boxNum) => {
        return box.map((lens, lensNum) => {
            return (1 + boxNum) * (1 + lensNum) * Number(lens.split('=')[1]);
        });
    }));

    console.log(`Part 2: ${part2}`);

}

function hashFn(str: string): number {
    return _.reduce(str.split(''), (acc, next) => ((acc + next.charCodeAt(0)) * 17) % 256, 0)
}

main().catch(err => {
    console.error(err);
})