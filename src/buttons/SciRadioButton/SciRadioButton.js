class SciRadioButton extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciRadioButton.template === null){
            SciRadioButton.template = this._createTemplate(SciRadioButton.templateText);
        }

        let content = SciRadioButton.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__input = shadow.querySelector("input");
        this._rendered = true;

        this.addEventListener("click", event => {
            if (self.disabled || self.readOnly){
                return;
            }

            this.check();

            let newEvent = new CustomEvent("change", {bubbles: true});
            self.dispatchEvent(newEvent);
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "name") {
            if (newValue !== null) {
                this.__input.setAttribute("name", newValue);
            } else {
                this.__input.removeAttribute("name");
            }
        } else if (name === "checked"){
            if (newValue !== null){
                this.check();
            } else {
                this.checked = false;
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get checked(){
        return this.__input.checked;
    }

    set checked(value){
        if (value){
            this.__input.setAttribute("checked", "");
        } else {
            this.__input.removeAttribute("checked");
        }
        this.errorMessage = "";
    }

    get group(){
        return this.parentElement.querySelectorAll(`sci-radio-button[name=${this.name}]`);
    }

    get name(){
        return this.getAttribute("name");
    }

    set name(value){
        if (value !== null){
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }
    
    get readOnly(){
        return this.getAttribute("readonly") !== null;
    }

    set readOnly(value){
        if (value){
            this.setAttribute("readonly", "");
        } else {
            this.removeAttribute("readonly");
        }
    }

    get required(){
        return this.getAttribute("required") !== null;
    }

    set required(value){
        if (value){
            this.setAttribute("required", "");
        } else {
            this.removeAttribute("required");
        }
    }

    get value(){
        this.errorMessage = "";
        let value = null;

        for (let button of this.group){
            if (button.checked){
                value = button.getAttribute("value");
                break;
            }
        }

        if (this.required && value === null){
            this.errorMessage = "Пожалуйста, выберите нужную опцию";
            throw new TypeError("sci-radio-button: the option is not selected by the user");
        }

        return value;
    }

    set value(value){
        let checked = false;

        for (let button of this.group){
            if (button.getAttribute("value") === value){
                button.check();
                checked = true;
                break;
            }
        }

        if (!checked){
            for (let button of this.group){
                button.checked = false;
            }
        }
    }

    check(){
        for (let button of this.group){
            if (button._rendered){
                button.checked = button === this;
            }
        }
    }

    next(){
        let doBreak = false;
        let element = null;

        for (let button of this.group){
            if (doBreak){
                element = button;
                break;
            }
            if (button === this){
                doBreak = true;
            }
        }

        return element;
    }

    previous(){
        let doBreak = false;
        let element = null;

        for (let button of [...this.group].reverse()){
            if (doBreak){
                element = button;
                break;
            }
            if (button === this){
                doBreak = true;
            }
        }

        return element;
    }

}

SciRadioButton.observedAttributes = ["checked", "disabled", "label", "name", "width"];