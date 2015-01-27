
function bindStartGameButton() {
	$('.abrir-jogo').off().on("click", function () {
		console.log("Começando o jogo...");
		bindResposta()
		bindFinal()
		bindRemoveFinal();
		bindRemoveMask();
		initializeLevel(gameState.game.currentLevel);
		displayCurrentQuestion();
	});
}



// Bind links
function bindLinks() {
	$("[data-link]").off().on('click', function () {
		var id = $(this).attr('data-url');
		console.log("link to:", id);

		content = $(id).html();
		$('.container').html(content);
		bindAba();
		$('body').toggleClass('off-canvas-active');
	});
}


function bindMenu() {
	// Gerenciamento do menu
	$('.item-menu').off().on('click', function (event) {
		var id = $(this).attr('href');
		var content = $(id).html();
		var template = Handlebars.compile(content);
		var html = template(gameState);

		event.preventDefault();
		event.stopPropagation();

		$('.container').html(html);
		bindAba();
		bindLinks();
		bindStartGameButton();
		fixBrokenAvatarPics();
		$('body').toggleClass('off-canvas-active');
	});

	// Ranking
	$(".item-menu.icon-ranking").off().on('click', function (event) {
		pegaRankingFB(function(){
			var id = "#ranking";
			var content = $(id).html();
			var template = Handlebars.compile(content);
			var html = template(gameState);

			event.preventDefault();
			event.stopPropagation();

			$('.container').html(html);
			bindAba();
			bindLinks();
			bindStartGameButton();
			fixBrokenAvatarPics();
			$('body').toggleClass('off-canvas-active');
		});
	});


	// Remove drawer se clicar em qualquer lugar do container
	$('.container').off().on('click', function(){
		if( $('body').hasClass('off-canvas-active')){
			$('body').toggleClass('off-canvas-active');
		}
	});

	// Hamburguer menu
	$('.open-menu').off().on('click', function(){
		$('body').toggleClass('off-canvas-active');
	});

	// FB button
	$("#fb-button").off().on('click', function() {
		login();
	});



}

// Bind tab panel
function bindAba(){
	$('.aba-item').off().on("click", function(){
		$('.comojogar-aba').find('.aba-item').removeClass('aba-active');
		aba = $(this).index();
		move_to = aba * 100;
		val = move_to;
		left = '-'+ val + '%'
		$('.comojogar-content').css('left', left);
		$(this).addClass('aba-active')
	});

}

function bindUserInfo() {
	var source = $("#inicio").html();
	var template = Handlebars.compile(source);
	var fbdata = localStorage.getItem("fbdata");

	if (fbdata) {
		fbdata = JSON.parse(fbdata);
		gameState.player.uid = fbdata.id;
		gameState.player.name = fbdata.first_name + " " + fbdata.last_name;
	}

	var html = template(gameState);

	$(".container").html(html);
	bindAba();
	bindLinks();
	bindStartGameButton();
	fixBrokenAvatarPics();
	$('body').removeClass('off-canvas-active');
	goBackToContainer();


	// Como jogar do FB
	$(".btn-como-jogar").off().on("click", function() {
		var id = "#como-jogar";
		var content = $(id).html();
		var template = Handlebars.compile(content);
		var html = template(gameState);

		event.preventDefault();
		event.stopPropagation();

		$('.container').html(html);
		bindAba();
		bindLinks();
		bindStartGameButton();
	});

}

function bindResposta(){
	$('.resposta-txt').off().on("click", function(){
		$('body').addClass('game-mask-active');
	})
}
function bindFinal(){
	//$('.game-actions').off().on("click", function(){
	//	$('body').addClass('final-active');
	//});
}
function bindRemoveFinal(){
	$('.final-buttons').off().on("click", function(){
		$('body').removeClass('final-active');
	});

	$(".final-avancar").off().on("click", function() {
		console.log("avançar...");
		$('body').removeClass('final-active');
		displayCurrentQuestion();
	});

	$(".final-menu").off().on("click", function() {
		console.log("indo pro menu...");
		$('body').removeClass('final-active');
		bindUserInfo();
	});

	$(".final-facebook").off().on("click", function() {
		console.log("ir pro facebook...");
		shareOnFB();
		$('body').removeClass('final-active');
	});
}

function bindRemoveMask(){
	$('.game-mask').off().on("click", function(){
		$('body').removeClass('game-mask-active');
	});
}

