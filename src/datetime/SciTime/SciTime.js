class SciTime extends SciSpinInput{

    constructor(){
        super();
        let self = this;

        this.TIME_REGEXP = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d{1,3}))?)?$/;
        this.RELATIVE_TIME_REGEXP = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/;
        this.TIME_CHECK = /^(\d{1,3}):(\d{1,3})(?::(\d{1,3})(?:\.(\d{1,4}))?)?$/;
        this.RELATIVE_TIME_CHECK = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/;

        this.__relative = this.getAttribute("relative") !== null;
        this.__maxValue = null;
        this.__minValue = null;

        let value = this.getAttribute("value");
        this.__defaultValue = this.__parseTime(value);

        this.__value = this.__defaultValue;
        this.__updateValue();

        this.addEventListener("sci-spin-up", this.__processSpinUp.bind(this));
        this.addEventListener("sci-spin-down", this.__processSpinDown.bind(this));

        this._input.addEventListener("input", event => {
            event.stopPropagation();
            event.preventDefault();

            let input = event.target;
            let value = input.value;
            let pos = input.selectionStart;

            try {
                self.__value = self.__parseTime(value);
            } catch (e){
                let checker = self.relative ? self.RELATIVE_TIME_CHECK : self.TIME_CHECK;
                if (checker.test(value) && pos < value.length && value[pos].match(/\d/)){
                    value = value.substr(0, pos) + value.substr(pos+1);
                    self.__value = self.__parseTime(value);
                }
                if (!value){
                    self.__value = {hour: 0, minute: 0, second: 0, millisecond: 0};
                }
            }

            self.__updateValue();
            input.selectionStart = pos;
            input.selectionEnd = pos;

            let changeEvent = new Event("change", {});
            self.dispatchEvent(changeEvent);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "hours"){
            if (newValue === null && this.__value !== null){
                this.__value.hours = 0;
            }
        } else if (name === "seconds") {
            if (newValue === null && this.__value !== null) {
                this.__value.seconds = 0;
            }
            this.__updateValue();
        } else if (name === "millis") {
            if (newValue === null && this.__value !== null) {
                this.__value.millis = 0;
            }
            this.__updateValue();
        } else if (name === "maxvalue") {
            this.maxValue = newValue;
        } else if (name === "minvalue"){
            this.minValue = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __checkTime(time){
        if (time.hour < 0){
            throw new TypeError("sci-time: the time was entered incorrectly");
        }
        if (!this.relative && time.hour > 23){
            throw new TypeError("sci-time: the time was entered incorrectly");
        }
        if (time.minute < 0 || time.minute > 59){
            throw new TypeError("sci-time: the time was entered incorrectly");
        }
        if (time.second < 0 || time.second > 59){
            throw new TypeError("sci-time: the time was entered incorrectly");
        }
        if (time.millisecond < 0 || time.millisecond > 999){
            throw new TypeError("sci-time: the time was entered incorrectly");
        }
    }

    __parseTime(time){
        if (time === null){
            return null;
        }

        let validator = this.relative ? this.RELATIVE_TIME_REGEXP : this.TIME_REGEXP;

        let result = {hour: 0, minute: 0, second: 0, millisecond: 0};
        let matches = time.match(validator);
        if (matches === null){
            throw new TypeError("sci-time: the time was entered incorrectly");
        }
        if (matches[1] !== undefined){
            result.hour = parseInt(matches[1]);
        }
        result.minute = parseInt(matches[2]);
        if (matches[3] !== undefined){
            result.second = parseInt(matches[3]);
        }
        if (matches[4] !== undefined){
            result.millisecond = parseInt(matches[4]);
        }

        this.__checkTime(result);

        return result;
    }

    __updateValue(){
        let value = this.__value;
        let pos = this._input.selectionStart;
        if (value === null){
            value = {hour: 0, minute: 0, second: 0, millisecond: 0};
            this.__value = value;
        }
        let value_ts = SciTime.timestamp(value);
        let min_ts = SciTime.timestamp(this.minValue);
        let max_ts = SciTime.timestamp(this.maxValue);
        if (min_ts !== null && value_ts < min_ts){
            Object.assign(value, this.minValue);
            let evt = new CustomEvent("sci-overspin-down", {
                detail: {source: "limits"}
            });
            this.dispatchEvent(evt);
        }
        if (max_ts !== null && value_ts > max_ts){
            Object.assign(value, this.maxValue);
            let evt = new CustomEvent("sci-overspin-up", {
                detail: {source: "limits"}
            });
            this.dispatchEvent(evt);
        }
        let valueString = "";
        if (this.hours || !this.relative){
            let hour = value.hour.toString();
            if (hour.length === 1){
                hour = "0" + hour;
            }
            valueString += hour + ":";
        }
        let minute = value.minute.toString();
        if (minute.length === 1){
            minute = "0" + minute;
        }
        valueString += minute;
        if (this.seconds){
            let second = value.second.toString();
            if (second.length === 1){
                second = "0" + second;
            }
            valueString += ":" + second;
        }
        if (this.seconds && this.millis){
            let millisecond = value.millisecond.toString();
            while (millisecond.length < 3){
                millisecond = "0" + millisecond;
            }
            valueString += "." + millisecond;
        }
        this._input.value = valueString;
        this._input.selectionStart = pos;
        this._input.selectionEnd = pos;
    }

    __processSpinUp(){
        let pos = this._input.selectionStart;
        let spinningValue = this.__selectSpinningValue(pos);
        let spinResult = true;
        if (spinningValue === "hour"){
            spinResult = this.__spinHourUp();
        } else if (spinningValue === "minute"){
            spinResult = this.__spinMinuteUp();
        } else if (spinningValue === "second"){
            spinResult = this.__spinSecondUp();
        } else if (spinningValue === "millisecond"){
            spinResult = this.__spinMillisecondUp();
        }
        let afterspinResult = this.__afterSpin(spinningValue);
        if (!spinResult || !afterspinResult){
            let event = new CustomEvent("sci-overspin-up", {
                detail: {source: spinningValue}
            });
            this.dispatchEvent(event);
        }
    }

    __processSpinDown(){
        let pos = this._input.selectionStart;
        let spinningValue = this.__selectSpinningValue(pos);
        let spinResult = true;
        if (spinningValue === "hour"){
            spinResult = this.__spinHourDown();
        } else if (spinningValue === "minute"){
            spinResult = this.__spinMinuteDown();
        } else if (spinningValue === "second"){
            spinResult = this.__spinSecondDown();
        } else if (spinningValue === "millisecond"){
            spinResult = this.__spinMillisecondDown();
        }
        let afterspinResult = this.__afterSpin(spinningValue);
        if (!spinResult || !afterspinResult){
            let event = new CustomEvent("sci-overspin-down", {
                detail: {source: spinningValue}
            });
            this.dispatchEvent(event);
        }
    }

    __selectSpinningValue(pos){
        if (this.__value === null){
            this.__value = {hour: 0, minute: 0, second: 0, millisecond: 0};
        }
        if (this.hours || !this.relative){
            if (pos >= 0 && pos <= 2){
                return "hour";
            } else if (pos >= 3 && pos <= 5) {
                return "minute";
            } else if (pos >= 6 && pos <= 8 && this.seconds) {
                return "second";
            } else if (pos >= 9 && pos <= 12 && this.seconds && this.millis){
                return "millisecond";
            } else {
                return null;
            }
        } else {
            if (pos >= 0 && pos <= 2){
                return "minute";
            } else if (pos >= 3 && pos <= 5){
                return "second";
            } else if (pos >= 6 && pos <= 9 && this.seconds && this.millis){
                return "millisecond";
            }
        }
    }

    __afterSpin(spinningValue){
        let afterspinResult = true;
        let input = this._input;
        this.__updateValue();
        if (this.hours || !this.relative) {
            if (spinningValue === "hour") {
                input.selectionStart = 0;
                input.selectionEnd = 2;
            } else if (spinningValue === "minute") {
                input.selectionStart = 3;
                input.selectionEnd = 5;
            } else if (spinningValue === "second") {
                input.selectionStart = 6;
                input.selectionEnd = 8;
            } else if (spinningValue === "millisecond") {
                input.selectionStart = 9;
                input.selectionEnd = 12;
            }
        } else {
            if (spinningValue === "minute"){
                input.selectionStart = 0;
                input.selectionEnd = 2;
            } else if (spinningValue === "second"){
                input.selectionStart = 3;
                input.selectionEnd = 5;
            } else if (spinningValue === "millisecond"){
                input.selectionStart = 6;
                input.selectionEnd = 9;
            }
        }
        input.focus();

        let event = new Event("change", {});
        this.dispatchEvent(event);

        return afterspinResult;
    }

    __spinMillisecondUp(){
        this.__value.millisecond++;
        if (this.__value.millisecond > 999){
            if (this.__spinSecondUp()){
                this.__value.millisecond = 0;
            } else {
                this.__value.millisecond = 999;
                return false;
            }
        }
        return true;
    }

    __spinSecondUp(){
        this.__value.second++;
        if (this.__value.second > 59){
            if (this.__spinMinuteUp()){
                this.__value.second = 0;
            } else {
                this.__value.second = 59;
                return false;
            }
        }
        return true;
    }

    __spinMinuteUp(){
        this.__value.minute++;
        if (this.__value.minute > 59){
            if (this.__spinHourUp()){
                this.__value.minute = 0;
            } else {
                this.__value.minute = 59;
                return false;
            }
        }
        return true;
    }

    __spinHourUp(){
        if (this.relative && !this.hours){
            this.__value.hour = 0;
            return false;
        }
        this.__value.hour++;
        if (this.__value.hour > 23 && !this.relative){
            this.__value.hour = 23;
            return false;
        }
        return true;
    }

    __spinMillisecondDown(){
        this.__value.millisecond--;
        if (this.__value.millisecond < 0){
            if (this.__spinSecondDown()){
                this.__value.millisecond = 999;
            } else {
                this.__value.millisecond = 0;
                return false;
            }
        }
        return true;
    }

    __spinSecondDown(){
        this.__value.second--;
        if (this.__value.second < 0){
            if (this.__spinMinuteDown()){
                this.__value.second = 59;
            } else {
                this.__value.second = 0;
                return false;
            }
        }
        return true;
    }

    __spinMinuteDown(){
        this.__value.minute--;
        if (this.__value.minute < 0){
            if (this.__spinHourDown()){
                this.__value.minute = 59;
            } else {
                this.__value.minute = 0;
                return false;
            }
        }
        return true;
    }

    __spinHourDown(){
        this.__value.hour--;
        if (this.__value.hour < 0){
            this.__value.hour = 0;
            return false;
        }
        return true;
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get hours(){
        return this.getAttribute("hours") !== null;
    }

    set hours(value){
        if (value){
            this.setAttribute("hours", "");
        } else {
            this.removeAttribute("hours");
        }
    }

    get maxValue(){
        return this.__maxValue;
    }

    set maxValue(value){
        let time = {};
        if (value === null){
            this.__maxValue = null;
            return;
        } else if (typeof value === "string"){
            time = this.__parseTime(value);
        } else if (typeof value === "object") {
            Object.assign(time, value);
        } else {
            throw new TypeError("sci-time: the time value was entered incorrectly");
        }
        let max_ts = SciTime.timestamp(time);
        let min_ts = SciTime.timestamp(this.minValue);
        if (min_ts !== null && min_ts > max_ts){
            throw new TypeError("sci-time: maxValue shall not be lower than the minValue");
        }
        this.__maxValue = time;
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
        return this.__minValue;
    }

    set minValue(value){
        let time = {};
        if (value === null){
            this.__minValue = null;
            return;
        } else if (typeof value === "string"){
            time = this.__parseTime(value);
        } else if (typeof value === "object"){
            Object.assign(time, value);
        } else {
            throw new TypeError("sci-time: the time value was entered incorrectly");
        }
        let min_ts = SciTime.timestamp(time);
        let max_ts = SciTime.timestamp(this.maxValue);
        if (max_ts !== null && max_ts < min_ts){
            throw new TypeError("sci-time: minValue can't be greater than the maxValue");
        }
        this.__minValue = time;
        this.__updateValue();
    }

    get relative(){
        return this.__relative;
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
        let value = this.getAttribute("seconds") !== null;
        if (this.relative){
            value = true;
        }
        return value;
    }

    set seconds(value){
        if (value){
            this.setAttribute("seconds", "");
        } else {
            this.removeAttribute("seconds");
        }
    }

    get value(){
        this._input.errorMessage = "";
        let value = this.__value;
        if (value === null && this.required){
            this._input.errorMessage = "Укажите время";
            throw new TypeError("sci-time: the time value was not entered by the user");
        }
        return Object.assign(value);
    }

    set value(value){
        let time = {};
        if (value === null){
            time = null;
        } else if (typeof value === "string") {
            time = this.__parseTime(value);
        } else if (typeof value === "object" && value instanceof Date){
            time = {
                hour: value.getHours(),
                minute: value.getMinutes(),
                second: value.getSeconds(),
                millisecond: value.getMilliseconds()
            }
        } else if (typeof value === "object"){
            Object.assign(time, value);
            this.__checkTime(time);
        } else {
            throw new TypeError("sci-time: error in setting value property");
        }

        let value_ts = SciTime.timestamp(time);
        let min_ts = SciTime.timestamp(this.minValue);
        let max_ts = SciTime.timestamp(this.maxValue);

        if (min_ts !== null && min_ts > value_ts){
            throw new TypeError("sci-time: The value set is too small");
        }

        if (max_ts !== null && max_ts < value_ts){
            throw new TypeError("sci-time: the value set is too large");
        }

        this.__value = time;
        this.__updateValue();
    }

    getValue(dt){
        let value = this.value;
        dt.setHours(value.hour, value.minute, value.second, value.millisecond);
    }

}

SciTime.observedAttributes = ["disabled", "hours", "label", "maxvalue", "millis", "minvalue", "seconds", "width"];

SciTime.timestamp = function(time){
    let timestamp = null;
    if (time !== null){
        timestamp = 3600 * time.hour + 60 * time.minute + time.second + 1e-3 * time.millisecond;
    }
    return timestamp;
}