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