function loadQuizData(callback) {

	var highScore = localStorage.getItem("highScore");
	var badges = localStorage.getItem("badges");
	var currentlevel = parseInt(localStorage.getItem("currentLevel"));

	if (!highScore) {
		gameState.player.highScore = 0;
	} else {
		gameState.player.highScore = highScore;
	}

	if (badges) {
		gameState.player.badges = JSON.parse(badges);
	}

	if (currentlevel) {
		console.log(currentlevel);
		if (currentlevel >= 0 && currentlevel <= 8) {
			gameState.game.currentLevel = currentlevel;
		} else {
			gameState.game.currentLevel = 0;
		}

	} else {
		gameState.game.currentLevel = 0;
	}



	console.log("trying to load JSON...");

	var path = window.location.href.replace('index.html', '');

	$.getJSON(path + "assets/data/filmes.json", function(data) {
		gameState.quizData = data;
		callback();
	});
}

function getQuestionsForLevel(level) {
	var key = "nivel-" + level;

	var questions = _.filter(gameState.quizData, {nivel_filme: key});

	return _.shuffle(questions).slice(0,10); // ATTN: return is already shuffled
}

function initializeGameRounds() {
	gameState.rounds = [];
	for(var i = 1; i <= 10; i++) {
		var temp = getQuestionsForLevel(i);
		gameState.rounds.push(temp);
	}

	initializeLevel(gameState.game.currentLevel);
}

function goBackToContainer() {
	$('body').removeClass('off-canvas-active');
	$('body').removeClass('final-active');
	$('body').removeClass('game-mask-active');
	$('body').removeClass('game-active');

}

function displayScreen(screen, obj) {
	var source = $(screen).html();
	var template = Handlebars.compile(source);
	var data = obj || gameState;
	var html = template(data);

	$('.container').html(html);
	bindAba();
	bindLinks();
	goBackToContainer();

}

function bindTelecinePlayLinks() {
	var source = $("#links-for-telecine-play").html();
	var template = Handlebars.compile(source);
	var html;

	gameState.links = _.filter(gameState.rounds[gameState.game.currentLevel], function(film){
		if (film.link_play !== "") {
			return true;
		} else {
			return false;
		}
	});



	console.log("Fetching telecine play links for level: " + gameState.game.currentLevel);
	console.log("links:", gameState.links);

	//gameState.links = _.filter(gameState.links, {})

	html = template(gameState);

	if (gameState.links.length > 0) {
		$(".telecine-box").html(html);
		$(".telecine-box").show();
	} else {
		$(".telecine-box").hide();
	}

}

function displayFinalScreen() {
	var roundScore = calculateScore();
	var correct = gameState.round.correctAnswers;

	gameState.player.score += roundScore;

	if (gameState.player.score > gameState.player.highScore) {
		gameState.player.highScore = gameState.player.score;
		localStorage.setItem("highScore", gameState.player.score);
	}

	bindTelecinePlayLinks();
	awardBadges();

	$(".total-pontos").html(gameState.player.score);
	$("#correct-answers-display").html(correct);


	$('body').addClass('final-active');

	if (gameState.player.uid) {
		saveScoreToFB(gameState.player.score);
	}

	if (gameState.game.currentLevel < 9) {
		if (gameState.round.wrongAnswers <= 3) {
			initializeLevel(gameState.game.currentLevel + 1);

			localStorage.setItem("currentLevel", gameState.game.currentLevel);

			$(".txt-proximo-nivel").html("Você passou para o próximo nível. Avance para continuar o desafio.");
		} else {
			gameState.player.score -= roundScore;
			initializeLevel(gameState.game.currentLevel);

			localStorage.setItem("currentLevel", gameState.game.currentLevel);

			$(".txt-proximo-nivel").html("Infelizmente você não passou para o próximo nível. Avance tentar novamente esse desafio.");
		}
	} else {
		gameState.player.score = 0;
		initializeLevel(0);
	}

}

function powerUpSkip() {
	if (gameState.round.availablePowerUps.skip > 0) {
		console.log("Using power up: skip");
		gameState.round.correctAnswers++;
		gameState.round.powerUps++;
		gameState.round.availablePowerUps.skip = 0;
		$(".game-actions.pular > .num").html("0");
		displayNextQuestion();
	} else {
		console.log("Can't use power up.");
	}
}

function powerUpTip() {
	if (gameState.round.availablePowerUps.tip > 0) {
		console.log("Using power up: tip");
		gameState.round.availablePowerUps.tip = 0;
		gameState.round.powerUps++;


		var array = ["dica_curiosidade", "dica_frase", "dica_imagem"];
		var arraySemPergunta = _.remove(array, function(elem) {
			if (elem == gameState.question.selectedQuestionKey) {
				return false;
			}

			return true;
		})
		var selectedQuestionKey = _.shuffle(arraySemPergunta)[0];

		var tip = gameState.question.film[selectedQuestionKey];

		if (selectedQuestionKey == "dica_imagem") {
			//var path = window.location.href.replace('index.html', '').replace("#","");
			var path = gameState.host;


			//gameState.question.question = "<img style='max-width: 100%;' src='https://tcquefilme.vxcom.me/qme/admin/internas/cadastro/" +gameState.question.question + "'/>"
			tip = "<img style='max-width: 100%;' src='" + path + "assets/img/" +tip + "'/>"

		}

		console.log("tip:",tip);

		$(".box-pergunta-txt").append("<br><b>Dica:</b><br>" + tip);


		$(".game-actions.dica > .num").html("0");


	} else {
		console.log("Can't use power up.");
	}
}

