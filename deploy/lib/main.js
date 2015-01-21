import QuizModel from "./quiz-model";
import Game from "./game";

QuizModel.load(function(err, data){
    var quiz = QuizModel.getQuestionsForLevel(1);



    Game.start({level: 1, data: quiz});
});

export default {}
