class SciDateRange extends SciWidget{
    constructor(){
        super();
        let self = this;

        if (SciDateRange.template === null){
            SciDateRange.template = this._createTemplate(SciDateRange.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let template = SciDateRange.template.content.cloneNode(true);
        shadow.append(template);

        this.__startDate = shadow.getElementById("start-date");
        this.__finishDate = shadow.getElementById("finish-date");

        this.__minValue = null;
        this.__maxValue = null;

        this.__startDate.addEventListener("change", event => {
            event.stopPropagation();
            event.preventDefault();

            self._checkFinishDate();

            let evt = new Event("change", event);
            self.dispatchEvent(evt);
        });

        this.__finishDate.addEventListener("change", event => {
            event.stopPropagation();
            event.preventDefault();

            self._checkStartDate();

            let evt = new Event("change", event);
            self.dispatchEvent(evt);
        });

        let defaultStartValue = this.getAttribute("start-value");
        let defaultFinishValue = this.getAttribute("finish-value");
        if (defaultStartValue !== null){
            this.__defaultStartValue = new Date(defaultStartValue);
        } else {
            this.__defaultStartValue = null;
        }
        if (defaultFinishValue !== null){
            this.__defaultFinishValue = new Date(defaultFinishValue);
        } else {
            this.__defaultFinishValue = null;
        }

        this.startValue = this.__defaultStartValue;
        this.finishValue = this.__defaultFinishValue;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label"){
            this.__startDate.label = newValue;
        } else if (name === "finish-label") {
            this.__finishDate.label = newValue;
        } else if (name === "inline") {
            if (newValue !== null) {
                this.__startDate.setAttribute("inline", "");
                this.__finishDate.setAttribute("inline", "");
            } else {
                this.__startDate.removeAttribute("inline");
                this.__finishDate.removeAttribute("inline");
            }
        } else if (name === "maxvalue") {
            this.maxValue = newValue;
        } else if (name === "minvalue") {
            this.minValue = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _checkStartDate(minDate = null, maxDate = null){
        if (minDate === null){
            minDate = this.minValue;
        }
        this.__startDate.minValue = minDate;

        if (maxDate === null){
            maxDate = this.maxValue;
        }
        let finishDate = this.__finishDate.value;
        if (finishDate !== null){
            if (maxDate === null || maxDate.getTime() > finishDate.getTime()){
                maxDate = new Date(finishDate);
            }
        }
        this.__startDate.maxValue = maxDate;

        let currentValue = this.__startDate.value;
        if (currentValue !== null && currentValue.getTime() > maxDate.getTime()){
            this.__startDate.value = new Date(maxDate);
        }
    }


    _checkFinishDate(minDate = null, maxDate = null){
        if (maxDate === null){
            maxDate = this.maxValue;
        }
        this.__finishDate.maxValue = maxDate;

        if (minDate === null){
            minDate = this.minValue;
        }
        let startDate = this.__startDate.value;
        if (startDate !== null){
            if (minDate === null || minDate.getTime() < startDate.getTime()){
                minDate = new Date(startDate);
            }
        }
        this.__finishDate.minValue = minDate;

        let currentValue = this.__finishDate.value;
        if (currentValue !== null && currentValue.getTime() < minDate.getTime()){
            this.__finishDate.value = new Date(minDate);
        }
    }

    _checkDate(){
        let minDate = this.minValue;
        let maxDate = this.maxValue;
        this._checkStartDate(minDate, maxDate);
        this._checkFinishDate(minDate, maxDate);
    }

    _enableChildren(){
        this.__startDate.enable();
        this.__finishDate.enable();
    }

    _disableChildren(){
        this.__startDate.disable();
        this.__finishDate.disable();
    }

    get defaultFinishValue(){
        return this.__defaultFinishValue;
    }

    get defaultStartValue(){
        return this.__defaultStartValue;
    }

    get finishValue(){
        this.__finishDate.errorMessage = "";
        let finishValue = this.__finishDate.value;
        if (finishValue === null && this.required){
            this.__finishDate.errorMessage = "Пожалуйста, укажите дату";
            throw new TypeError("sci-date-range: finishValue is not filled by the user");
        }
        return finishValue;
    }

    set finishValue(value){
        let date = null;
        if (value !== null) {
            date = new Date(value);
            let startDate = this.startValue;
            if (startDate !== null && startDate.getTime() > date.getTime()) {
                throw new TypeError("sci-date-range: attempt to set finishValue that is lower than the startValue");
            }
            this.__finishDate.value = date;
        }
        this._checkStartDate();
    }

    get maxValue(){
        return this.__maxValue;
    }

    set maxValue(value){
        let maxDate = null;
        if (value !== null){
            maxDate = new Date(value);
            let minDate = this.minValue;
            if (minDate !== null && minDate.getTime() > maxDate.getTime()){
                throw new TypeError("sci-date-range: attempt to set maxValue that is lower than the minValue");
            }
        }
        this.__maxValue = maxDate;
        this._checkDate();
    }

    get minValue(){
        return this.__minValue;
    }

    set minValue(value){
        let minDate = null;
        if (value !== null){
            minDate = new Date(value);
            let maxDate = this.maxValue;
            if (maxDate !== null && maxDate.getTime() < minDate.getTime()){
                throw new TypeError("sci-date-range: attempt to set minValue that is higher than the maxValue");
            }
        }
        this.__minValue = minDate;
        this._checkDate();
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

    get startValue(){
        this.__startDate.errorMessage = "";
        let startValue = this.__startDate.value;
        if (startValue === null && this.required){
            this.__startDate.errorMessage = "Пожалуйста, укажите дату";
            throw new TypeError("sci-date-range: Some of the fields were not filled by the user");
        }
        return startValue;
    }

    set startValue(value){
        let date = null;
        if (value !== null) {
            date = new Date(value);
            let finishDate = this.finishValue;
            if (finishDate !== null && finishDate.getTime() < date.getTime()) {
                throw new TypeError("sci-date-range: attempt to set startDate that is higher than the finishDate");
            }
        }
        this.__startDate.value = date;
        this._checkFinishDate();
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
            throw new TypeError("sci-date-range: the user did not filled all the fields");
        }

        return value;
    }

    set value(value){
        this.startValue = value.start;
        this.finishValue = value.finish;
    }
}

SciDateRange.observedAttributes = ["disabled", "finish-label", "inline", "label", "maxvalue", "minvalue", "width"];

