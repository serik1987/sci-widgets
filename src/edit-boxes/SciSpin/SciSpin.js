class SciSpin extends SciSpinInput{

    constructor(){
        super();
        let self = this;

        let value = this.getAttribute("value");
        if (value !== null){
            value = parseFloat(value);
        }
        this.__defaultValue = value;
        this.__value = this.__defaultValue;
        this.__minValue = -Infinity;
        this.__step = 1.0;
        this.__maxValue = Infinity;
        this.__updateChildren();

        this.addEventListener("sci-spin-up", event => {
            if (event.detail === "sci-spin" || self.readOnly){
                return;
            }
            event.stopImmediatePropagation();
            event.preventDefault();

            self.stepUp(1);

            ["change", "sci-spin-up"].forEach(eventName => {
                let newEvent = new CustomEvent(eventName, {bubbles: true, detail: "sci-spin"});
                self.dispatchEvent(newEvent);
            });
        });

        this.addEventListener("sci-spin-down", event => {
            if (event.detail === "sci-spin" || self.readOnly){
                return;
            }
            event.stopImmediatePropagation();
            event.preventDefault();

            self.stepDown(1);

            ["change", "sci-spin-down"].forEach(eventName => {
                let newEvent = new CustomEvent(eventName, {bubbles: true, detail: "sci-spin"});
                self.dispatchEvent(newEvent);
            });
        });

        this._input.addEventListener("change", event => {
            if (event.detail === "sci-spin" || self.readOnly){
                return;
            }
            event.stopImmediatePropagation();
            event.preventDefault();
            let value = parseFloat(self._input.value);
            if (isNaN(value)){
                value = null;
            } else {
                if (value < this.__minValue){
                    value = this.__minValue;
                }
                if (value > this.__maxValue){
                    value = this.__maxValue;
                }
                let gmin = this.__minValue;
                if (gmin === -Infinity){
                    gmin = 0;
                }
                let gidx = Math.round((value - gmin) / this.__step);
                value = gmin + gidx * this.__step;
                this.value = value;
            }

            let newEvent = new CustomEvent("change", {bubbles: true, detail: "sci-spin"});
            self.dispatchEvent(newEvent);
        });

        this._input.addEventListener("keydown", event => {
            let eventList = ["change"];
            let spinned = false;

            if (event.key === "ArrowDown"){
                eventList.push("sci-spin-down");
                this.stepDown(1);
            }

            if (event.key === "ArrowUp"){
                eventList.push("sci-spin-up");
                this.stepUp(1);
            }

            eventList.forEach(eventName => {
                let newEvent = new CustomEvent(eventName, {bubbles: true, detail: "sci-spin"});
                self.dispatchEvent(newEvent);
            });
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "max"){
            this.maxValue = newValue;
        } else if (name === "min"){
            this.minValue = newValue;
        } else if (name === "step") {
            this.step = newValue;
        } else if (name === "placeholder") {
            this._input.placeholder = newValue;
        } else if (name === "readonly") {
            this._input.readOnly = newValue !== null;
        } else if (name === "align"){
            this._input.align = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __updateChildren(){
        if (isNaN(this.__value)){
            this.__value = null;
        }

        if (this.__value < this.__minValue){
            this.__value = this.__minValue;
        }

        if (this.__value > this.__maxValue){
            this.__value = this.__maxValue;
        }

        if (this.__value !== null){
            this._input.value = this.__value.toString();
        } else {
            this._input.value = "";
        }
    }

    get align(){
        return this.getAttribute("align");
    }

    set align(value){
        if (value !== null){
            this.setAttribute("align", value);
        } else {
            this.removeAttribute("align");
        }
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get maxValue(){
        return this.__maxValue;
    }

    set maxValue(value){
        this.__maxValue = parseFloat(value);
    }

    get minValue(){
        return this.__minValue;
    }

    set minValue(value){
        this.__minValue = parseFloat(value);
    }

    get placeholder(){
        return this.getAttribute("placeholder");
    }

    set placeholder(value){
        if (value){
            this.setAttribute("placeholder", value);
        } else {
            this.removeAttribute("placeholder");
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

    get step(){
        return this.__step;
    }

    set step(value){
        this.__step = parseFloat(value);
    }

    get value(){
        this.errorMessage = "";

        let value = this.__value;
        if (value === null && this.required){
            this.errorMessage = "Вы не заполнили поле";
            throw new TypeError("sci-spin: the value was not set by the user");
        }

        return value;
    }

    set value(value){
        this.__value = parseFloat(value);
        this.__updateChildren();
    }

    get wrap(){
        return this.getAttribute("wrap") !== null;
    }

    set wrap(value){
        if (value){
            this.setAttribute("wrap", "");
        } else {
            this.removeAttribute("wrap");
        }
    }

    stepDown(n){
        let value = this.__value;
        if (value === null && this.__maxValue === Infinity){
            value = 0;
        } else if (value === null || value > this.__maxValue){
            value = this.__maxValue;
        } else {
            value -= this.__step * n;
            if (value < this.__minValue){
                if (this.wrap){
                    value = this.__maxValue;
                } else {
                    value = this.__minValue;
                }
            }
        }
        this.value = value;
    }

    stepUp(n){
        let value = this.__value;
        if (value === null && this.__minValue === -Infinity){
            value = 0;
        } else if (value < this.__minValue || value === null){
            value = this.__minValue;
        } else {
            value += this.__step * n;
            if (value > this.__maxValue){
                if (this.wrap){
                    value = this.__minValue;
                } else {
                    value = this.__maxValue;
                }
            }
        }
        this.value = value;
    }

}

SciSpin.observedAttributes = ["align", "disabled", "label", "max", "min", "placeholder", "readonly", "step", "width"];