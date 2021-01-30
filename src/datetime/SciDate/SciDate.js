class SciDate extends SciExpandableWidget{

    constructor(){
        super();
        let self = this;

        if (SciDate.template === null){
            SciDate.template = this._createTemplate(SciDate.templateText);
            let index = 0;
            for (let element of SciDate.template.content.querySelectorAll("th")){
                element.innerHTML = SciDate.weekDays[index];
                index++;
            }
        }

        let template = SciDate.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(template);

        this._implementExpansion();

        let defaultValue = this.getAttribute("value");
        if (defaultValue !== null){
            this.__defaultValue = new Date(defaultValue);
            this.__defaultValue.setHours(0, 0, 0);
        } else {
            this.__defaultValue = null;
        }

        this.value = this.defaultValue;

        this.addEventListener("sci-open", event => {
            self._openCalendar();
        });

        this.content.querySelector("#prev-decade").addEventListener("click", event => {
            if (self.disabled || event.target.classList.contains("useless")){
                return;
            }

            self.__currentDate.setFullYear(self.__currentDate.getFullYear() - 10);
            self._updateCurrentValue();
        });

        this.content.querySelector("#prev-year").addEventListener("click", event => {
            if (self.disabled || event.target.classList.contains("useless")){
                return;
            }

            self.__currentDate.setFullYear(self.__currentDate.getFullYear() - 1);
            self._updateCurrentValue();
        });

        this.content.querySelector("#next-year").addEventListener("click", event => {
            if (self.disabled || event.target.classList.contains("useless")){
                return;
            }

            self.__currentDate.setFullYear(self.__currentDate.getFullYear() + 1);
            self._updateCurrentValue();
        });

        this.content.querySelector("#next-decade").addEventListener("click", event => {
            if (self.disabled || event.target.classList.contains("useless")){
                return;
            }

            self.__currentDate.setFullYear(self.__currentDate.getFullYear() + 10);
            self._updateCurrentValue();
        });

        this.content.querySelector("#prev-month").addEventListener("click", event => {
            if (self.disabled || event.target.classList.contains("useless")){
                return;
            }

            let m = this.__currentDate.getMonth();
            while (this.__currentDate.getMonth() === m){
                this.__currentDate.setMonth(m-1);
            }
            self._updateCurrentValue();
        });

        this.content.querySelector("#next-month").addEventListener("click", event => {
            if (self.disabled || event.target.classList.contains("useless")){
                return;
            }

            self.__currentDate.setMonth(self.__currentDate.getMonth() + 1);
            self._updateCurrentValue();
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "inline") {
            this._openCalendar();
        } else if (name === "maxvalue") {
            this._openCalendar();
        } else if (name === "minvalue") {
            this._openCalendar();
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get _autoadjustOpen() { return false; }

    _updateValue(){
        this.errorMessage = "";
        let value = this.__value;
        if (value === null){
            this.text = "";
            this.__currentDate = null;
        } else {
            this.text = value.toLocaleDateString();
            this.__currentDate = new Date(value);
        }
        this._openCalendar();
    }

    _openCalendar(){
        if (this.__value !== null){
            this.__currentDate = new Date(this.__value);
        }
        this._updateCurrentValue();
    }

    _updateCurrentValue(){
        let minDate = this.minValue;
        let maxDate = this.maxValue;
        let currentDate = this.__correctDate(minDate, maxDate);
        let calendar = this.content.querySelector("tbody");
        this.__putYear(currentDate, minDate, maxDate);
        this.__putMonth(currentDate, minDate, maxDate);
        calendar.innerHTML = "";
        let iterationDate = new Date(currentDate);
        iterationDate.setDate(1);
        let nextDate = new Date(iterationDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        while (iterationDate.getDay() !== 1){
            iterationDate.setDate(iterationDate.getDate() - 1);
        }
        while (iterationDate.getMonth() !== nextDate.getMonth() || iterationDate.getDay() !== 1){
            let classList = [];
            if (this.__value !== null && this.__value.getTime() === iterationDate.getTime()){
                classList.push("selected");
            }
            if (iterationDate.getMonth() !== currentDate.getMonth()){
                classList.push("wrong-month");
            }
            this.__putDate(calendar, iterationDate, classList, minDate, maxDate);
            iterationDate.setDate(iterationDate.getDate() + 1);
        }
        this._adjustOpen();
    }

    __correctDate(minDate, maxDate){
        let currentDate = this.__currentDate;
        if (currentDate === null){
            currentDate = new Date();
            currentDate.setHours(0, 0, 0);
        }
        if (minDate !== null && currentDate.getTime() < minDate.getTime()){
            currentDate = new Date(minDate);
        }
        if (maxDate !== null && currentDate.getTime() > maxDate.getTime()){
            currentDate = new Date(maxDate);
        }
        this.__currentDate = currentDate;
        return currentDate;
    }

    __putYear(currentDate, minDate, maxDate){
        this.content.querySelector("#year").innerHTML = currentDate.getFullYear().toString();
        let prevDecade = this.content.querySelector("#prev-decade");
        let prevYear = this.content.querySelector("#prev-year");
        let nextYear = this.content.querySelector("#next-year");
        let nextDecade = this.content.querySelector("#next-decade");
        for (let widget of [prevDecade, prevYear, nextYear, nextDecade]){
            if (widget.classList.contains("useless")){
                widget.classList.remove("useless");
            }
        }
        if (minDate !== null && currentDate.getFullYear() === minDate.getFullYear()){
            prevDecade.classList.add("useless");
            prevYear.classList.add("useless");
        }
        if (maxDate !== null && currentDate.getFullYear() === maxDate.getFullYear()){
            nextYear.classList.add("useless");
            nextDecade.classList.add("useless");
        }
    }

    __putMonth(date, minDate, maxDate){
        this.content.querySelector("#month").innerHTML = SciDate.months[date.getMonth()];

        let prevMonth = this.content.querySelector("#prev-month");
        let nextMonth = this.content.querySelector("#next-month");
        for (let widget of [prevMonth, nextMonth]){
            if (widget.classList.contains("useless")){
                widget.classList.remove("useless");
            }
        }

        if (minDate !== null &&
            date.getFullYear() === minDate.getFullYear() && date.getMonth() === minDate.getMonth()){
            prevMonth.classList.add("useless");
        }

        if (maxDate !== null &&
            date.getFullYear() === maxDate.getFullYear() && date.getMonth() === maxDate.getMonth()){
            nextMonth.classList.add("useless");
        }
    }

    __putDate(calendar, date, classList, minDate, maxDate){
        let row;
        if (calendar.rows.length === 0){
            row = calendar.insertRow();
        } else {
            row = calendar.rows[calendar.rows.length - 1];
            if (row.cells.length >= 7){
                row = calendar.insertRow();
            }
        }
        let cell = row.insertCell();
        cell.innerHTML = date.getDate().toString();
        for (let newClass of classList){
            cell.classList.add(newClass);
        }
        if (minDate !== null && date.getTime() < minDate.getTime()){
            cell.classList.add("disabled");
        }
        if (maxDate !== null && date.getTime() > maxDate.getTime()){
            cell.classList.add("disabled");
        }
        cell.dataset.date = date.toISOString();
        let handler = function(event){
            event.stopPropagation();
            event.preventDefault();

            if (this.disabled || event.target.classList.contains("disabled")){
                return;
            }

            this.value = new Date(event.target.dataset.date);
            this.close();

            let newEvent = new Event("change", {});
            this.dispatchEvent(newEvent);
        }.bind(this);
        cell.addEventListener("click", handler);
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get maxValue(){
        if (this.getAttribute("maxvalue") === null){
            return null;
        }
        let d = new Date(this.getAttribute("maxvalue"));
        d.setHours(0, 0, 0);
        return d;
    }

    set maxValue(value){
        if (value !== null){
            let d = new Date(value);
            d.setHours(0, 0, 0);
            this.setAttribute("maxvalue", d.toISOString());
        } else {
            this.removeAttribute("maxvalue");
        }
    }

    get minValue(){
        if (this.getAttribute("minvalue") === null){
            return null;
        }
        let d = new Date(this.getAttribute("minvalue"));
        d.setHours(0, 0, 0);
        return d;
    }

    set minValue(value){
        if (value !== null){
            let d = new Date(value);
            d.setHours(0, 0, 0);
            this.setAttribute("minvalue", d.toISOString());
        } else {
            this.removeAttribute("minvalue");
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
        let value = this.__value;
        if (value === null && this.required){
            this.errorMessage = "Пожалуйста, укажите дату";
            throw new TypeError("sci-date: the date was not set by the user");
        }
        if (value !== null){
            value = new Date(value);
        }
        return value;
    }

    set value(value){
        if (value !== null) {
            let d = new Date(value);
            d.setHours(0, 0, 0);
            if (this.minValue !== null && d.getTime() < this.minValue.getTime()){
                throw new TypeError("Error in setting value to sci-date: minvalue restriction failed");
            }
            if (this.maxValue !== null && d.getTime() > this.maxValue.getTime()){
                throw new TypeError("Error in setting value to sci-date: maxvalue restriction failed");
            }
            this.__value = d;
        } else {
            this.__value = null;
        }
        this._updateValue();
    }

}

SciDate.months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь",
    "Октябрь", "Ноябрь", "Декабрь"];

SciDate.weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

SciDate.observedAttributes = ["disabled", "inline", "label", "maxvalue", "minvalue", "opened", "width"];