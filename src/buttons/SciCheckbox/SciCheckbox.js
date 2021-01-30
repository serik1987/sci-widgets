class SciCheckbox extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciCheckbox.template === null){
            SciCheckbox.template = this._createTemplate(SciCheckbox.templateText);
        }

        let content = SciCheckbox.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);
        this.__checkbox = shadow.querySelector("input");

        this.__defaultValue = false;
        if (this.getAttribute("checked") !== null){
            this.__defaultValue = true;
            this.__checkbox.checked = true;
            this.classList.add("checked");
        }

        if (this.getAttribute("align-right") !== null){
            let wrapper = shadow.querySelector(".immediate-wrapper");
            let img = shadow.querySelector(".img");
            wrapper.append(img);
        }

        this.addEventListener("click", event => {
            event.preventDefault();
            if (self.disabled){
                return;
            }
            self.value = !self.value;
            let newEvent = new Event("change", event);
            self.dispatchEvent(newEvent);
        });
    }

    get defaultValue(){
        return this.__defaultValue;
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

    get undefined(){
        return this.getAttribute("undefined") !== null;
    }

    set undefined(value){
        if (value){
            this.setAttribute("undefined", "");
        } else {
            this.removeAttribute("undefined");
        }
    }

    get value(){
        this.errorMessage = "";
        let checked = this.__checkbox.checked;
        if (this.undefined){
            checked = null;
            if (this.required){
                this.errorMessage = "Пожалуйста, выберите нужную опцию";
                throw new TypeError("sci-checkbox: The user don't select necessary option");
            }
        }
        return checked;
    }

    set value(value){
        if (this.getAttribute("undefined") !== null){
            this.removeAttribute("undefined");
        }
        let checked = !!value;
        this.__checkbox.checked = checked;
        if (checked && !this.classList.contains("checked")){
            this.classList.add("checked");
        }
        if (!checked && this.classList.contains("checked")){
            this.classList.remove("checked");
        }
    }

}

SciCheckbox.observedAttributes = ["disabled", "label"];