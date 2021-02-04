class SciErrorDialog extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciErrorDialog.template === null){
            SciErrorDialog.template = this._createTemplate(SciErrorDialog.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let content = SciErrorDialog.template.content.cloneNode(true);
        shadow.append(content);

        this.__dlg = shadow.querySelector("sci-dialog");
        this.__body = shadow.querySelector(".message-body");
        this.__detail = shadow.querySelector(".message-detail");
        this.__permanent = false;

        this.__dlg.onSubmit = function(data){
            if (self.permanent){
                location.href = "/";
            }
            return Promise.resolve();
        }
    }

    get body(){
        return this.__body.innerHTML;
    }

    set body(value){
        if (value === null){
            value = "";
        }
        this.__body.innerHTML = value;
    }

    get detail(){
        return this.__detail.innerHTML;
    }

    set detail(value){
        if (value === null){
            value = "";
        }

        this.__detail.innerHTML = value;

        let classes = this.__detail.classList;
        if (value && !classes.contains("on")){
            classes.add("on");
        }
        if (!value && classes.contains("on")){
            classes.remove("on");
        }
    }

    get permanent(){
        return this.__permanent;
    }

    set permanent(value){
        let permanent = !!value;
        this.__permanent = permanent;
        if (permanent){
            this.dlg.setAttribute("permanent", "");
        } else {
            this.dlg.removeAttribute("permanent");
        }
    }

    get dlg(){
        return this.__dlg;
    }
}

SciErrorDialog.observedAttributes = ["label"];

SciErrorDialog.__instance = null;
SciErrorDialog.openModal = function(message, title = null, detail = null, isPermanent = false){
    if (SciErrorDialog.__instance === null){
        document.body.insertAdjacentHTML("beforeend", "<sci-error-dialog></sci-error-dialog>");
        let dialogs = document.body.querySelectorAll("sci-error-dialog");
        SciErrorDialog.__instance = dialogs[dialogs.length - 1];
    }
    let instance = SciErrorDialog.__instance;
    if (title === null){
        instance.dlg.label = "Ошибка";
    } else {
        instance.dlg.label = title;
    }
    instance.body = message;
    instance.detail = detail;
    instance.permanent = isPermanent;
    return instance.dlg.openModal()
        .catch(() => {});
}