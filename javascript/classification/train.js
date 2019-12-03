const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const data = require("./src/data");
const dataset = require("./src/dataset");
const model = require("./src/model");

async function main() {
    const classifier = model.make();
    const trainDataset = dataset.get();
    
    console.group("\nFitting model |", tf.memory().numTensors, "tensors");
    let accuracyMetricIndex = null;
    const fitResult = await classifier.fitDataset(trainDataset, {
        epochs: 10,
        callbacks: {
            onEpochEnd: async (epoch, log) => {
                console.log(`Epoch ${epoch}, ${JSON.stringify(log)} | ${tf.memory().numTensors} tensors`);
            },
        }
    });
    
    if (!accuracyMetricIndex) {
        accuracyMetricIndex = fitResult.params.metrics.indexOf("acc");
    }

    classifier.save("file://./bomberjam-cnn.tfm");
    console.groupEnd();

    console.group("\nEvaluating model");
    const test = await data.get(2000, 25);
    const evalResult = classifier.evaluate(test.inputs, test.outputs, {
        batchSize: test.inputs.length
    });
    const accuracy = await evalResult[accuracyMetricIndex].data();
    console.log(`Test accuracy: ${(accuracy * 100).toFixed(2)}%`);
    console.groupEnd();
}

main();