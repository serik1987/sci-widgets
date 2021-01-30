class SciListBox extends SciScrollable{

    constructor(){
        super();
        let self = this;

        if (SciListBox.template === null){
            SciListBox.template = this._createTemplate(SciListBox.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let content = SciListBox.template.content.cloneNode(true);
        shadow.append(content);

        this._implementScroll();
        this.updateItems();

        if (this.multiple){
            this.__value = new Set();
        } else {
            this.__value = null;
        }

        this.__defaultValue = this.getAttribute("value");
        if (!this.multiple){
            this.value = this.__defaultValue;
        }

        this.__updateValue();

        shadow.querySelector(".content").addEventListener("click", event => {
            let target = event.target.closest("li");

            if (target !== null && !target.classList.contains("disabled") && self.enabled){
                self.errorMessage = "";
                self.value = target.dataset.value;
                let newEvent = new Event("change", {});
                self.dispatchEvent(newEvent);
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "multiple") {
            this.value = this.defaultValue;
        } else if (name === "height"){
            super.attributeChangedCallback("height", oldValue, newValue);
            this.updateHeight();
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _onChange(){
        this.updateHeight();
    }

    __updateValue(){
        let noValues = true;
        if (this.multiple){
            noValues = false;
        }
        for (let item of this.items){
            let classes = item.element.classList;
            classes.remove("selected");
            if (!this.multiple && this.__value !== null && this.__value === item.value){
                classes.add("selected");
                noValues = false;
            }
            if (this.multiple && this.__value instanceof Set && this.__value.has(item.value)){
                classes.add("selected");
            }
        }
        if (noValues){
            this.__value = null;
        }
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    set errorMessage(value){
        super.errorMessage = value;
        if (value && !this.classList.contains("error")){
            this.classList.add("error");
        }
        if (!value && this.classList.contains("error")){
            this.classList.remove("error");
        }
    }

    get items(){
        return this.__items;
    }

    get multiple(){
        return this.getAttribute("multiple") !== null;
    }

    set multiple(value){
        if (value){
            this.setAttribute("multiple", "");
        } else {
            this.removeAttribute("multiple");
        }
    }

    get required(){
        let required = this.getAttribute("required");
        let multiple = this.multiple;

        if (multiple && required !== null){
            required = parseInt(required);
            if (!(required > 0)){
                required = 0;
            }
        }

        if (multiple && required === null){
            required = 0;
        }

        if (!multiple){
            required = required !== null;
        }

        return required;
    }

    set required(value){
        let multiple = this.multiple;
        let required = value;

        if (multiple){
            required = parseInt(required);
            if (!(required > 0)){
                required = 0;
            }
            required = required.toString();
        } else {
            if (value){
                required = "";
            } else {
                this.removeAttribute("required");
                return;
            }
        }

        this.setAttribute("required", required);
    }

    get value(){
        this.errorMessage = "";
        let value = this.__value;
        if (value instanceof Set){
            value = new Set(value);
        }

        let multiple = this.multiple;
        let required = this.required;

        if (multiple && value.size < required){
            this.errorMessage = `Пожалуйста, выберите не менее ${required} вариантов`;
            throw new TypeError("sci-list-box: the user's choice is not validated");
        }

        if (!multiple && required && value === null){
            this.errorMessage = "Пожалуйста, выберите нужную опцию";
            throw new TypeError("sci-list-box: the user's choice is not validated");
        }

        return value;
    }

    set value(value){
        if (this.multiple && value instanceof Set){
            this.__value = new Set(value);
        } else if (this.multiple && typeof value === "string") {
            if (this.__value.has(value)) {
                this.__value.delete(value);
            } else {
                this.__value.add(value);
            }
        } else if (this.multiple && value instanceof Array) {
            this.__value = new Set(value);
        } else if (this.multiple && value === null){
            this.__value = new Set();
        } else if (!this.multiple && (value === null || typeof value === "string")){
            this.__value = value;
        } else {
            throw new TypeError("sci-list-box: can't assign value to this widget");
        }

        this.__updateValue();
    }

    updateItems(){
        let ul = this.querySelector("ul");
        this.__items = new SciItemList(this, ul);
        this.updateHeight();
    }

}

SciListBox.observedAttributes = ["disabled", "height", "multiple", "width"];

