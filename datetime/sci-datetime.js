class SciDatetime extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciDatetime.template === null){
            SciDatetime.template = this._createTemplate(SciDatetime.templateText);
        }

        let content = SciDatetime.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__dateWidget = shadow.querySelector("sci-date");
        this.__timeWidget = shadow.querySelector("sci-time");

        this.__minValue = null;
        this.__maxValue = null;

        this.__value = null;
        let value = this.getAttribute("value");
        this.__defaultValue = value;
        if (value !== null){
            value = new Date(value);
            this.value = value;
        }

        this.__dateWidget.addEventListener("change", event => {
            event.stopPropagation();
            this.__updateState();
            this.__updateTime();
            let newEvent = new Event("change", event);
            this.dispatchEvent(newEvent);
        });

        this.__timeWidget.addEventListener("change", this.__updateState.bind(this));
        this.__timeWidget.addEventListener("sci-overspin-down", event => {
            event.stopPropagation();
            let source = event.detail.source;
            let date = this.__value;
            if (date === null){
                return;
            }

            if (source === "millisecond"){
                date.setMilliseconds(date.getMilliseconds() - 1);
                self.__updateValue();
            } else if (source === "second"){
                date.setSeconds(date.getSeconds() - 1);
                self.__updateValue();
            } else if (source === "minute"){
                date.setMinutes(date.getMinutes() - 1);
                self.__updateValue();
            } else if (source === "hour"){
                date.setHours(date.getHours() - 1);
                self.__updateValue();
            }
        });
        this.__timeWidget.addEventListener("sci-overspin-up", event => {
            event.stopPropagation();
            let source = event.detail.source;
            let date = this.__value;
            if (date === null){
                return;
            }

            if (source === "millisecond"){
                date.setMilliseconds(date.getMilliseconds() + 1);
                self.__updateValue();
            } else if (source === "second"){
                date.setSeconds(date.getSeconds() + 1);
                self.__updateValue();
            } else if (source === "minute"){
                date.setMinutes(date.getMinutes() + 1);
                self.__updateValue();
            } else if (source === "hour"){
                date.setHours(date.getHours() + 1);
                self.__updateValue();
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.__dateWidget.label = "Дата " + newValue;
            this.__timeWidget.label = "Время " + newValue;
        } else if (name === "seconds") {
            this.__timeWidget.seconds = newValue !== null;
        } else if (name === "millis") {
            this.__timeWidget.millis = newValue !== null;
        } else if (name === "inline") {
            if (newValue !== null) {
                this.__dateWidget.setAttribute("inline", "");
            } else {
                this.__dateWidget.removeAttribute("inline");
            }
        } else if (name === "maxvalue") {
            this.maxValue = newValue;
        } else if (name === "minvalue") {
            this.minValue = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __updateValue(){
        let minValue = this.minValue;
        let value = this.__value;
        let maxValue = this.maxValue;

        this.__dateWidget.minValue = minValue;
        this.__dateWidget.maxValue = maxValue;
        this.__checkMiniMax(minValue, value, maxValue);
        value = this.__value;

        this.__dateWidget.value = value;

        this.__updateTime(minValue, value, maxValue);
    }

    __updateTime(minValue = undefined, value = undefined, maxValue = undefined){
        if (minValue === undefined){ // the function was launched by sci-date
            minValue = this.minValue;
            value = this.__value;
            maxValue = this.maxValue;
            this.__checkMiniMax(minValue, value, maxValue);
            value = this.__value;
        }

        if (minValue === null){
            this.__timeWidget.minValue = null;
        } else if (value !== null && value.getFullYear() === minValue.getFullYear() &&
            value.getMonth() === minValue.getMonth() && value.getDate() === minValue.getDate()){
            this.__timeWidget.minValue = {
                hour: minValue.getHours(),
                minute: minValue.getMinutes(),
                second: minValue.getSeconds(),
                millisecond: minValue.getMilliseconds()
            }
        } else {
            this.__timeWidget.minValue = null;
        }

        if (maxValue === null){
            this.__timeWidget.maxValue = null;
        } else if (value !== null && value.getFullYear() === maxValue.getFullYear() &&
            value.getMonth() === maxValue.getMonth() && value.getDate() === maxValue.getDate()){
            this.__timeWidget.maxValue = {
                hour: maxValue.getHours(),
                minute: maxValue.getMinutes(),
                second: maxValue.getSeconds(),
                millisecond: maxValue.getMilliseconds()
            }
        } else {
            this.__timeWidget.maxValue = null;
        }

        this.__timeWidget.value = value;
    }

    __checkMiniMax(minValue, value, maxValue){
        if (value !== null && minValue !== null && value.getTime() < minValue.getTime()){
            value = new Date(minValue);
            this.__value = value;
        }

        if (value !== null && maxValue !== null && value.getTime() > maxValue.getTime()){
            value = new Date(maxValue);
            this.__value = value;
        }
    }

    __updateState(event = null){
        if (event !== null) {
            event.stopPropagation();
        }

        this.__value = this.__dateWidget.value;
        if (this.__value !== null){
            this.__timeWidget.getValue(this.__value);
        }

        if (event !== null) {
            let newEvent = new Event("change", event);
            this.dispatchEvent(newEvent);
        }
    }

    _enableChildren(){
        this.__dateWidget.enable();
        this.__timeWidget.enable();
    }

    _disableChildren(){
        this.__dateWidget.disable();
        this.__timeWidget.disable();
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get errorMessage(){
        return this.__dateWidget.errorMessage;
    }

    set errorMessage(value){
        this.__dateWidget.errorMessage = value;
    }

    get maxValue(){
        let value = this.__maxValue;
        if (value !== null){
            value = new Date(value);
        }
        return value;
    }

    set maxValue(value){
        if (value === null){
            this.__maxValue = null;
        } else {
            let minValue = this.minValue;
            let maxValue = new Date(value);
            if (minValue !== null && minValue.getTime() > maxValue.getTime()){
                throw new TypeError("sci-datetime: maxValue shall not be lesser than the minValue");
            }
            this.__maxValue = maxValue;
        }
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
        if (value === null){
            this.__minValue = null;
        } else {
            let minValue = new Date(value);
            let maxValue = this.maxValue;
            if (maxValue !== null && maxValue.getTime() < minValue.getTime()){
                throw new TypeError("sci-datetime: minValue shall not be greater than the maxValue");
            }
            this.__minValue = minValue;
        }
        this.__updateValue();
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

    get value(){
        let value = this.__value;
        if (value === null && this.required){
            this.errorMessage = "Пожалуйста, укажите дату и время";
            throw new TypeError("sci-datetime: the user doesn't entered required date and time");
        }
        return value;
    }

    set value(value){
        let time = value;
        if (time !== null){
            time = new Date(value);
            let minValue = this.minValue;
            let maxValue = this.maxValue;
            if (minValue !== null && minValue.getTime() > time.getTime()){
                throw new TypeError("sci-datetime: the value can't be lesser than the minValue");
            }
            if (maxValue !== null && maxValue.getTime() < time.getTime()){
                throw new TypeError("sci-datetimeL the value can't be grater than the maxValue");
            }
        }
        this.__value = time;
        this.__updateValue();
    }

}

SciDatetime.observedAttributes = ["disabled", "inline", "label", "maxvalue", "millis", "minvalue", "seconds", "width"];

SciDatetime.template = null;

SciDatetime.templateText = `
<style>
    @import url(../core-styles.css);
    
    sci-date{
        display: inline-block;
        vertical-align: top;
    }
    
    sci-time{
        display: inline-block;
        vertical-align: top;
    }
    
    :host([inline]) sci-time{
        display: block;
        width: 345px;
    }
    
    @media screen and (max-width: 700px){
        sci-date{
            display: block;
        }
        
        sci-time{
            display: block;
            width: 345px;
        }
    }
    
    @media screen and (max-width: 400px){
        sci-time{
            width: 290px;
        }
    }
</style>
<sci-date></sci-date>
<sci-time></sci-time>
`;

customElements.define("sci-datetime", SciDatetime);