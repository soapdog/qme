var gameState = {
    host: window.location.href.split("/").slice(0,3).join("/") + "/",
    player: {
        name: "Andre Garzia",
        highScore: 82,
        score: 0,
        hours: 19,
        badges: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ]
    },
    game: {
        currentLevel: 0,
        currentQuestion: 0
    },
    round: {
        correctAnswers: 0,
        wrongAnswers: 0,
        powerUps: 0
    },
    levels: [
        "Pipoqueiro",
        "Lanterninha",
        "Camera Man",
        "Bilheteiro",
        "Roteirista",
        "Produtor",
        "Diretor",
        "Astro de Cinema"
    ],
    question: {},
    timer: {}
};

if (~window.location.href.indexOf("android")) {
    console.log("Platform is Android, switching host");
    gameState.host = "file:///android_asset/www/";
}

function initialize() {
    bindMenu();
    initializeGameRounds();
    bindUserInfo();
}


loadQuizData(function() {
    initialize(); // boot!
});

console.log("init lodaded");
console.log("href: " + window.location.href);
console.log("host: " + gameState.host);