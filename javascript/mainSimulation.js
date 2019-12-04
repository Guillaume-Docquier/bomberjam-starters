const { startSimulation } = require('bomberjam-backend');
const { ClassifierBot } = require("./classification/bot");
const { RandomBot } = require("./dumb/bot");

// You can pass an argument for the number of games to play.
// Defaults to 1.
simulateGame(process.argv[2] || 1);

async function simulateGame(numberOfGames) {
    console.log("Creating bots");
    const bots = await createBots();

    console.log("Playing", numberOfGames, "games");
    const scores = {};
    const averageScores = {};
    const saveGamelog = true;
    for (let game = 1; game <= numberOfGames; game++) {
        const finalState = play(bots, saveGamelog);
        crunchScoreStats(finalState, scores, averageScores, game, numberOfGames);
        console.log("Game", game);
    }

    console.log("Scores:");
    scores["Average"] = averageScores;
    console.table(scores);
}

async function createBots() {
    const modelFolderPath = "./trained-models/cnn-3x3-2d-all-1000"
    const bots = [
        new ClassifierBot(modelFolderPath),
        new ClassifierBot(modelFolderPath),
        new ClassifierBot(modelFolderPath),
        new ClassifierBot(modelFolderPath)
    ];

    for (const bot of bots) {
        if (bot.init) {
            await bot.init();
        }
    }

    return bots;
}

function play(bots, saveGamelog) {
    const simulation = startSimulation(bots, saveGamelog);
    while (!simulation.isFinished) {
        simulation.executeNextTick();
    }

    return simulation.currentState;
}

function crunchScoreStats(finalState, scores, averageScores, currentGame, gamesToPlay) {
    const players = finalState.players;
    const score = {};
    for (const playerId in players) {
        score[playerId] = players[playerId].score;
        if (!averageScores[playerId]) {
            averageScores[playerId] = 0;
        }

        averageScores[playerId] += score[playerId] / gamesToPlay;
    }
    scores[`Game ${currentGame}`] = score;
}
