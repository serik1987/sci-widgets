class SciProgressBar extends SciWindow{

    constructor(){
        super();

        if (SciProgressBar.template === null){
            SciProgressBar.template = this._createTemplate(SciProgressBar.templateText);
        }

        let content = SciProgressBar.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);
        this._initializeWindow();

        this.__value = null;
        this.__progressBar = shadow.querySelector(".pb-in-progress");
    }

    get value(){
        return this.__value;
    }

    set value(value){
        this.__value = value;

        if (typeof value === "number"){
            this.open();
            if (this.__progressBar.classList.contains("undefined")){
                this.__progressBar.classList.remove("undefined");
            }
            this.__progressBar.style.width = Math.round(value * 100) + "%";
        }

        else if (value === undefined){
            this.open();
            if (!this.__progressBar.classList.contains("undefined")){
                this.__progressBar.classList.add("undefined");
            }
            this.__progressBar.style.width = null;
        }

        else if (value === null){
            this.close();
        }

        else {
            throw new TypeError("sci-progress-bar: attempt to set the incorrect value");
        }
    }

}

SciProgressBar.observedAttributes = ["disabled", "label"];