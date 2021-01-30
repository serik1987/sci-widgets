class SciSpinInput extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciSpinInput.template === null){
            SciSpinInput.template = this._createTemplate(SciSpinInput.templateText);
            this._renderChildren(SciSpinInput.template);
        }

        let template = SciSpinInput.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(template);

        this.__input = shadow.querySelector("sci-input");
        this.__spinUp = shadow.querySelector("#spin-up");
        this.__spinDown = shadow.querySelector("#spin-down");

        this.__spinUp.addEventListener("click", this.__processSpinEvent.bind(this));
        this.__spinDown.addEventListener("click", this.__processSpinEvent.bind(this));

        this.__spinUp.addEventListener("dblclick", this.__processSpinDblClick.bind(this));
        this.__spinDown.addEventListener("dblclick", this.__processSpinDblClick.bind(this));
    }

    __processSpinEvent(event){
        if (this.disabled){
            return;
        }

        let target = event.target.closest("svg");
        let id = target.id;

        if (!target.classList.contains("selected")){
            target.classList.add("selected");
            setTimeout(() => target.classList.remove("selected"), 80);
        }

        let eventName = "sci-" + id;
        let newEvent = new CustomEvent(eventName, {bubbles: true});
        this.dispatchEvent(newEvent);
    }

    __processSpinDblClick(event){
        event.stopPropagation();
        event.preventDefault();
    }

    _enableChildren(){
        this.__input.enable();
    }

    _disableChildren(){
        this.__input.disable();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label"){
            this.__input.label = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _renderChildren(template) {}

    get _input(){
        return this.__input;
    }

    get _spinUp(){
        return this.__spinUp;
    }

    get _spinDown(){
        return this.__spinDown;
    }

    get errorMessage(){
        return this.__input.errorMessage;
    }

    set errorMessage(value){
        this.__input.errorMessage = value;
    }

}