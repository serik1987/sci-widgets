class SciDatetimeRange extends SciWidget{

    constructor(){
        super();
        let self = this;
        this.__ready = false; // automatic call of the __updateValue OFF

        if (SciDatetimeRange.template === null){
            SciDatetimeRange.template = this._createTemplate(SciDatetimeRange.templateText);
        }

        let content = SciDatetimeRange.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);
        this.__startDateWidget = shadow.querySelector("#start-date");
        this.__finishDateWidget = shadow.querySelector("#finish-date");

        this.__minValue = null;
        this.__maxValue = null;

        this.__defaultFinishValue = null;
        this.__defaultStartValue = null;
        this.__finishValue = null;
        this.__startValue = null;
        let defaultFinishValue = this.getAttribute("finish-value");
        let defaultStartValue = this.getAttribute("start-value");
        if (defaultFinishValue !== null){
            this.__defaultFinishValue = new Date(defaultFinishValue);
            this.__finishValue = new Date(defaultFinishValue);
        }
        if (defaultStartValue !== null){
            this.__defaultStartValue = new Date(defaultStartValue);
            this.__startValue = new Date(defaultStartValue);
        }

        this.__ready = true; // Automatic call of the __updateValue is ON
        this.__updateValue();

        this.__startDateWidget.addEventListener("change", event => {
            event.stopPropagation();
            this.__startValue = event.target.value;
            self.__updateFinishValue();
            self.__updateState();
        });

        this.__finishDateWidget.addEventListener("change", event => {
            event.stopPropagation();
            this.__finishValue = event.target.value;
            self.__updateStartValue();
            self.__updateState();
        });
    }

    __updateState(event){
        let newEvent = new Event("change", event);
        this.dispatchEvent(newEvent);
    }

    __correctValue(){
        let minValue = this.minValue;
        let startValue = this.startValue;
        let finishValue = this.finishValue;
        let maxValue = this.maxValue;
        this.__ready = false;

        if (minValue !== null && startValue !== null && startValue.getTime() < minValue.getTime()){
            this.startValue = minValue;
        }

        if (maxValue !== null && finishValue !== null && maxValue.getTime() < finishValue.getTime()){
            this.finishValue = maxValue;
        }

        this.__ready = true;
    }

    __updateValue(){
        if (this.__ready){
            this.__updateStartValue();
            this.__updateFinishValue();
        }
    }

    __updateStartValue(){
        let minValue = this.minValue;
        let maxValue = this.maxValue;

        if (this.__finishValue !== null){
            maxValue = new Date(this.__finishValue);
        }

        this.__startDateWidget.minValue = minValue;
        this.__startDateWidget.value = this.__startValue;
        this.__startDateWidget.maxValue = maxValue;
    }

    __updateFinishValue(){
        let minValue = this.minValue;
        let maxValue = this.maxValue;

        if (this.__startValue !== null){
            minValue = new Date(this.__startValue);
        }

        this.__finishDateWidget.minValue = minValue;
        this.__finishDateWidget.value = this.__finishValue;
        this.__finishDateWidget.maxValue = maxValue;

    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "inline") {
            if (newValue !== null) {
                this.__startDateWidget.setAttribute("inline", "");
                this.__finishDateWidget.setAttribute("inline", "");
            } else {
                this.__startDateWidget.removeAttribute("inline");
                this.__finishDateWidget.removeAttribute("inline");
            }
        } else if (name === "maxvalue"){
            this.maxValue = newValue;
        } else if (name === "millis") {
            let value = newValue !== null;
            this.__startDateWidget.millis = value;
            this.__finishDateWidget.millis = value;
        } else if (name === "minvalue"){
            this.minValue = newValue;
        } else if (name === "label") {
            if (newValue !== null) {
                this.__startDateWidget.label = "начала " + newValue;
                this.__finishDateWidget.label = "окончания  " + newValue;
            } else {
                this.__startDateWidget.label = null;
                this.__finishDateWidget.label = null;
            }
        } else if (name === "seconds"){
            let value = newValue !== null;
            this.__startDateWidget.seconds = value;
            this.__finishDateWidget.seconds = value;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _enableChildren(){
        this.__startDateWidget.enable();
        this.__finishDateWidget.enable();
    }

    _disableChildren(){
        this.__startDateWidget.disable();
        this.__finishDateWidget.disable();
    }

    get defaultFinishValue(){
        return this.__defaultFinishValue;
    }

    get defaultStartValue(){
        return this.__defaultStartValue;
    }

    get errorMessage(){
        return this.__finishDateWidget.errorMessage;
    }

    set errorMessage(value){
        this.__startDateWidget.errorMessage = value;
        this.__finishDateWidget.errorMessage = value;
    }

    get finishValue(){
        let finishValue = this.__finishValue;
        if (finishValue === null && this.required){
            this.__finishDateWidget.errorMessage = "Пожалуйста, заполните поле";
            throw new TypeError("sci-datetime-widget: finishValue was not filled by the user");
        }
        if (finishValue !== null){
            finishValue = new Date(finishValue);
        }
        return finishValue;
    }

    set finishValue(value){
        let finishValue = value;
        if (value !== null){
            let minValue= this.minValue;
            let startValue = this.__startValue;
            finishValue = new Date(value);
            if (startValue === null && minValue !== null){
                startValue = minValue;
            }
            if (startValue !== null && startValue.getTime() > finishValue.getTime()){
                throw new TypeError("sci-datetime-range: finishValue can't be smaller than the startValue or minValue");
            }

            let maxValue = this.maxValue;
            if (maxValue !== null && maxValue.getTime() < finishValue.getTime()){
                throw new TypeError("sci-datetime-range: finishValue can't be larger than maxValue");
            }
        }
        this.__finishValue = finishValue;
        this.__updateValue();
    }

    get maxValue(){
        let maxValue = this.__maxValue;
        if (maxValue !== null){
            maxValue = new Date(maxValue);
        }
        return maxValue;
    }

    set maxValue(value){
        let maxValue = value;
        if (maxValue !== null){
            let minValue = this.minValue;
            maxValue = new Date(maxValue);
            if (minValue !== null && minValue.getTime() > maxValue.getTime()){
                throw new TypeError("sci-datetime-range: maxValue shall not be lesser than the minValue");
            }
        }
        this.__maxValue = maxValue;
        this.__correctValue;
        this.__updateValue();
    }

    get millis(){
        return this.getAttribute("millis") !== null;
    }

    set millis(value){
        if (value){
            this.setAttribute("millis", "");
        } else {
            this.removeAttribute("millis");
        }
    }

    get minValue(){
        let minValue = this.__minValue;
        if (minValue !== null){
            minValue = new Date(minValue);
        }
        return minValue;
    }

    set minValue(value){
        let minValue = value;
        if (minValue !== null){
            minValue = new Date(minValue);
            let maxValue = this.maxValue;
            if (maxValue !== null && minValue.getTime() > maxValue.getTime()){
                throw new TypeError("sci-datetime-range: minValue can't be greater than the maxValue");
            }
        }
        this.__minValue = minValue;
        this.__correctValue();
        this.__updateValue();
    }

    get required(){
        return this.getAttribute("required") !== null;
    }

    set required(value){
        if (value !== null){
            this.setAttribute("required", "");
        } else {
            this.removeAttribute("required");
        }
    }

    get seconds(){
        return this.getAttribute("seconds") !== null;
    }

    set seconds(value){
        if (value){
            this.setAttribute("seconds", "");
        } else {
            this.removeAttribute("seconds");
        }
    }

    get startValue(){
        let startValue = this.__startValue;
        if (startValue === null && this.required){
            this.__startDateWidget.errorMessage = "Пожалуйста, заполните поле";
            throw new TypeError("sci-datetime-range: startValue was not filled by the user");
        }
        if (startValue !== null){
            startValue = new Date(startValue);
        }
        return startValue;
    }

    set startValue(value){
        let startValue = value;
        if (value !== null){
            startValue = new Date(value);

            let minValue = this.minValue;
            if (minValue !== null && minValue.getTime() > startValue.getTime()){
                throw new TypeError("sci-datetime-range: startValue can't be larger than the minValue");
            }

            let finishValue = this.__finishValue;
            let maxValue = this.maxValue;
            if (finishValue === null && maxValue !== null){
                finishValue = maxValue;
            }
            if (finishValue !== null && startValue.getTime() > finishValue.getTime()){
                throw new TypeError("sci-datetime-range: startValue can't be larger than the finishValue or maxValue");
            }
        }
        this.__startValue = startValue;
        this.__updateValue();
    }

    get value(){
        let value = {};
        let failed = false;

        try{
            value.start = this.startValue;
        } catch (e){
            if (e instanceof TypeError){
                value.start = null;
                failed = true;
            } else {
                throw e;
            }
        }

        try{
            value.finish = this.finishValue;
        } catch (e){
            if (e instanceof TypeError){
                value.finish = null;
                failed = true;
            } else {
                throw e;
            }
        }

        if (failed){
            throw new TypeError("sci-datetime-range: some of fields were filled incorrectly");
        }

        return value;
    }

    set value(value){
        this.startValue = value.start;
        this.finishValue = value.finish;
    }

}

SciDatetimeRange.observedAttributes = ["disabled", "inline", "label", "maxvalue", "millis", "minvalue", "seconds"];

SciDatetimeRange.template = null;

SciDatetimeRange.templateText = `
<style>
    @import url(../core-styles.css);
</style>
<sci-datetime id="start-date"></sci-datetime>
<sci-datetime id="finish-date"></sci-datetime>
`;

customElements.define("sci-datetime-range", SciDatetimeRange);