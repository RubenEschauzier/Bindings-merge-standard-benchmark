"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bindings_factory_1 = require("@comunica/bindings-factory");
const rdf_data_factory_1 = require("rdf-data-factory");
const immutable_1 = require("immutable");
const mathjs = require("mathjs");
function opsPerSecondNonOverlapping(nRuns) {
    const DF = new rdf_data_factory_1.DataFactory();
    let bindings;
    let bindingsOther;
    bindings = new bindings_factory_1.Bindings(DF, (0, immutable_1.Map)([
        ['a', DF.namedNode('ex:a')],
        ['b', DF.namedNode('ex:b')],
        ['c', DF.namedNode('ex:c')],
        ['d', DF.namedNode('ex:d')],
        ['e', DF.namedNode('ex:e')]
    ]));
    bindingsOther = new bindings_factory_1.Bindings(DF, (0, immutable_1.Map)([
        ['f', DF.namedNode('ex:f')],
        ['g', DF.namedNode('ex:g')],
        ['h', DF.namedNode('ex:h')],
        ['i', DF.namedNode('ex:i')],
    ]));
    const start = process.hrtime();
    for (let i = 0; i < nRuns; i++) {
        const result = bindings.merge(bindingsOther);
    }
    const end = process.hrtime(start);
    const endSeconds = (end[0] + end[1] / Math.pow(10, 9));
    // console.log(`Ops/second merge non overlapping: ${nRuns/endSeconds}`);
    // console.log(`Total time overlapping: ${endSeconds}`);
    return endSeconds;
}
function opsPerSecondOverlapping(nRuns) {
    const DF = new rdf_data_factory_1.DataFactory();
    let bindings;
    let bindingsOther;
    bindings = new bindings_factory_1.Bindings(DF, (0, immutable_1.Map)([
        ['a', DF.namedNode('ex:a')],
        ['b', DF.namedNode('ex:b')],
        ['c', DF.namedNode('ex:c')],
        ['d', DF.namedNode('ex:d')],
        ['e', DF.namedNode('ex:e')]
    ]));
    bindingsOther = new bindings_factory_1.Bindings(DF, (0, immutable_1.Map)([
        ['d', DF.namedNode('ex:d')],
        ['a', DF.namedNode('ex:a')],
        ['b', DF.namedNode('ex:b')],
        ['f', DF.namedNode('ex:f')],
    ]));
    const start = process.hrtime();
    for (let i = 0; i < nRuns; i++) {
        const result = bindings.merge(bindingsOther);
    }
    const end = process.hrtime(start);
    const endSeconds = (end[0] + end[1] / Math.pow(10, 9));
    // console.log(`Ops/second merge overlapping: ${nRuns/endSeconds}`);
    // console.log(`Total time overlapping: ${endSeconds}`);
    return endSeconds;
}
function runExperiments(nReplications, nMerges) {
    const mean_1 = [];
    const mean_2 = [];
    for (let i = 0; i < nReplications; i++) {
        console.log(`Replication ${i + 1}/${nReplications}`);
        mean_1.push(nMerges / opsPerSecondOverlapping(nMerges));
        mean_2.push(nMerges / opsPerSecondNonOverlapping(nMerges));
    }
    const std_1 = mathjs.std(mean_1);
    const std_2 = mathjs.std(mean_2);
    console.log(`Overlapping bindings: ${mathjs.mean(mean_1)} ops/s ${std_1} `);
    console.log(`Non overlapping bindings: ${mathjs.mean(mean_2)} ops/s ${std_2} `);
}
runExperiments(20, 1000000);
//# sourceMappingURL=runMerge.js.map