function powerUpBomb() {

	if (gameState.round.availablePowerUps.bomb > 0) {
		console.log("Using power up: bomb");
		gameState.round.availablePowerUps.bomb = 0;
		gameState.round.powerUps++;

		$(".game-actions.bomba > .num").html("0");

		$("[data-bomb]").addClass("resposta-errada");


	} else {
		console.log("Can't use power up.");
	}
}

function initializeLevel(level) {
	gameState.game.currentQuestion = 0;
	gameState.round.correctAnswers = 0;
	gameState.round.wrongAnswers = 0;
	gameState.round.powerUps = 0;
	gameState.round.availablePowerUps = {
		tip: 1,
		bomb: 1,
		skip: 1
	};
	gameState.game.currentLevel = level;

	if (level == 0) {
		gameState.game.score = 0;
	}

	gameState.rounds[level] = getQuestionsForLevel(level);
}

function calculateScore() {
	var score  = gameState.round.correctAnswers * 10;

	if (gameState.round.wrongAnswers == 0) {
		score = score * 1.5;
	}

	if (gameState.round.wrongAnswers == 1) {
		score = score * 1.25;
	}

	if (gameState.round.wrongAnswers == 2) {
		score = score * 1.1;
	}

	if (gameState.round.powerUps == 0) {
		score = score * 1.5;
	}

	if (gameState.round.powerUps == 1) {
		score = score * 1.25;
	}

	if (gameState.round.powerUps == 2) {
		score = score * 1.1;
	}

	return Math.round(score,0);
}

function awardBadges() {
	if (gameState.round.wrongAnswers <= 3) {
		gameState.player.badges[gameState.game.currentLevel] = true;

		localStorage.setItem("badges", JSON.stringify(gameState.player.badges));
	}
}

function updateTimer() {
	var now = new Date().getTime();
	var start = gameState.timer.start;
	var elapsed = Math.round((now - start) / 1000, 0);

	if (elapsed >= 30) {
		// time over!
		gameState.round.wrongAnswers++;
		displayNextQuestion();
	} else {
		var width = 100 - Math.round((100 * elapsed) / 30, 0);

		$(".tempo").width(width + "%");
	}
}

function displayNextQuestion() {

	// Stop timer
	clearInterval(gameState.timer.pid);
	gameState.timer.pid = null;

	gameState.game.currentQuestion++;

	if (gameState.game.currentQuestion >= 10) {

		setTimeout(displayFinalScreen, 500);
	} else {
		setTimeout(displayCurrentQuestion, 500);
	}
}

function displayCurrentQuestion() {
	var source = $("#question-display").html();
	var template = Handlebars.compile(source);
	var html;
	var answers = [];
	var currentFilm = gameState.rounds[gameState.game.currentLevel][gameState.game.currentQuestion];

	var selectedQuestionKey = _.shuffle(["dica_curiosidade", "dica_frase", "dica_imagem"])[0];

	gameState.question.selectedQuestionKey = selectedQuestionKey;

	function wrongAnswer() {
		console.log("Wrong!");
		$(this).addClass("resposta-errada").removeClass("resposta-certa");
		var obj = {text: $(this).attr("data-answer")};
		var source = $("#answer-wrong").html();
		var template = Handlebars.compile(source);
		var html = template(obj);

		gameState.round.wrongAnswers +=1 ;

		$(this).html(html);

		displayNextQuestion();
	}

	function correctAnswer() {
		console.log("Correct!");
		$(this).addClass("resposta-certa").removeClass("resposta-errada");
		var obj = {text: $(this).attr("data-answer")};
		var source = $("#answer-correct").html();
		var template = Handlebars.compile(source);
		var html = template(obj);

		gameState.round.correctAnswers += 1;

		$(this).html(html);

		displayNextQuestion();
	}


	gameState.question.question =  currentFilm[selectedQuestionKey];
	gameState.question.film = currentFilm;

	//var path = window.location.href.replace('index.html', '').replace("#","");
	var path = gameState.host;


	if (selectedQuestionKey == "dica_imagem") {
		//gameState.question.question = "<img style='max-width: 100%;' src='https://tcquefilme.vxcom.me/qme/admin/internas/cadastro/" +gameState.question.question + "'/>"

		gameState.question.question = "<img style='max-width: 100%;' src='" + path + "assets/img/" +gameState.question.question + "'/><br>"

		console.log("path:" + 	gameState.question.question);
	}

	answers.push({
		text: currentFilm.nome_portugues,
		correct: true
	});

	for(var i = 0; i <= 2; i++) {

		var x = _.random(0, gameState.quizData.length);

		try {
			answers.push({
				correct: false,
				text: gameState.quizData[x].nome_portugues
			});
		} catch(n) {
			// something odd... try again...
			console.log("Something odd with item: " + x + " " + gameState.quizData[x]);
			i--;
		}
	}

	answers = _.shuffle(answers);

	gameState.question.answers = answers;


	html = template(gameState);

	$("#question-container").html(html);

	// bind answer options

	var bombedQuestions = 2;

	for(var j = 0; j <= 3; j++) {
		var key = "#resposta-" + (j+1);
		var el = $(key);

		if (answers[j].correct) {
			// resposta certa
			el.off().on("click", correctAnswer);

		} else {
			// resposta errada
			el.off().on("click", wrongAnswer);

			if (bombedQuestions > 0) {
				el.attr("data-bomb", true);
				bombedQuestions--;
			}

		}
	}

	// bind PowerUps
	$(".game-actions.pular").off().on("click", powerUpSkip);
	$(".game-actions.bomba").off().on("click", powerUpBomb);
	$(".game-actions.dica").off().on("click", powerUpTip);



	// Timer handling
	gameState.timer.start = new Date().getTime();
	gameState.timer.pid = setInterval(updateTimer, 300);
	$(".tempo").width( "100%");



	$('body').addClass('game-active');

	$('body').removeClass('game-mask-active');

	bindResposta()
	bindFinal()
	bindRemoveFinal();
	bindRemoveMask();

	console.log(JSON.stringify(gameState.round));

}

