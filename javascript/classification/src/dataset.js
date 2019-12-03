const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const DATASET_SIZE = 1000;
const BATCH_SIZE = 10;
const data = require("./data");

// Try these to compare speed ?
// https://github.com/ya9do/tfjs-data-generator-sample
// https://github.com/tensorflow/tfjs-examples/blob/4a0f341b5e1e6e67682c5155cddab6def507ac6c/data-generator/index.js#L29
async function* dataGenerator() {
    let index = 0;
    while (index < DATASET_SIZE) {
        console.group("\nGenerating data");
        const gameData = await data.get(index, BATCH_SIZE);
        index += BATCH_SIZE;
        console.log("Yielding");
        console.groupEnd();
        yield { xs: gameData.inputs, ys: gameData.outputs };
    }
}
  
module.exports = {
    get: () => tf.data.generator(dataGenerator)
}