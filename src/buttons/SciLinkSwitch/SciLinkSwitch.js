class SciLinkSwitch extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciLinkSwitch.template === null){
            SciLinkSwitch.template = this._createTemplate(SciLinkSwitch.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let template = SciLinkSwitch.template.content.cloneNode(true);
        shadow.append(template);

        this.__children = {};
        this.__values = [];
        this.__elements = [];
        let firstValue = null;
        for (let element of this.children){
            if (element instanceof SciLinkButton){
                let elementValue = element.getAttribute("value");
                this.__children[elementValue] = element;
                this.__values.push(elementValue);
                this.__elements.push(element);
                if (firstValue === null){
                    firstValue = elementValue;
                }
                element.toggleable = true;
                element.addEventListener("change", event => {
                    event.stopPropagation();
                    event.preventDefault();
                    self.value = event.target.getAttribute("value");
                    let newEvent = new Event("change", event);
                    self.dispatchEvent(newEvent);
                });
            }
        }

        let localDefaultValue = this.getAttribute("value");
        if (this.__values.indexOf(localDefaultValue) === -1){
            this.__defaultValue = null;
        } else {
            this.__defaultValue = localDefaultValue;
        }

        this.__value = this.__defaultValue;
        this._updateValue();
    }

    _updateValue(){
        for (let element of this.__elements){
            element.active = false;
            element.value = false;
        }
        if (this.__value === null){
            return;
        }
        let currentElement = this.__children[this.__value];
        currentElement.active = true;
        currentElement.value = true;
    }

    _disableChildren(){
        for (let element of this.__elements){
            element.disable();
        }
    }

    _enableChildren(){
        for (let element of this.__elements){
            element.enable();
        }
        this._updateValue();
    }

    get childButtons(){
        return this.__children;
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get errorMessage(){
        return null;
    }

    set errorMessage(value){}

    get value(){
        if (this.disabled){
            return undefined;
        }
        return this.__value;
    }

    set value(value){
        if (value !== null && this.__values.indexOf(value) === -1){
            throw new TypeError("The value you assigned to sci-link-switch is not correct");
        }
        this.__value = value;
        this._updateValue();
    }

    get values(){
        return this.__values;
    }

}

SciLinkSwitch.observedAttributes = ["disabled", "width"];