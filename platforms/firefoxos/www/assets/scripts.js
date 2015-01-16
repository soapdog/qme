$('.open-menu').on('click', function(){
	$('body').toggleClass('off-canvas-active');
})
$('.abrir-jogo').on("click", function(){
	$('body').addClass('game-active');
	bindResposta()
	bindFinal()
	removeFinal();
	removeMask();
})


$('.container').on('click', function(){
	if( $('body').hasClass('off-canvas-active')){
		$('body').toggleClass('off-canvas-active');
	}
})

$('.item-menu').on('click', function(){
	var id = $(this).attr('href');
	content = $(id).html();
	$('.container').html(content);
	bindAba();
	$('body').toggleClass('off-canvas-active');
});

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