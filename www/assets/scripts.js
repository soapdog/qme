

function bindStartGameButton() {
	$('.abrir-jogo').on("click", function () {
		$('body').addClass('game-active');
		bindResposta()
		bindFinal()
		removeFinal();
		removeMask();
	});
}



// Bind links
function bindLinks() {
	$("[data-link]").on('click', function () {
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
	$('.item-menu').on('click', function () {
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
	$('.container').on('click', function(){
		if( $('body').hasClass('off-canvas-active')){
			$('body').toggleClass('off-canvas-active');
		}
	});

	// Hamburguer menu
	$('.open-menu').on('click', function(){
		$('body').toggleClass('off-canvas-active');
	});

}

// Bind tab panel
function bindAba(){
	$('.aba-item').on("click", function(){
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
	$('.resposta-txt').on("click", function(){
		$('body').addClass('game-mask-active');
	})
}
function bindFinal(){
	$('.game-actions').on("click", function(){
		$('body').addClass('final-active');
	});
}
function removeFinal(){
	$('.final-buttons').on("click", function(){
		$('body').removeClass('final-active');
	});
}
function removeMask(){
	$('.game-mask').on("click", function(){
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
	}

	function correctAnswer() {
		console.log("Correct!");
	}


	gameState.question ={
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

		if (answers[j].correct) {
			// resposta certa
			$(key).on("click", correctAnswer);

		} else {
			// resposta errada
			$(key).on("click", wrongAnswer);

		}
	}

	$('body').addClass('game-active');
	bindResposta()
	bindFinal()
	removeFinal();
	removeMask();

}