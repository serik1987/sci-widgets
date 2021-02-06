class SciMessageDialog extends SciWidget{

    constructor(){
        super();

        if (SciMessageDialog.template === null){
            SciMessageDialog.template = this._createTemplate(SciMessageDialog.templateText);
        }

        let content = SciMessageDialog.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__dlg = shadow.querySelector("sci-dialog");
        this.__body = shadow.querySelector(".message-body");
    }

    get body(){
        return this.__body.innerHTML;
    }

    set body(value){
        this.__body.innerHTML = value;
    }

    get dlg(){
        return this.__dlg;
    }

    get label(){
        return this.__dlg.label;
    }

    set label(value){
        this.__dlg.label = value;
    }
    
}

SciMessageDialog.__instance = null;

SciMessageDialog.openModal = function(message, title=null){
    if (SciMessageDialog.__instance === null){
        document.body.insertAdjacentHTML("beforeend", "<sci-message-dialog></sci-message-dialog>");
        let dialogs = document.querySelectorAll("sci-message-dialog");
        SciMessageDialog.__instance = dialogs[dialogs.length - 1];
    }
    let instance = SciMessageDialog.__instance;
    if (title === null){
        title = "Информация";
    }
    instance.label = title;
    instance.body = message;

    return instance.dlg.openModal()
        .catch(() => {});
}