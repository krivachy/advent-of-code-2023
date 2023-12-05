import fs from 'node:fs';

export function loadInput(filePath: string): string[] {
    return fs.readFileSync(filePath).toString("utf8").split("\n");
}