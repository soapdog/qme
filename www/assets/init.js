var gameState = {
    player: {
        name: "Andre Garzia",
        highScore: 82,
        score: 0,
        hours: 19
    },
    game: {
        currentLevel: 0,
        currentQuestion: 0
    },
    round: {
        correctAnswers: 0,
        wrongAnswers: 0,
        powerUps: 0
    }
};

function initialize() {
    bindMenu();
    initializeGameRounds();
    bindUserInfo();
}


loadQuizData(function() {
    initialize(); // boot!
});