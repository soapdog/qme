import $ from 'jquery';
import _ from 'lodash';
import QuizModel from "./quiz-model";
import Player from "./player";


class Game {
    constructor() {
        console.log("Game model loaded");
    }

    start(data) {
        console.log("Game started");
        console.log("data", data);
        Player.displayInfo({name: "Andre Garzia"});
        this.displayQuestion({
            question: data.data[0].dica_frase
        });
    }

    displayQuestion(questionData) {
        $(".box-pergunta-txt").html(questionData.question + "Qual o nome do filme?");
    }

}

export default new Game();
