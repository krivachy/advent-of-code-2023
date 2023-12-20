import { loadInput } from "../util/file";
import * as _ from 'lodash';

enum Pulse { LOW, HIGH }

type ModulePulse = {
    from: string;
    to: string;
    pulse: Pulse;
}

interface Module {
    name: string;
    pulse(input: ModulePulse): ModulePulse[] | null
}

// %
class FlipFlopModule implements Module {
    private on: boolean = false;
    constructor(public name: string, private outputs: string[]) { }
    pulse(input: ModulePulse): ModulePulse[] | null {
        if (input.pulse === Pulse.HIGH) return null;
        this.on = !this.on;
        return this.outputs.map(outputName => ({
            from: this.name,
            pulse: this.on ? Pulse.HIGH : Pulse.LOW,
            to: outputName
        }));
    }
}

// &
class ConjunctionModule implements Module {
    public inputStates: { [key: string]: Pulse };
    constructor(public name: string, private inputs: string[], private outputs: string[]) {
        this.inputStates = Object.fromEntries(inputs.map(i => [i, Pulse.LOW]));
    }
    pulse(input: ModulePulse): ModulePulse[] | null {
        this.inputStates[input.from] = input.pulse;
        const outputPulse = _.values(this.inputStates).every(p => p === Pulse.HIGH) ? Pulse.LOW : Pulse.HIGH;
        return this.outputs.map(outputName => ({
            from: this.name,
            pulse: outputPulse,
            to: outputName
        }));
    }
}

class BroadcasterModule implements Module {
    public name: string = 'broadcaster';
    constructor(private outputs: string[]) { }
    pulse(input: ModulePulse): ModulePulse[] | null {
        return this.outputs.map(outputName => ({
            from: this.name,
            pulse: input.pulse,
            to: outputName
        }));
    }
}

async function main() {
    const lines = loadInput("./day20/input.txt");
    const inputLookup = _.chain(lines).flatMap(l => {
        const [name, outputString] = l.split(' -> ');
        const outputs = outputString.split(', ');
        return outputs.map(o => ({ in: name.replace('&', '').replace('%', ''), out: o }));
    }).groupBy('out').mapValues(v => v.map(x => x.in)).value();
    const modules = _.chain(lines).map<Module>(l => {
        const [name, outputString] = l.split(' -> ');
        const outputs = outputString.split(', ');
        if (name.startsWith('broadcaster')) {
            return new BroadcasterModule(outputs);
        }
        const moduleName = name[0];
        const sanitisedName = name.slice(1);
        if (moduleName === '%') {
            return new FlipFlopModule(sanitisedName, outputs);
        }
        if (moduleName === '&') {
            return new ConjunctionModule(sanitisedName, inputLookup[sanitisedName], outputs);
        }
        throw new Error(`Unknown module: ${l}`);
    }).groupBy('name').mapValues(v => v[0]).value();

    // Part 1 state:
    let pulseCount = { low: 0, high: 0 };
    function countPulse(pulse: ModulePulse) {
        if (pulse.pulse === Pulse.HIGH) pulseCount.high++;
        else pulseCount.low++;
    }
    // Part 2 state:
    const rxInputName = inputLookup['rx'][0];
    const rxInputModule = modules[rxInputName] as ConjunctionModule;
    let rxCycles = _.mapValues(rxInputModule.inputStates, _ => 0);

    // Pulse functions
    const pulses: ModulePulse[] = [];
    function addPulse(buttonPress: number, pulse: ModulePulse | ModulePulse[] | null) {
        if (pulse !== null) {
            (_.isArray(pulse) ? pulse : [pulse]).forEach(p => {
                // Solve part 1:
                countPulse(p);
                // Solve part 2:
                if (p.to === rxInputName && p.pulse === Pulse.HIGH && rxCycles[p.from] === 0) {
                    rxCycles[p.from] = buttonPress;
                }
                pulses.push(p);
            })
        }
    }

    function pressButton(buttonPress: number) {
        addPulse(buttonPress, {
            from: 'button',
            to: 'broadcaster',
            pulse: Pulse.LOW
        });
    }

    let buttonPressCount = 0;
    while (_.values(rxCycles).some(c => c === 0) || buttonPressCount < 1000) {
        pressButton(buttonPressCount);
        buttonPressCount++;
        while (pulses.length) {
            const pulse = pulses.shift()!;
            // console.log(`${pulse.from} -${pulse.pulse === Pulse.HIGH ? 'high' : 'low'}-> ${pulse.to}`);
            const module = modules[pulse.to];
            if (module) {
                addPulse(buttonPressCount, module.pulse(pulse));
            }
        }
        if (buttonPressCount === 1000) {
            // Print part 1
            console.log(`Part 1: ${pulseCount.low * pulseCount.high}`);
        }
    }
    console.log(`Part 2: ${lcm(...(_.values(rxCycles)))}`);


}

const lcm = (...arr: number[]): number => {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
    return [...arr].reduce((a, b) => _lcm(a, b));
};

main().catch(err => {
    console.error(err);
})