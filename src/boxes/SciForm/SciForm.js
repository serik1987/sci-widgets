class SciForm extends SciScrollable{

    constructor(){
        super();
        let self = this;

        if (SciForm.template === null){
            SciForm.template = this._createTemplate(SciForm.templateText);
        }

        let content = SciForm.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);
        this._implementScroll();

        this.__defaultValue = null;
        this.__onSubmit = null;
        this.__onReset = null;

        this.addEventListener("click", event => {
            if (self.disabled){
                return;
            }

            let target = event.target;
            if (target.classList.contains("submit") || target.name === "submit"){
                self.submit();
                let newEvent = new CustomEvent("sci-submit", {bubbles: true});
                self.dispatchEvent(newEvent);
            }
            if (target.classList.contains("reset") || target.name === "reset"){
                self.reset();
                let newEvent = new CustomEvent("sci-reset", {bubbles: true});
                self.dispatchEvent(newEvent);
            }
        });
    }

    __updateChildren(){
        for (let localName in this.__defaultValue){
            if (this.__defaultValue.hasOwnProperty(localName)){
                let localValue = this.__defaultValue[localName];
                let element = this.getElement(localName);
                if (element !== null){
                    element.value = localValue;
                }
            }

        }
    }

    _enableChildren() {
        for (let element of this.getElements()){
            element.enable();
        }
    }

    _disableChildren(){
        for (let element of this.getElements()){
            element.disable();
        }
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get onReset(){
        return this.__onReset;
    }

    set onReset(value){
        if (typeof value === "function" || value === null){
            this.__onReset = value;
            this.reset();
        } else {
            throw new TypeError("sci-form: bad value for onReset property");
        }
    }

    get onSubmit(){
        return this.__onSubmit;
    }

    set onSubmit(value){
        if (typeof value === "function" || value === null){
            this.__onSubmit = value;
        } else {
            throw new TypeError("sci-form: bad value for onSubmit property");
        }
    }

    get value(){
        let value = {};
        let noErrors = true;

        for (let element of this.getElements()){
            let elementName = element.getAttribute("name");
            let elementValue = null;
            try{
                elementValue = element.value;
            } catch (TypeError){
                noErrors = false;
            }
            if (elementValue !== undefined){
                value[elementName] = elementValue;
            }
        }

        if (!noErrors){
            throw new TypeError("sci-form: some of the fields were filled incorrectly by the user");
        }

        return value;
    }

    set value(value){
        this.__defaultValue = {...value};
        this.__updateChildren();
    }

    getElement(name){
        return this.querySelector(`[name=${name}]`);
    }

    getElements(){
        return this.querySelectorAll("[name]");
    }

    reset(){
        let self = this;
        if (self.onReset === null){
            for (let element of this.getElements()){
                try{
                    element.value = null;
                } catch (e){}
            }
            this.__updateChildren();
            return Promise.resolve();
        } else {
            return self.onReset()
                .then(newData => {
                    this.value = newData;
                })
                .catch(() => {});
        }
    }

    submit(){
        let self = this;
        let data;
        try{
            data = self.value;
        } catch (e){
            if (e instanceof TypeError){
                return;
            } else {
                throw e;
            }
        }

        if (typeof self.onSubmit === "function"){
            return self.onSubmit(data)
                .then(newData => {
                    self.value = newData;
                })
                .catch(messageList => {
                    for (let messageName in messageList){
                        if (messageList.hasOwnProperty(messageName)){
                            let message = messageList[messageName];
                            let element = self.getElement(messageName);
                            if (element !== null){
                                element.errorMessage = message;
                            }
                        }
                    }
                });
        } else {
            return Promise.resolve();
        }
    }

}

SciForm.observedAttributes = ["disabled", "padding", "width"];