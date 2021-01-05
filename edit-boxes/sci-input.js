class SciInput extends SciEditor{

    constructor(){
        super();

        if (!SciInput.template){
            SciInput.template = this._createTemplate(SciEditor.templateText);
        }

        let template = SciInput.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(template);

        this.__dimension = false;
        this.__checkers = {};
        this.__validators = {};
        this.__numberValidators = {};
        this.__oldValue = null;

        let input = shadow.querySelector("input");
        let self = this;

        input.addEventListener("input", event => {
            event.stopPropagation();
            if (self.__oldValue === null){
                self.__oldValue = this.defaultValue;
            }
            let newValue = input.value;
            let checkerResult = true;
            let keys = Reflect.ownKeys(this.__checkers);
            for (let key of keys){
                if (typeof key === "symbol"){
                    let checker = this.__checkers[key];
                    checkerResult = checkerResult && checker(this.__oldValue, newValue);
                }
            }
            if (!checkerResult){
                input.value = this.__oldValue;
            } else {
                input.value = newValue;
                this.__oldValue = newValue;
            }
            let newEvent = new InputEvent(event.type, event);
            self.dispatchEvent(newEvent);
        });

        input.addEventListener("change", event => {
            event.stopPropagation();
            let newEvent = new Event("change", event);
            self.dispatchEvent(newEvent);
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "type") {
            if (SciInput.supportedTypes.indexOf(newValue) === -1) {
                throw new TypeError("Attempt to set unsuitable value to the 'type' attribute");
            }
            if (SciInput.htmlTypes.indexOf(newValue) !== -1) {
                this.shadowRoot.querySelector("input").type = newValue;
            }
        } else if (name === "autocomplete") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("autocomplete", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("autocomplete");
            }
        } else if (name === "autosave") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("autosave", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("autosave");
            }
        } else if (name === "inputmode") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("inputmode", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("inputmode");
            }
        } else if (name === "list") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("list", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("list");
            }
        } else if (name === "maxlength") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("maxlength", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("maxlength");
            }
        } else if (name === "minlength") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("minlength", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("minlength");
            }
        } else if (name === "placeholder") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("placeholder", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("placeholder");
            }
        } else if (name === "readonly") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("input").setAttribute("readonly", "");
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("readonly");
            }
        } else if (name === "tab-index"){
            if (newValue !== null){
                this.shadowRoot.querySelector("input").setAttribute("tabindex", newValue);
            } else {
                this.shadowRoot.querySelector("input").removeAttribute("tabindex");
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get autocomplete(){
        let autocomplete = this.shadowRoot.querySelector("input").autocomplete;
        if (autocomplete === "on"){
            return true;
        } else if (autocomplete === "off"){
            return false;
        } else if (autocomplete === ""){
            return true;
        }
    }

    set autocomplete(value){
        if (value){
            value = "on";
        } else {
            value = "off";
        }
        this.shadowRoot.querySelector("input").autocomplete = value;
    }

    get dimension(){
        let dimensionString = this.getAttribute("dimension");
        let dimension;

        if (dimensionString === null){
            dimension = false;
        } else if (dimensionString === ""){
            dimension = true;
        } else {
            dimension = dimensionString;
        }

        return dimension;
    }

    set dimension(dimension){
        let dimensionString = dimension;
        if (dimension === true){
            dimensionString = "";
        }
        if (dimension === false){
            dimensionString = null;
        }
        if (dimensionString !== null){
            this.setAttribute("dimension", dimensionString);
        } else {
            this.removeAttribute("dimension");
        }
    }

    get inputmode(){
        return this.getAttribute("inputmode");
    }

    set inputmode(value){
        this.setAttribute("inputmode", value);
    }

    get rawValue(){
        return this.shadowRoot.querySelector("input").value;
    }

    get selectionStart(){
        return this.shadowRoot.querySelector("input").selectionStart;
    }

    set selectionStart(value){
        this.shadowRoot.querySelector("input").selectionStart = parseInt(value);
    }

    get selectionEnd(){
        return this.shadowRoot.querySelector("input").selectionEnd;
    }

    set selectionEnd(value){
        this.shadowRoot.querySelector("input").selectionEnd = value;
    }

    get type(){
        return this.getAttribute("type");
    }

    get value(){
        this.errorMessage = null;
        let dimension = this.dimension;
        let value = this.shadowRoot.querySelector("input").value;

        if (SciInput.integerTypes.indexOf(this.type) !== -1){
            value = parseInt(value);
            if (isNaN(value)){
                this.errorMessage = "Пожалуйста, введите целое число";
                throw new TypeError("The value entered by the user is not correct");
            }
            if (this.type === "positive-integer" && value <= 0){
                this.errorMessage = "Пожалуйста, введите положительное число";
                throw new TypeError("The value entered by the user is not correct");
            }
            if (this.type === "nonnegative-integer" && value < 0){
                this.errorMessage = "Данное значение не может быть отрицательным";
                throw new TypeError("The value entered by the user is not correct");
            }
        } else if (dimension !== false) {
            let number = parseFloat(value);
            if (isNaN(number)){
                this.errorMessage = "Пожалуйста, введите числовое значение";
                throw new TypeError("The value entered by the user is not correct");
            }
            let units = value.match(/\s*([A-Za-z]\w*)$/);
            if (units !== null){
                units = units[1];
            }

            let multiplier = 1.0;
            if (dimension === true){
                if (units !== null){
                    multiplier = SCI_UNITS[units];
                    if (multiplier === undefined){
                        this.errorMessage = "Вы неправильно указали единицы измерения";
                        throw new TypeError("The value entered by the user is not correct");
                    }
                }
            } else {
                let dimensionUnits = SCI_UNIT_GROUPS[dimension];
                multiplier = dimensionUnits[units];
                if (multiplier === undefined){
                    this.errorMessage = "Пожалуйста, поставьте после этого числового значения одну из следующих " +
                        "единиц измерения: " + Object.keys(dimensionUnits).join(", ");
                    throw new TypeError("The value entered by the user is not correct");
                }
            }

            value = number * multiplier;
        } else {
            if (value.length < this.minLength){
                this.errorMessage = `Пожалуйста, введите не менее ${this.minLength} символов`;
                throw new TypeError("The value entered by the user is not correct");
            }
            if (value.length > this.maxLength){
                this.errorMessage = `Пожалуйста, введите не более ${this.maxLength} символов`;
                throw new TypeError("The value entered by the user is not correct");
            }

            let validatorKeys = Reflect.ownKeys(this.__validators);
            for (let validatorId of validatorKeys){
                let validator = this.__validators[validatorId];
                if (!validator.func(value)){
                    this.errorMessage = validator.message;
                    throw new TypeError("The value entered by the user is not correct");
                }
            }
        }

        if (typeof value === "number"){
            let validatorKeys = Reflect.ownKeys(this.__numberValidators);
            for (let validatorId of validatorKeys){
                let validator = this.__numberValidators[validatorId];
                if (!validator.condition(value)){
                    this.errorMessage = validator.message;
                    throw new TypeError("The value entered by the user is not correct");
                }
            }
        }

        return value;
    }

    set value(value){
        this.shadowRoot.querySelector("input").value = value;
        this.__oldValue = value;
    }

    get units(){
        let units = this.rawValue.match(/\s*([A-Za-z]\w*)$/);
        if (units !== null){
            units = units[1];
        }
        return units;
    }

    addChecker(func){
        let checkerId = Symbol("checker");
        this.__checkers[checkerId] = func;
        return checkerId;
    }

    addNumberValidator(condition, message){
        let validatorId = Symbol("number_validator");
        this.__numberValidators[validatorId] = {
            condition: condition,
            message: message
        }
        return validatorId;
    }

    addValidator(validator, message){
        if (validator instanceof RegExp){
            let validatingExpression = validator;
            validator = value => validatingExpression.test(value);
        }
        let validatorId = Symbol("validator");
        this.__validators[validatorId] = {
            func: validator,
            message: message
        }
        return validatorId;
    }

    blur(){
        this.shadowRoot.querySelector("input").blur();
    }

    click(){
        this.shadowRoot.querySelector("input").click();
    }

    focus(){
        this.shadowRoot.querySelector("input").focus();
    }

    removeChecker(checkerId){
        delete this.__checkers[checkerId];
    }

    removeNumberValidator(validatorId){
        delete this.__numberValidators[validatorId];
    }

    removeValidator(validatorId){
        delete this.__validators[validatorId];
    }

    select(){
        this.shadowRoot.querySelector("input").select();
    }

    setSelectionRange(start, end){
        this.shadowRoot.querySelector("input").setSelectionRange(start, end);
    }

    _enableChildren(){
        this.shadowRoot.querySelector("input").disabled = false;
    }

    _disableChildren(){
        this.shadowRoot.querySelector("input").disabled = true;
    }

}

SciInput.template = null;

SciInput.observedAttributes = ['label', 'type', 'value', 'position', 'align', 'autocomplete', 'autosave', 'disabled',
    'inputmode', 'list', 'maxlength', 'minlength', 'placeholder', 'readonly', 'tab-index', "width"];

SciInput.supportedTypes = ['integer', 'positive-integer', 'nonnegative-integer', 'text', 'email', 'number', 'password',
    'search', 'url'];

SciInput.integerTypes = ['integer', 'positive-integer', 'nonnegative-integer'];
SciInput.htmlTypes = ['text', 'email', 'number', 'password', 'search', 'url'];

SciInput.REQUIRED = /^.+$/;
SciInput.EMAIL = /^[\w\-\_.,]+@[=\w\-\_.,]+$/;
SciInput.PHONE = /^[+]*\d?[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

SciEditor.templateText = `
    <style>
            @import url(../core-styles.css);
            
            :host(.align-right) input{
                text-align: right;
            }
            
            :host(.align-center) input{
                text-align: center;
            }
            
            :host(.align-left) input{
                text-align: left;
            }
            
            label{
                margin-bottom: 2px;
            }
            
            input{
                background: #fff;
                border: none;
                border-bottom: 1px solid #aaa;
                outline: none;
                width: 100%;
                padding: 0px;
                height: 21px;
                line-height: 21px;
            }
            
            input[disabled]{
                color: rgb(186, 196, 209);
            }
            
            input:focus{
                border-bottom-color: #333;
            }
    </style>
    <label>WARNING: &lt;sci-input&gt; tag has been passed without label attribute. Please, insert this attribute</label>
    <div class="input-wrapper immediate-wrapper">
        <input type="text"/>
    </div>
    <div class="error-message"></div>
`;

customElements.define("sci-input", SciInput);