import { Bindings } from '@comunica/bindings-factory';
import { DataFactory } from 'rdf-data-factory';
import { Map } from 'immutable';
import type * as RDF from '@rdfjs/types';
import * as mathjs from 'mathjs';

function opsPerSecondNonOverlapping(nRuns: number){
    const DF = new DataFactory();
    let bindings: Bindings;
    let bindingsOther: Bindings;

    bindings = new Bindings(DF, Map<string, RDF.Term>([
        [ 'a', DF.namedNode('ex:a') ],
        [ 'b', DF.namedNode('ex:b') ],
        [ 'c', DF.namedNode('ex:c') ],
        [ 'd', DF.namedNode('ex:d') ],
        [ 'e', DF.namedNode('ex:e') ]
    ]));

    bindingsOther = new Bindings(DF, Map<string, RDF.Term>([
        [ 'f', DF.namedNode('ex:f') ],
        [ 'g', DF.namedNode('ex:g') ],
        [ 'h', DF.namedNode('ex:h') ],
        [ 'i', DF.namedNode('ex:i') ],
    ]));

    const start = process.hrtime();
    for (let i = 0; i<nRuns; i++){
        const result = bindings.merge(bindingsOther);
    }

    const end = process.hrtime(start);
    const endSeconds = (end[0]+ end[1] / Math.pow(10,9));
    // console.log(`Ops/second merge non overlapping: ${nRuns/endSeconds}`);
    // console.log(`Total time overlapping: ${endSeconds}`);
    return endSeconds;
}

function opsPerSecondOverlapping(nRuns: number){
    const DF = new DataFactory();
    let bindings: Bindings;
    let bindingsOther: Bindings;

    bindings = new Bindings(DF, Map<string, RDF.Term>([
        [ 'a', DF.namedNode('ex:a') ],
        [ 'b', DF.namedNode('ex:b') ],
        [ 'c', DF.namedNode('ex:c') ],
        [ 'd', DF.namedNode('ex:d') ],
        [ 'e', DF.namedNode('ex:e') ]
    ]));

    bindingsOther = new Bindings(DF, Map<string, RDF.Term>([
        [ 'd', DF.namedNode('ex:d') ],
        [ 'a', DF.namedNode('ex:a') ],
        [ 'b', DF.namedNode('ex:b') ],
        [ 'f', DF.namedNode('ex:f') ],
    ]));

    const start = process.hrtime();
    for (let i = 0; i<nRuns; i++){
        const result = bindings.merge(bindingsOther);
    }

    const end = process.hrtime(start);
    const endSeconds = (end[0]+ end[1] / Math.pow(10,9));
    // console.log(`Ops/second merge overlapping: ${nRuns/endSeconds}`);
    // console.log(`Total time overlapping: ${endSeconds}`);
    return endSeconds;
}

function runExperiments(nReplications: number, nMerges: number){
    const mean_1 = [];
    const mean_2 = [];
    for (let i = 0; i<nReplications; i++){
        console.log(`Replication ${i+1}/${nReplications}`);
        mean_1.push(nMerges/opsPerSecondOverlapping(nMerges));
        mean_2.push(nMerges/opsPerSecondNonOverlapping(nMerges));
    }
    const std_1 = (mathjs.std(mean_1) as unknown) as number
    const std_2 = (mathjs.std(mean_2) as unknown) as number

    console.log(`Overlapping bindings: ${mathjs.mean(mean_1)} ops/s ${std_1} `);
    console.log(`Non overlapping bindings: ${mathjs.mean(mean_2)} ops/s ${std_2} `);

}

runExperiments(20, 1000000);





