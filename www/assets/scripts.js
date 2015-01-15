
Handlebars.registerHelper('plusone', function(text) {

	var result = text + 1;

	return new Handlebars.SafeString(result);
});

function bindStartGameButton() {
	$('.abrir-jogo').off().on("click", function () {
		bindResposta()
		bindFinal()
		bindRemoveFinal();
		bindRemoveMask();
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
	$('.item-menu').off().on('click', function () {
		var id = $(this).attr('href');
		var content = $(id).html();
		var template = Handlebars.compile(content);
		var html = template(gameState);
		$('.container').html(html);
		bindAba();
		bindLinks();
		$('body').toggleClass('off-canvas-active');
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

function bindUserInfo(user) {
	var source = $("#inicio").html();
	var template = Handlebars.compile(source);
	var html = template(user);

	$(".container").html(html);
	bindAba();
	bindLinks();
	$('body').removeClass('off-canvas-active');
}

function bindResposta(){
	$('.resposta-txt').off().on("click", function(){
		$('body').addClass('game-mask-active');
	})
}
function bindFinal(){
	$('.game-actions').off().on("click", function(){
		$('body').addClass('final-active');
	});
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
		displayScreen("#inicio");
	});

	$(".final-facebook").off().on("click", function() {
		console.log("ir pro facebook...");
		$('body').removeClass('final-active');
	});
}

function bindRemoveMask(){
	$('.game-mask').off().on("click", function(){
		$('body').removeClass('game-mask-active');
	});
}

function loadQuizData(callback) {
	$.getJSON("/assets/data/filmes.json", function(data) {
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

	initializeLevel(0);
}

function goBackToContainer() {
	$('body').removeClass('off-canvas-active');
	$('body').removeClass('final-active');
	$('body').removeClass('game-mask-active');
	$('body').removeClass('game-active');

}

function displayScreen(screen, data) {
	var source = $(screen).html();
	var template = Handlebars.compile(source);
	var html = template(data);

	$('.container').html(html);
	bindAba();
	bindLinks();
	goBackToContainer();

}

function displayFinalScreen() {
	var score = calculateScore();
	var correct = gameState.round.correctAnswers;

	$(".total-pontos").html(score);
	$("#correct-answers-display").html(correct);


	$('body').addClass('final-active');

	initializeLevel(gameState.game.currentLevel + 1);

}

function initializeLevel(level) {
	gameState.game.currentQuestion = 0;
	gameState.round.correctAnswers = 0;
	gameState.round.wrongAnswers = 0;
	gameState.round.powerUps = 0;
	gameState.game.currentLevel = level;
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

	return score;
}

function displayNextQuesiton() {
	gameState.game.currentQuestion++;

	if (gameState.game.currentQuestion >= 10) {

		setTimeout(displayFinalScreen, 1000);
	} else {
		setTimeout(displayCurrentQuestion, 1000);
	}
}

function displayCurrentQuestion() {
	var source = $("#question-display").html();
	var template = Handlebars.compile(source);
	var html;
	var answers = [];
	var currentFilm = gameState.rounds[gameState.game.currentLevel][gameState.game.currentQuestion];

	var selectedQuestionKey = _.shuffle(["dica_curiosidade", "dica_frase", "dica_imagem"])[1];

	function wrongAnswer() {
		console.log("Wrong!");
		$(this).addClass("resposta-errada").removeClass("resposta-certa");
		var obj = {text: $(this).attr("data-answer")};
		var source = $("#answer-wrong").html();
		var template = Handlebars.compile(source);
		var html = template(obj);

		gameState.round.wrongAnswers +=1 ;

		$(this).html(html);

		displayNextQuesiton();
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

		displayNextQuesiton();
	}


	gameState.question = {
		question: currentFilm[selectedQuestionKey]
	};

	if (selectedQuestionKey == "dica_imagem") {
		gameState.question.question = "<img style='max-width: 100%;' src='https://tcquefilme.vxcom.me/qme/admin/internas/cadastro/" +gameState.question.question + "'/>"
	}

	answers.push({
		text: currentFilm.nome_portugues,
		correct: true
	});

	for(var i = 0; i <= 2; i++) {

		var x = _.random(0, gameState.quizData.length);

		answers.push({
			correct: false,
			text: gameState.quizData[x].nome_portugues
		});
	}

	answers = _.shuffle(answers);

	gameState.question.answers = answers;


	html = template(gameState);

	$("#question-container").html(html);

	// bind answer options

	for(var j = 0; j <= 3; j++) {
		var key = "#resposta-" + (j+1);
		var el = $(key);

		if (answers[j].correct) {
			// resposta certa
			el.off().on("click", correctAnswer);

		} else {
			// resposta errada
			el.off().on("click", wrongAnswer);

		}
	}

	$('body').addClass('game-active');

	$('body').removeClass('game-mask-active');

	bindResposta()
	bindFinal()
	bindRemoveFinal();
	bindRemoveMask();

	console.log(JSON.stringify(gameState.round));

}

// TODO: Fix move between rounds and score.