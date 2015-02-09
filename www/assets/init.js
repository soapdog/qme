var gameState = {
    host: window.location.href.split("/").slice(0,3).join("/") + "/",
    facebook: {
        appId: "487389214612612" // Que Filme é Esse
        //appId: "115571411859218" // Meo.
    },
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

document.addEventListener("deviceready", function() {

    console.log("Cordova Device Ready Fired!");


    if (~window.location.href.indexOf("android")) {
        console.log("Platform is Android, switching host");
        gameState.host = "file:///android_asset/www/";
    } else {
        gameState.host = "";
        StatusBar.overlaysWebView(false);
        StatusBar.styleDefault();
    }

    function initialize() {
        bindMenu();
        initializeGameRounds();
        bindUserInfo();
    }


    loadQuizData(function() {
        console.log("Initializing!!!");
        initialize(); // boot!

        // fb

        openFB.init({appId: gameState.facebook.appId, tokenStore: window.localStorage});

    });

    console.log("init lodaded");
    console.log("href: " + window.location.href);
    console.log("host: " + gameState.host);

}, false);
