class SciWidget extends HTMLElement{

    constructor(){
        super();
    }

    _createTemplate(templateText){
        let template = document.createElement("template");
        template.innerHTML = templateText;
        return template;
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.shadowRoot.querySelector("label").innerHTML = newValue;
        } else if (name === "disabled") {
            if (newValue !== null) {
                this._disableChildren();
            } else {
                this._enableChildren();
            }
        } else if (name === "height") {
            if (newValue !== null) {
                this.style.setProperty("height", newValue + "px");
            } else {
                this.style.removeProperty("height");
            }
        } else if (name === "width"){
            if (newValue !== null){
                this.style.setProperty("width", newValue + "px");
            } else {
                this.style.removeProperty("width");
            }
        } else {
            console.warn(`The attribute ${name} has been changed from ${oldValue} to ${newValue} but no attribute
change callback is defined for this type of attribute`);
        }
    }

    get disabled(){
        return this.getAttribute("disabled") !== null;
    }

    set disabled(value){
        if (value){
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }

    get enabled(){
        return this.getAttribute("disabled") === null;
    }

    set enabled(value){
        if (value){
            this.removeAttribute("disabled");
        } else {
            this.setAttribute("disabled", "");
        }
    }

    get errorMessage(){
        let element = this.shadowRoot.querySelector(".error-message");
        let message = "";
        if (element && element.classList.contains("on")){
            message = element.innerHTML;
        }
        return message;
    }

    set errorMessage(msg){
        let element = this.shadowRoot.querySelector(".error-message");
        if (element){
            if (msg){
                element.innerHTML = msg;
                if (!element.classList.contains("on")){
                    element.classList.add("on");
                }
            } else {
                element.innerHTML = "";
                if (element.classList.contains("on")){
                    element.classList.remove("on");
                }
            }
        }
    }

    get height(){
        return parseFloat(window.getComputedStyle(this).height);
    }

    set height(value){
        value = parseFloat(value).toString();
        this.setAttribute("height", value);
    }

    get label(){
        return this.getAttribute("label");
    }

    set label(value){
        this.setAttribute("label", value);
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

    get tabIndex(){
        return parseInt(this.getAttribute("tab-index"));
    }

    set tabIndex(value){
        value = parseInt(value);
        if (isNaN(value)){
            this.removeAttribute("tab-index");
        } else {
            this.setAttribute("tab-index", value);
        }
    }

    get width(){
        return parseFloat(window.getComputedStyle(this).width);
    }

    set width(value){
        value = parseFloat(value).toString();
        this.setAttribute("width", value);
    }

    enable(){
        this.removeAttribute("disabled");
    }

    disable(){
        this.setAttribute("disabled", "");
    }

    _disableChildren(){}
    _enableChildren(){}

}

SciWidget.PROPERTIES = {
    scrollSpeed: 1.0
}

SciWidget.detectMobile = function(){
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
}