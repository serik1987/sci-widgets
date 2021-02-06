class SciQuestionDialog extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciQuestionDialog.template === null){
            SciQuestionDialog.template = this._createTemplate(SciQuestionDialog.templateText);
        }

        let content = SciQuestionDialog.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__dlg = shadow.querySelector("sci-dialog");
        this.__responseBox = shadow.querySelector("input");
        this.__bodyBox = shadow.querySelector(".message-body");
        this.__okBox = shadow.querySelector("[name=ok]");
        this.__cancelBox = shadow.querySelector("[name=cancel]");

        this.__okBox.addEventListener("click", event => {
            self.response = "yes";
            self.dlg.submit();
        });

        this.__cancelBox.addEventListener("click", event => {
            self.response = "no";
            self.dlg.submit();
        });
    }

    get body(){
        return this.__bodyBox.innerHTML;
    }

    set body(value){
        this.__bodyBox.innerHTML = value;
    }

    get cancelLabel(){
        return this.__cancelBox.label;
    }

    set cancelLabel(value){
        this.__cancelBox.label = value;
    }

    get dlg(){
        return this.__dlg;
    }

    get okLabel(){
        return this.__okBox.label;
    }

    set okLabel(value){
        this.__okBox.label = value;
    }

    get response(){
        return this.__responseBox.value;
    }

    set response(value){
        this.__responseBox.value = value;
    }

}

SciQuestionDialog.__instance = null;
SciQuestionDialog.openModal = function(message, title = null, buttonLabels = null){
    if (title === null){
        title = "Подтверждение";
    }
    if (buttonLabels === null){
        buttonLabels = ["Да", "Нет"];
    }

    if (SciQuestionDialog.__instance === null){
        document.body.insertAdjacentHTML("beforeend", "<sci-question-dialog></sci-question-dialog>");
        let dialogs = document.querySelectorAll("sci-question-dialog");
        SciQuestionDialog.__instance = dialogs[dialogs.length - 1];
    }
    let instance = SciQuestionDialog.__instance;

    instance.dlg.label = title;
    instance.body = message;
    instance.okLabel = buttonLabels[0];
    instance.cancelLabel = buttonLabels[1];

    instance.dlg.openModal()
        .then(result => {
            if (result.response !== "yes"){
                throw new TypeError("sci-question-dialog: the user said NO");
            }
        });

}