import { loadInput } from "../util/file";
import * as _ from 'lodash';

async function main() {
    const lines = loadInput("./day02/input.txt");
    lines.forEach(line => console.log(line));
}

main().catch(err => {
    console.error(err);
})