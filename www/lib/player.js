import $ from 'jquery';
import _ from "lodash";
import handlebars from "handlebars";

class Player {

    constructor() {
        this.templateInicioSource = $("#inicio");
        this.templateInicio = handlebars.compile(this.templateInicioSource);
    }


    displayInfo(data) {
        var html = this.templateInicio(data);

        $("#container").html(html);

    }
}

export default new Player();