function shareOnFB() {
	var link = "https://www.facebook.com/dialog/share?"

	link += "app_id=145634995501895";
	link += "&display=popup&caption=" +  encodeURIComponent("Venha jogar");
	link += "&link=" + encodeURIComponent("https://apps.facebook.com/que-filme-e-esse/");
	link += "&redirect_uri=" + encodeURIComponent("https://apps.facebook.com/que-filme-e-esse/");

	console.log(link);

	window.open(link);
}


// Handebars helpers

Handlebars.registerHelper("levelName", function(level) {
	return gameState.levels[level];
});

Handlebars.registerHelper('hasBadge', function(badgeNum, options) {
	if(gameState.player.badges[badgeNum-1]) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});


Handlebars.registerHelper('plusone', function(text) {



	var result = parseInt(text) + 1;

	return new Handlebars.SafeString(result);
});

// Facebook stuff

function login() {
	openFB.login(function (){
		console.log("callback from login")
		getInfo();
	}, {scope: "email,publish_actions"})
}

function getInfo() {
	openFB.api({
		path: '/me',
		success: function(data) {

			// saving.

			if (data.id) {

				gameState.player.uid = data.id;
				gameState.player.name = data.first_name + " " + data.last_name;

				data = JSON.stringify(data)
				console.log(data);

				localStorage.setItem("fbdata", data);
			} else {
				localStorage.removeItem("fbdata");
			}

			bindUserInfo();
		},
		error: errorHandler});
}

function share() {
	openFB.api({
		method: 'POST',
		path: '/me/feed',
		params: {
			message: 'Testing Facebook APIs'
		},
		success: function(data) {
			alert('the item was posted on Facebook');
		},
		error: errorHandler});
}

function revoke() {
	openFB.revokePermissions(
		function() {
			alert('Permissions revoked');
		},
		errorHandler);
}

function errorHandler(error) {
	alert(error.message);
}

function saveScoreToFB(score) {
	if (!gameState.player.uid) {
		console.log("NOT LOGGED!");
		return false;
	}

	$.getJSON("http://tcquefilme.vxcom.me/qme-v2/backend/gravarPontos", {
		uid: gameState.player.uid,
		pontos: score,
		success: function(data) {
			console.log("FB GRAVA PONTO. UID: " + gameState.player.uid);
			console.log(JSON.stringify(data));
		}
	})
}

function pegaRankingFB(callback) {
	if (!gameState.player.uid) {
		console.log("NOT LOGGED!");
		return false;
	}

	$.ajax({
			url:"http://tcquefilme.vxcom.me/qme-v2/backend/getRanking",
			dataType: 'json',
			success: function(data) {
				console.log("RANKING. UID: " + gameState.player.uid);
				console.log(JSON.stringify(data));

				gameState.game.ranking = data;

				callback();
			},
			error: function(error) {
				console.log("YELP!!!!! ERROR!!!!");

				alert("Não foi possível pegar o ranking pois você não está conectado na internet.");
			}
		}
	)
}

function fixBrokenAvatarPics() {
	$('img').error(function(){
		$(this).hide();
	});
}
