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

SciSpinInput.template = null;

SciSpinInput.templateText = `
<style>
    @import url(../core-styles.css);
    
    :host{
        font-size: 0;
        width: 265px;
    }
    
    sci-input{
        display: inline-block;
        vertical-align: top;
        margin: 0 5px 0 0;
        width: calc(100% - 15px);
        font-size: 14px;
    }
    
    .spin-buttons{
        display: inline-block;
        vertical-align: top;
        margin-top: 18px;
        width: 10px;
        height: 22px;
        font-size: 14px;
    }
    
    .spin-button{
        display: block;
        fill: #333;
        cursor: pointer;
    }
    
    .spin-button.selected{
        fill: rgb(186, 196, 209);
    }
    
    :host([disabled]) .spin-button{
        fill: rgb(186, 196, 209);
        cursor: default;
    }
    
    #spin-up{
        margin-bottom: 2px;
    }
    
    #spin-down{       
    }
</style>
<sci-input></sci-input>
<div class="spin-buttons">
    <svg id="spin-up" viewBox="0 0 100 100" class="spin-button">
        <path d="M 0 100 L 100 100 L 50 0 z"></path>    
    </svg>
    <svg id="spin-down" viewBox="0 0 100 100" class="spin-button">
        <path d="M 0 0 L 100 0 L 50 100 z"></path>    
    </svg>
</div>
`;