var gameState = {
    player: {
        name: "Andre Garzia",
        highScore: "82",
        score: "25",
        hours: "19"
    },
    game: {
        currentLevel: 0,
        currentQuestion: 0
    }
};

function initialize() {
    bindMenu();
    bindStartGameButton();
    initializeGameRounds();
}


loadQuizData(function() {
    initialize(); // boot!
});