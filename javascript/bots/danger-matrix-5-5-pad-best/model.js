const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const { ACTION_SIZE } = require("../game-constants");
const { DATA_SHAPE } = require("./data");

/*
*   Your model name. Saves and loads will use this.
*/
const modelName = "danger-matrix-5-5-pad-best";

/*
*   Define and compile your neural network.
*   The neural net provided below works, but you can improve it.
*   After you've done your gameStateToModelInputConverter, play with the network structure.
*/
function buildModel() {
    const model = tf.sequential();

    // Convolutions
    // S1
    model.add(tf.layers.conv2d({ inputShape: DATA_SHAPE, dataFormat: "channelsFirst", filters: 32, kernelSize: 5, activation: "relu", padding: "same" }));
    model.add(tf.layers.dropout({ rate : 0.15 }));

    model.add(tf.layers.conv2d({ dataFormat: "channelsFirst", filters: 32, kernelSize: 5, activation: "relu", padding: "same" }));
    model.add(tf.layers.dropout({ rate : 0.15 }));

    model.add(tf.layers.maxPooling2d({ dataFormat: "channelsFirst", poolSize: 2, strides: 2, padding: "valid" }))
    
    // S2
    model.add(tf.layers.conv2d({ dataFormat: "channelsFirst", filters: 64, kernelSize: 3, activation: "relu", padding: "same" }));
    model.add(tf.layers.dropout({ rate : 0.15 }));
    
    model.add(tf.layers.conv2d({ dataFormat: "channelsFirst", filters: 64, kernelSize: 3, activation: "relu", padding: "same" }));
    model.add(tf.layers.dropout({ rate : 0.15 }));

    model.add(tf.layers.maxPooling2d({ dataFormat: "channelsFirst", poolSize: 2, strides: 2, padding: "valid" }))
    
    // S3
    model.add(tf.layers.conv2d({ dataFormat: "channelsFirst", filters: 128, kernelSize: 3, activation: "relu", padding: "same" }));
    model.add(tf.layers.dropout({ rate : 0.15 }));

    model.add(tf.layers.conv2d({ dataFormat: "channelsFirst", filters: 128, kernelSize: 3, activation: "relu", padding: "same" }));
    model.add(tf.layers.dropout({ rate : 0.15 }));

    // Classification
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 1024, activation: "relu" }));

    model.add(tf.layers.dense({ units: ACTION_SIZE, activation: "softmax" }));

    /*
    *   If you do not know what this is, you don't need to change it or know what it does.
    *   It's going to be pretty good for this kind of machine learning.
    */
    model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy", "recall"]
    });

    return model;
}

module.exports = {
    modelName,
    buildModel
};