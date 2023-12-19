import { loadInput } from "../util/file";
import * as _ from 'lodash';

type Part = { [k: string]: number };
type Predicate = (part: Part) => string | number | null;
type Workflow = {
    name: string;
    predicates: Predicate[]
}

async function main() {
    const lines = loadInput("./day19/input.txt");
    
    const part1 = calculateScore(part1AcceptedParts(lines));
    console.log(`Part 1: ${part1} === 399284`);

    const part2 = part2DistincRatings(lines);
}

function toPredicate(s: string): Predicate {
    if (s === 'A') return () => 1;
    if (s === 'R') return () => 0;
    if (!s.includes(':')) return () => s;
    const [cond, nextWorkflow] = s.split(':');
    const nextResult = nextWorkflow === 'A' ? 1 : nextWorkflow === 'R' ? 0 : nextWorkflow;
    switch (cond.at(1)!) {
        case '>':
            return part => part[cond.at(0)!] > Number(cond.slice(2)) ? nextResult : null;
        case '<':
            return part => part[cond.at(0)!] < Number(cond.slice(2)) ? nextResult : null;
        default:
            throw new Error('unknown: ' + cond.at(1));
    }
}

function part1AcceptedParts(lines: string[]): Part[] {
    const workflows: Workflow[] = _.takeWhile(lines, l => l !== '').map(l => {
        const [name, predicateString] = l.replace('}', '').split('{');
        const predicateStrings = predicateString.split(',');
        return {
            name,
            predicates: predicateStrings.map(s => toPredicate(s))
        }
    });
    const groupedWorkflows = _.chain(workflows).groupBy('name').mapValues(v => v[0]).value();
    const parts = _.dropWhile(lines, l => !l.startsWith('{')).map(l => {
        const types = l.replace('{', '').replace('}', '').split(',');
        return types.reduce<Part>((obj, next) => {
            const [name, number] = next.split('=');
            obj[name] = Number(number);
            return obj;
        }, {});
    });
    const acceptedParts = parts.reduce<Part[]>((acc, part) => {
        const accepted = runWorkflow(groupedWorkflows, part);
        if (accepted) {
            return [...acc, part];
        } else {
            return acc;
        }
    }, []);
    return acceptedParts;
}

function runWorkflow(workflows: {[key: string]: Workflow}, part: Part): boolean {
    let currentWorkflow = 'in';
    while(true) {
        const workflow = workflows[currentWorkflow];
        const p = workflow.predicates.find(p => p(part) !== null)!;
        const result = p(part);
        if (typeof result === 'number') {
            return result === 1;
        }
        if (typeof result === 'string') {
            currentWorkflow = result;
        } else {
            throw new Error('no');
        }
    }
}

function calculateScore(parts: Part[]): number {
    return _.sum(parts.flatMap(p => Object.values(p)))
}

type Predicate2 = {
    rule?: {
        rating: string;
        number: number;
        operator: '>' | '<';
    },
    next: string | number,
}
type Workflow2 = {
    name: string;
    predicates: Predicate2[];
}
type Range = {start: number; end: number}
type PartRange = { [k: string]: Range};

function part2DistincRatings(lines: string[]) {
    const workflows: _.Dictionary<Workflow2> = _.chain(lines).takeWhile(l => l !== '').map(l => {
        const [name, predicateString] = l.replace('}', '').split('{');
        const predicateStrings = predicateString.split(',');
        return {
            name,
            predicates: predicateStrings.map(s => toPredicate2(s))
        }
    }).groupBy('name').mapValues(w => w[0]).value();
    
    const startingRange: PartRange = {
        x: {start: 1, end: 4000},
        m: {start: 1, end: 4000},
        a: {start: 1, end: 4000},
        s: {start: 1, end: 4000},
    };

    let part2 = 0;
    const queue: [string | number, PartRange][] = [['in', startingRange]];
    while (queue.length) {
        const [workflowName, partRanges] = queue.shift()!;
        if (typeof workflowName === 'number') {
            if (workflowName === 1) {
                part2 += combinations(partRanges);
            }
            // accept or reject, continue
            continue;
        }
        
        workflows[workflowName].predicates.forEach(p => {
            if (p.rule) {
                const rule = p.rule;
                const nextPartRanges = _.cloneDeep(partRanges);
                if (rule.operator === '>') {
                    nextPartRanges[rule.rating].start = Math.max(partRanges[rule.rating].start, rule.number + 1);
                    // negative:
                    partRanges[rule.rating].end = Math.min(partRanges[rule.rating].end, nextPartRanges[rule.rating].start - 1)
                }
                if (rule.operator === '<') {
                    nextPartRanges[rule.rating].end = Math.min(partRanges[rule.rating].end, rule.number - 1);
                    // negative:
                    partRanges[rule.rating].start = Math.max(partRanges[rule.rating].start, nextPartRanges[rule.rating].end + 1)
                }
                queue.push([p.next, nextPartRanges]);
            } else {
                queue.push([p.next, partRanges])
            }
        })
    }

    console.log(`Part 2: ${part2} === 121964982771486`);
}

function toPredicate2(s: string): Predicate2 {
    if (s === 'A') return {next: 1};
    if (s === 'R') return {next: 0};
    if (!s.includes(':')) return {next: s};
    const [cond, nextWorkflow] = s.split(':');
    const nextResult = nextWorkflow === 'A' ? 1 : nextWorkflow === 'R' ? 0 : nextWorkflow;
    const value = Number(cond.slice(2));
    return {
        next: nextResult,
        rule: {
            rating: cond.at(0)!,
            number: value,
            operator: cond.at(1)! as '>' | '<'
        },
    }
}

function combinations(partRange: PartRange): number {
    return Object.values(partRange).reduce((a, b) => a * (1 + b.end - b.start), 1);
}

main().catch(err => {
    console.error(err);
})