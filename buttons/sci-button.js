class SciButton extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciButton.template === null){
            SciButton.template = this._createTemplate(SciButton.templateText);
        }

        let element = SciButton.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(element);

        this.__button = shadow.querySelector("input");

        this.__button.addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();
            self.__button.blur();

            if (self.type === "submit"){
                let customEvent = new CustomEvent("sci-button-submit", {detail: null, bubbles: true});
                self.dispatchEvent(customEvent);
            }

            if (self.type === "reset"){
                let customEvent = new CustomEvent("sci-button-reset", {detail: null, bubbles: true});
                self.dispatchEvent(customEvent);
            }

            let newEvent = new MouseEvent("click", event);
            self.dispatchEvent(newEvent);
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            if (newValue !== null) {
                this.__button.value = newValue;
            }
        } else if (name === "type") {
            if (newValue === "submit" || newValue === "blue") {
                this.__button.type = "submit";
            } else if (newValue === "reset" || newValue === "white") {
                this.__button.type = "reset";
            } else {
                throw new TypeError("sci-button has wrong value of 'type' attribute");
            }
        } else if (name === "tab-index"){
            this.__button.tabIndex = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _disableChildren(){
        this.__button.disabled = true;
    }

    _enableChildren(){
        this.__button.disabled = false;
    }

    get errorMessage(){
        return null;
    }

    set errorMessage(value){}

    get type(){
        return this.getAttribute("type");
    }

}

SciButton.observedAttributes = ["type", "label", "disabled", "tab-index", "width"];

SciButton.template = null;

SciButton.templateText = `
<style>
    @import url(../core-styles.css);
    
    :host{
        font-size: 20px;
        text-align: center;
        display: inline-block;
        margin-right: 20px;
    }
    
    :host(:last-child){
        margin-right: 0px;
    }
    
    .immediate-wrapper{
        font-size: 14px;
        display: inline-block;
        width: 100%;
    }
    
    input[type=submit], input[type=reset]{
        border: 1px solid #1658da;
        background: #1658da;
        text-transform: uppercase;
        color: #fff;
        box-shadow: none;
        cursor: pointer;
        line-height: 20px;
        padding: 12px;
        height: inherit;
        border-radius: 5px;
        min-width: 200px;
        outline: none;
        width: 100%;
    }
    
    input[type=reset]{
        background: #fff;
        color: black;
        border: 1px solid black;
    }
    
    input[type=submit]:hover, input[type=submit]:focus{
        background: rgb(0, 52, 155);
    }
    
    input[type=submit]:disabled{
        background: rgb(186, 196, 209);
        border-color: rgb(186, 196, 209);
        cursor: default;
    }
    
    input[type=reset]:disabled{
        border-color: rgb(186, 196, 209);
        color: rgb(186, 196, 209);
        cursor: default;
    }

    input[type=submit]:active, input[type=reset]:active{
        box-shadow: inset 0px 0px 25px 10px rgba(0, 0, 0, 0.25);
    }
    
    input[type=reset]:focus{
        box-shadow: inset 0px 0px 25px 10px rgba(0, 0, 0, 0.25);
    }
</style>
<div class="widget-wrapper button-wrapper">
    <div class="immediate-wrapper">
        <input type="submit" value="ERROR! THE LABEL ATTRIBUTE OF THE SCI-BUTTON IS NOT DEFINED"/>
    </div>
</div>
`;

customElements.define("sci-button", SciButton);