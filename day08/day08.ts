import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day08/input.txt");
    const instructions = "LRRRLRRLLLRRRLRLRRLRRRLRLRRRLLLRRLRRLRRRLRRRLRLLRLRRLRRLLRRLRLRRRLRRLRRLRRLLRRRLRLRLRLRLLRRLLLRRLRLRRLRLLLLRRLRRRLRRLRRRLLRRRLRRLRRRLRLLRLRRLRRLLRRRLLLRLRRRLLLRRLLRRRLLRRLRRLRRLRLRRRLLRRRLRLLRLRRLLRLRRLRLLRLRRLRRRLLRRLLRRRLRRLRLRLRRRLRLRRRLRRRLRRLRRRLRLLRRRLLRRRR".split('');

    const nodes = _.chain(lines).map(l => {
        const [name, leftright] = l.split(' = ');
        const [left, right] = leftright.replace('(', '').replace(')', '').split(', ')
        return { name, left, right };
    }).groupBy('name').mapValues(v => v[0]).value();
    
    var currentNode = 'AAA';
    var steps = 0;
    do {
        const instruction = instructions[steps % instructions.length];
        currentNode = instruction === 'L' ? nodes[currentNode].left : currentNode = nodes[currentNode].right;
        steps++;
    } while(currentNode !== 'ZZZ');
    console.log(`Part 1: ${steps}`);

    var currentNodes = _.keys(nodes).filter(n => n.endsWith('A'));
    var endingWithZ = currentNodes.map(n => 0);
    var steps2 = 0;
    do {
        const instruction = instructions[steps2 % instructions.length];
        steps2++;
        for (var i = 0; i < currentNodes.length; i++) {
            const nextNode = instruction === 'L' ? nodes[currentNodes[i]].left : nodes[currentNodes[i]].right;
            currentNodes[i] = nextNode;
            if (nextNode.endsWith('Z') && endingWithZ[i] === 0) {
                endingWithZ[i] = steps2;
            }
        }
    } while(endingWithZ.some(n => n === 0));
    console.log(`Part 2: LCM(${endingWithZ})`)
}

main().catch(err => {
    console.error(err);
})