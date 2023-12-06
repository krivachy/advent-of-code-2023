import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function part1() {
    const lines = loadInput("./day06/input.txt");
    const times = lines[0].replace('Time:        ', '').split(' ').filter(s => s !== '').map(s => Number(s));
    const distances = lines[1].replace('Distance:   ', '').split(' ').filter(s => s !== '').map(s => Number(s));
    const winners: number[] = [];
    for(var i = 0; i < times.length; i++) {
        const [time, distance] = [times[i], distances[i]];
        const minSpeed = _.ceil(distance/time);
        var winner = 0;
        var readyToBreak = false;
        for(var heldTime = minSpeed; heldTime < time; heldTime++) {
            if ((heldTime * (time - heldTime) > distance)) {
                winner++;
                readyToBreak = true;
            } else if (readyToBreak) {
                break;
            }
        }
        winners.push(winner);
    }
    const part1 = winners.reduce((acc, next) => acc * next);
    console.log(`Part 1: ${part1}`);
}

async function part2() {
    const lines = loadInput("./day06/input.txt");
    const time = Number(lines[0].replace('Time:        ', '').split(' ').filter(s => s !== '').join(''));
    const distance = Number(lines[1].replace('Distance:   ', '').split(' ').filter(s => s !== '').join(''));

    const minSpeed = _.ceil(distance/time);
    var part2 = 0;
    var readyToBreak = false;
    for(var heldTime = minSpeed; heldTime < time; heldTime++) {
        if ((heldTime * (time - heldTime) > distance)) {
            part2++;
            readyToBreak = true;
        } else if (readyToBreak) {
            break;
        }
    }

    console.log(`Part 2: ${part2}`);
}

part1().catch(err => {
    console.error(err);
})


part2().catch(err => {
    console.error(err);
})