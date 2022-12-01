const GeneticAlgorithm = require('geneticalgorithm');
const levenshtein = require('js-levenshtein');

const LevenshteinWeight = 100;
const PhenotypeSize = 12;
const PopulationSize = 100;
const MutationChance = 0.1;
const Goal = 'Hello world!'

function generateRandomCharCode() {
    return clampCharacterCode(Math.random() * 95 + 32);
}

function clampCharacterCode(charCode) {
    if (charCode < 32) {
        return 32;
    }
    if (charCode > 126) {
        return 126;
    }
    return Math.floor(charCode);
}

function sumStringCharacterCodes(string) {
    let sum = 0;
    for (let i = 0; i < string.length; i++) {
        sum += string.charCodeAt(i);
    }
    return sum;
}

function phenotypeToString(phenotype) {
    let string = '';
    for (const charCode of phenotype.chars) {
        string += String.fromCharCode(charCode);
    }
    return string.trimEnd();
}

function generateInitialPopulation() {
    return [...Array(PopulationSize)].map(_=>createRandomPhenotype());
}

function mutationFunction(phenotype) {
    const { chars } = phenotype;

    for (const index in chars) {
        if (Math.random() < MutationChance) {
            chars[index] = generateRandomCharCode();
        }
    }

    return phenotype;
}

function crossoverFunction(a, b) {
    function cloneJSON(item) {
        return JSON.parse(JSON.stringify(item));
    }

    const x = cloneJSON(a), y = cloneJSON(b);

    for (const i in a.chars) {
        if (Math.random() <= 0.5) {
            x.chars[i] = b.chars[i];
            y.chars[i] = a.chars[i];
        }
    }
    return [ x , y ];
}

function fitnessFunction(phenotype) {
    const candidate = phenotypeToString(phenotype);
    const distance = levenshtein(candidate, Goal) * LevenshteinWeight;
    const characterDifference = Math.abs(sumStringCharacterCodes(Goal) - sumStringCharacterCodes(candidate));
    return Number.MAX_SAFE_INTEGER - distance - characterDifference;
}

function createRandomPhenotype() {
    var data = [];
    for (var i = 0; i < PhenotypeSize; i++) {
        data[i] = generateRandomCharCode();
    }
    return { chars : data };
}

var ga = GeneticAlgorithm({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: generateInitialPopulation(),
    populationSize: PopulationSize,
});

let best = '', i = 0;
while (best !== Goal) {
    ga.evolve()
    best = phenotypeToString(ga.best());
    console.log(best);
    i++;
}
console.log(`Took ${i} generations`);

