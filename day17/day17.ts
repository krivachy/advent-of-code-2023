import { loadInput } from "../util/file";
import * as _ from 'lodash';
import { MinPriorityQueue } from 'priority-queue-typed';

async function main() {
    const lines = loadInput("./day17/input.txt");
    const grid = lines.map(l => l.split('').map(n => Number(n)));
    const part1 = part1Dijkstra(grid);
    console.log(`Part 1: ${part1}`);
    const part2 = part2Dijkstra(grid);
    console.log(`Part 2: ${part2}`);
}

type Node = {
    heatLoss: number;
    row: number;
    column: number;
    directionRow: number;
    directionColumn: number;
    numberOfSteps: number;
}

function part1Dijkstra(grid: number[][]) {
    const seen: Set<string> = new Set();
    const priorityQueue = new MinPriorityQueue<Node>(undefined, {
        comparator: (a, b) => a.heatLoss - b.heatLoss
    })
    priorityQueue.add({ heatLoss: 0, row: 0, column: 0, directionRow: 0, directionColumn: 0, numberOfSteps: 0 });

    while (priorityQueue.size > 0) {
        const { heatLoss, row, column, directionRow, directionColumn, numberOfSteps } = priorityQueue.poll()!;

        if (row === grid.length - 1 && column === grid[0].length - 1) {
            return heatLoss;
        }

        const key = `${row}-${column}-${directionRow}-${directionColumn}-${numberOfSteps}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);

        if ((directionRow !== 0 || directionColumn !== 0) && numberOfSteps < 3) {
            const newRow = row + directionRow;
            const newColumn = column + directionColumn;
            if (0 <= newRow && newRow < grid.length && 0 <= newColumn && newColumn < grid[0].length) {
                priorityQueue.add({ heatLoss: heatLoss + grid[newRow][newColumn], row: newRow, column: newColumn, directionRow, directionColumn, numberOfSteps: numberOfSteps + 1 });
            }
        }

        for (const [newDirectionRow, newDirectionColumn] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
            if ((newDirectionRow !== directionRow || newDirectionColumn !== directionColumn) && (newDirectionRow !== -directionRow || newDirectionColumn !== -directionColumn)) {
                const newRow = row + newDirectionRow;
                const newColumn = column + newDirectionColumn;
                if (0 <= newRow && newRow < grid.length && 0 <= newColumn && newColumn < grid[0].length) {
                    priorityQueue.add({ heatLoss: heatLoss + grid[newRow][newColumn], row: newRow, column: newColumn, directionRow: newDirectionRow, directionColumn: newDirectionColumn, numberOfSteps: 1 });
                }
            }
        }
    }
}

function part2Dijkstra(grid: number[][]) {
    const seen: Set<string> = new Set();
    const priorityQueue = new MinPriorityQueue<Node>(undefined, {
        comparator: (a, b) => a.heatLoss - b.heatLoss
    })
    priorityQueue.add({ heatLoss: 0, row: 0, column: 0, directionRow: 0, directionColumn: 0, numberOfSteps: 0 });

    while (priorityQueue.size > 0) {
        const { heatLoss, row, column, directionRow, directionColumn, numberOfSteps } = priorityQueue.poll()!;

        if (row === grid.length - 1 && column === grid[0].length - 1 && numberOfSteps >= 4) {
            return heatLoss;
        }

        const key = `${row}-${column}-${directionRow}-${directionColumn}-${numberOfSteps}`;
        if (seen.has(key)) {
            continue;
        }

        seen.add(key);

        if ((directionRow !== 0 || directionColumn !== 0) && numberOfSteps < 10) {
            const newRow = row + directionRow;
            const newColumn = column + directionColumn;
            if (0 <= newRow && newRow < grid.length && 0 <= newColumn && newColumn < grid[0].length) {
                priorityQueue.add({ heatLoss: heatLoss + grid[newRow][newColumn], row: newRow, column: newColumn, directionRow, directionColumn, numberOfSteps: numberOfSteps + 1 });
            }
        }

        if ((directionRow === 0 && directionColumn === 0) || numberOfSteps >= 4) {
            for (const [newDirRow, newDirCol] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                if ((newDirRow !== directionRow || newDirCol !== directionColumn) && (newDirRow !== -directionRow || newDirCol !== -directionColumn)) {
                    const newRow = row + newDirRow;
                    const newColumn = column + newDirCol;
                    if (0 <= newRow && newRow < grid.length && 0 <= newColumn && newColumn < grid[0].length) {
                        priorityQueue.add({ heatLoss: heatLoss + grid[newRow][newColumn], row: newRow, column: newColumn, directionRow: newDirRow, directionColumn: newDirCol, numberOfSteps: 1 });
                    }
                }
            }
        }
    }
}

main().catch(err => {
    console.error(err);
})