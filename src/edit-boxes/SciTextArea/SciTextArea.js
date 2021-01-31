class SciTextArea extends SciEditor{

    constructor(){
        super();

        if (!SciTextArea.template){
            SciTextArea.template = this._createTemplate(SciTextArea.templateText);
        }

        let template = SciTextArea.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(template);

        let textArea = shadow.querySelector("textarea");
        textArea.addEventListener("change", event => {
            event.stopPropagation();
            let newEvent = new Event("change", event);
            this.dispatchEvent(newEvent);
        })
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "maxlength") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("textarea").setAttribute("maxlength", newValue);
            } else {
                this.shadowRoot.querySelector("textarea").removeAttribute("maxlength");
            }
        } else if (name === "minlength") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("textarea").setAttribute("minlength", newValue);
            } else {
                this.shadowRoot.querySelector("textarea").removeAttribute("minlength");
            }
        } else if (name === "placeholder") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("textarea").setAttribute("placeholder", newValue);
            } else {
                this.shadowRoot.querySelector("textarea").removeAttribute("placeholder");
            }
        } else if (name === "readonly") {
            if (newValue !== null) {
                this.shadowRoot.querySelector("textarea").setAttribute("readonly", "");
            } else {
                this.shadowRoot.querySelector("textarea").removeAttribute("readonly");
            }
        } else if (name === "tab-index"){
            if (newValue !== null){
                this.shadowRoot.querySelector("textarea").setAttribute("tabindex", newValue);
            } else {
                this.shadowRoot.querySelector("textarea").removeAttribute("tabindex");
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get rawValue(){
        return this.shadowRoot.querySelector("textarea").value;
    }

    get selectionStart(){
        return this.shadowRoot.querySelector("textarea").selectionStart;
    }

    set selectionStart(value){
        this.shadowRoot.querySelector("textarea").selectionStart = parseInt(value);
    }

    get selectionEnd(){
        return this.shadowRoot.querySelector("textarea").selectionEnd;
    }

    set selectionEnd(value){
        this.shadowRoot.querySelector("textarea").selectionEnd = parseInt(value);
    }

    get value(){
        this.errorMessage = null;
        let value = this.shadowRoot.querySelector("textarea").value;
        if (value.length < this.minLength){
            this.errorMessage = `Пожалуйста, укажите не менее ${this.minLength} символов`;
            throw new TypeError("The value entered by the user is not correct");
        }
        if (value.length > this.maxLength){
            this.errorMessage = `Пожалуйста, укажите не более ${this.maxLength} символов`;
            throw new TypeError("The value entered by the user is not correct");
        }
        return value;
    }

    set value(value){
        this.shadowRoot.querySelector("textarea").value = value;
    }

    blur(){
        this.shadowRoot.querySelector("textarea").blur();
    }

    click(){
        this.shadowRoot.querySelector("textarea").click();
    }

    focus(){
        this.shadowRoot.querySelector("textarea").focus();
    }

    select(){
        this.shadowRoot.querySelector("textarea").focus();
    }

    setSelectionRange(start, end){
        this.shadowRoot.querySelector("textarea").setSelectionRange(start, end);
    }

    _enableChildren(){
        this.shadowRoot.querySelector("textarea").disabled = false;
    }

    _disableChildren(){
        this.shadowRoot.querySelector("textarea").disabled = true;
    }

}

SciTextArea.observedAttributes = ['label', 'value', 'position', 'align', 'disabled', 'height', 'maxlength', 'minlength',
    "placeholder", "readonly", "tab-index", "width"];

