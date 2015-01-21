import $ from 'jquery'
import _ from "lodash"

class QuizModel {
    constructor() {
        console.log("Quiz model loaded");
        this.quizRemoteURL = "http://tcquefilme.vxcom.me/qme-v2/backend/getTodosOsFilmes";

        this.quizLocalURL = "/assets/data/filmes.json";
        this.quizURL = this.quizLocalURL;
    }

    load(callback) {

        console.log("loading model from remote...");

        $.ajax({
            dataType: "json",
            url: this.quizURL,
            success: (data) => {
                console.log("model loaded");
                console.log("data from model", data);
                this.quizData = data;
                console.log(this);
                callback(null,data);
            },
            error: (errObj, errText) => {
                console.log("error!", errText);
                console.log("obj", errObj);
                that.quizData = null;
                calbback(errText, null);
            }

        });

    }

    shuffleQuizData() {
        console.log("shuffle", this.quizData)
        if (this.quizData) {
            var data =  _.shuffle(this.quizData);
            console.log(data);
            return data
        } else {
            console.log("no quiz data");
            return false;
        }

    }


    getQuestionsForLevel(level) {
        var questions = this.shuffleQuizData();
        var key = "nivel-" + level;

        console.log("filtering for level:", key);

        if (questions) {
            var data = _.filter(questions, {"nivel_filme": key});
            console.log("all", questions);
            console.log("sub", data);
            return data.slice(0,10);
        } else {
            console.log("no questions");
        }

        return false;

    }
}

export default new QuizModel();
