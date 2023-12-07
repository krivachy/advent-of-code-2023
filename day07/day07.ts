import { loadInput } from "../util/file";
import * as _ from 'lodash';

const ranks: any = {
    A:12, K:11, Q:10, J:9, T:8, 9:7, 8:6, 7:5, 6: 4, 5: 3, 4: 2, 3: 1, 2: 0
};


const ranks2: any = {
    A:12, K:11, Q:10, J:0, T:9, 9:8, 8:7, 7:6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1
};

async function part1() {
    const lines = loadInput("./day07/input.txt");
    const hands = lines.map(l => l.split(' ')).map(([hand, bid]) => ({hand, bid: Number(bid)})).map(hand => {
        const primaryRank = calculatePrimaryRank(hand.hand);
        const secondaryRank = calculateSecondaryRank(hand.hand);
        const rank = primaryRank * 10000000000 + secondaryRank;
        return {...hand, rank };
    });
    const part1 = _.chain(hands).sortBy('rank').map((hand, index) => hand.bid * (index + 1)).sum();
    console.log(`Part 1: ${part1}`);

}


async function part2() {
    const lines = loadInput("./day07/input.txt");
    const hands = lines.map(l => l.split(' ')).map(([hand, bid]) => ({hand, bid: Number(bid)})).map(hand => {
        const primaryRank = calculatePrimaryRank2(hand.hand);
        const secondaryRank = calculateSecondaryRank2(hand.hand);
        const rank = primaryRank * 10000000000 + secondaryRank;
        return {...hand, rank };
    });
    const part2 = _.chain(hands).sortBy('rank').map((hand, index) => hand.bid * (index + 1)).sum();
    console.log(`Part 2: ${part2}`);

}

function calculatePrimaryRank(hand: string): number {
    const grouped = _.values(_.mapValues(_.groupBy(hand.split('')), v => v.length));
    if (grouped.length === 1) { return 7}
    if (grouped.length === 2) {
        if (grouped[0] === 4) return 6;
        if (grouped[0] === 3) return 5;
        if (grouped[0] === 2 && grouped[1] === 3) return 5;
        return 6;
    }
    if (grouped.length === 3) {
        if (grouped.includes(3)) {
            return 4;
        }
        return 3;
    }
    if (grouped.length === 4) return 2;
    return 1;
}

function calculatePrimaryRank2(hand: string): number {
    const grouped = _.values(_.mapValues(_.groupBy(hand.split('')), v => v.length));
    const jokerCount = hand.split('').filter(c => c === 'J').length;
    if (grouped.length === 1) { return 7}
    if (grouped.length === 2) {
        if (grouped[0] === 4 || grouped[0] === 1) {
            if (jokerCount === 1) return 7;
            if (jokerCount === 4) return 7;
            return 6;
        }
        if (grouped[0] === 3) {
            if (jokerCount === 0) return 5;
            if (jokerCount === 1) return 6;
            if (jokerCount === 2) return 7;
            if (jokerCount === 3) return 7;
        }
        if (grouped[0] === 2 && grouped[1] === 3) {
            if (jokerCount === 2) return 7;
            if (jokerCount === 3) return 7;
            return 5;
        }
        if (jokerCount === 1) return 7;
        return 6;
    }
    if (grouped.length === 3) {
        if (grouped.includes(3)) {
            if (jokerCount === 1) return 6;
            if (jokerCount === 3) return 6;
            return 4;
        }
        if (jokerCount === 1) return 5;
        if (jokerCount === 2) return 6;
        return 3;
    }
    if (grouped.length === 4) {
        if (jokerCount === 1) return 4;
        if (jokerCount === 2) return 4;
        return 2;
    }
    if (jokerCount === 1) return 2;
    return 1;
}

function calculateSecondaryRank(hand: string): number {
    return Number(hand.split('').map(c => ranks[c]).map(n => _.padStart(n, 2, '0')).join(''));
}
function calculateSecondaryRank2(hand: string): number {
    return Number(hand.split('').map(c => ranks2[c]).map(n => _.padStart(n, 2, '0')).join(''));
}


part1().catch(err => {
    console.error(err);
})


part2().catch(err => {
    console.error(err);
})