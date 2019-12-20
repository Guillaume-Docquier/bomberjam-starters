const baseModel = require("./base-model");
const dangerMatrix33Pad = require("./danger-matrix-3-3-pad");
const dangerMatrix55Pad = require("./danger-matrix-5-5-pad");
const dangerMatrix55PadBest = require("./danger-matrix-5-5-pad-best");
const dangerMatrix33DeepMlp = require("./danger-matrix-3-3-deep-mlp");
const dangerMatrix33WideMlp = require("./danger-matrix-3-3-wide-mlp");
const dangerMatrix55PadKL = require("./danger-matrix-5-5-pad-kl");

module.exports = {
    //bot: dangerMatrix55PadKL,
    bot: dangerMatrix55Pad,
    //bot: dangerMatrix33DeepMlp,
    botsToCompare: [dangerMatrix33Pad, dangerMatrix55Pad, dangerMatrix33DeepMlp, dangerMatrix55PadBest]
}