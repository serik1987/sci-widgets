class SciLivesearch extends SciExpandableWidget{

    constructor(){
        super();
        let self = this;

        if (SciLivesearch.template === null){
            let template = document.createElement("template");
            template.innerHTML = SciLivesearch.templateText;
            SciLivesearch.template = template;
        }

        let content = SciLivesearch.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__input = shadow.querySelector("sci-input");
        let hamburger = shadow.querySelector(".hamburger");
        this.__focused = false;
        this.__onUpdate = null;

        this.__defaultValue = this.getAttribute("value");
        if (this.__defaultValue === null){
            this.__defaultValue = "";
        }
        this.__value = this.__defaultValue;
        this.input.value = this.__defaultValue;
        this.__id = null;
        this.__validators = {};

        this._implementExpansion();

        this.input.addEventListener("focus", event => {
            if (self.__openCondition()){
                self.open();
            }
            self.__focused = true;
        });

        this.input.addEventListener("blur", event => {
            self.close();
            self.__focused = false;
        });

        this.content.addEventListener("mousedown", event => {
            event.preventDefault();
        });

        this.content.addEventListener("click", event => {
            let target = event.target.closest("li");
            if (target !== null && !self.noAutofill && !target.classList.contains("disabled") && self.enabled){
                self.close();
                let id = target.dataset.value;
                if (id){
                    self.__id = id;
                    self.input.value = self.__value = self.items[id].text;
                    let newEvent = new Event("change", event);
                    self.dispatchEvent(newEvent);
                } else {
                    self.__id = null;
                }
            }
            if (target !== null && target.classList.contains("disabled")){
                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.input.ready = true;
        this.input.checkFunc = value => value === self.__value;
        this.input.updateFunc = value => self.__livesearch(value, true);
        this.input.addEventListener("input", event => {
            self.__id = null;
        });

        this.updateItems();
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.input.label = newValue;
        } else if (name === "align") {
            this.input.align = newValue;
        } else if (name === "placeholder") {
            this.input.placeholder = newValue;
        } else if (name === "position"){
            this.input.position = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __livesearch(value, autoopen){
        let self = this;
        if (this.onUpdate === null){
            throw new TypeError("sci-livesearch: Please, set the value to onUpdate property: the value shall return " +
                "some promise");
        }
        this.input.ready = false;
        this.__value = value;
        let promise = null;
        if (value.length > 0){
            promise = this.onUpdate.call(this, value)
                .then(output => {
                    if (output instanceof Array){
                        self.items.clear();
                        let items = [];
                        for (let itemInfo of output){
                            let item = null;
                            if (typeof itemInfo.description === "string"){
                                item = SciDoubleItem.create(itemInfo.value, itemInfo.text, itemInfo.description);
                            } else if (itemInfo.optional){
                                item = SciOptionalItem.create(itemInfo.value, itemInfo.text);
                            } else {
                                item = SciSimpleItem.create(itemInfo.value, itemInfo.text);
                            }
                            items.push(item);
                        }
                        self.items.addItems.apply(self.items, items);
                    } else if (output instanceof SciItemList) {
                        let ul = self.querySelector("ul");
                        if (ul !== null){
                            ul.remove();
                        }
                        self.append(output.element);
                        self.__items = output;
                        self._adjustOpen();
                    }
                });
        } else {
            this.items.clear();
            this.close();
            promise = Promise.resolve();
        }
        return promise
            .then(() => {
                if (autoopen){
                    if (self.__openCondition()){
                        self.open();
                    } else {
                        self.close();
                    }
                }
                let event = new CustomEvent("change", {});
                self.dispatchEvent(event);
                self.input.ready = true;
            })
            .catch(e => {
                self.items.clear();
                self.close();
                self.input.ready = true;
                throw e;
            });
    }

    __openCondition(){
        let isOpen = true;

        if (this.items.length === 0){
            isOpen = false;
        }

        if (this.items.length === 1 && this.items.getItem(0).text === this.input.value){
            isOpen = false;
        }

        return isOpen;
    }

    get _openOnClick(){
        return false;
    }

    _onChange(){
        this._adjustOpen();
    }

    _enableChildren(){
        this.input.enable();
    }

    _disableChildren(){
        this.input.disable();
    }

    get align(){
        let align = this.getAttribute("align");
        if (align === null){
            align = "left";
        }

        return align;
    }

    set align(value){
        this.setAttribute("align", value);
    }

    get errorMessage(){
        return this.input.errorMessage;
    }

    set errorMessage(value){
        this.input.errorMessage = value;
    }

    get focused(){
        return this.__focused;
    }

    get id(){
        return this.__id;
    }

    set id(value){
        this.__id = value;
    }

    get input(){
        return this.__input;
    }

    get items(){
        return this.__items;
    }

    get noAutofill(){
        return this.getAttribute("no-autofill") !== null;
    }

    set noAutofill(value){
        if (value){
            this.setAttribute("no-autofill", "");
        } else {
            this.removeAttribute("no-autofill");
        }
    }

    get onUpdate(){
        return this.__onUpdate;
    }

    set onUpdate(value){
        if (typeof value !== "function"){
            throw new TypeError("sci-livesearch: the onUpdate property accepts only functions");
        }
        this.__onUpdate = value;
    }

    get placeholder(){
        return this.getAttribute("placeholder");
    }

    set placeholder(value){
        this.setAttribute("placeholder", value);
    }

    get position(){
        let position = this.getAttribute("position");
        if (!position){
            position = "top";
        }
        return position;
    }

    set position(value){
        this.setAttribute("position", value);
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

    get text(){
        return this.value;
    }

    set text(value){
        this.__value = value;
        this.input.value = value;
    }

    get value(){
        this.errorMessage = "";
        let value = this.__value;

        for (let key of Reflect.ownKeys(this.__validators)){
            if (typeof key === "symbol"){
                let f = this.__validators[key].checker;
                let msg = this.__validators[key].message;
                if (!f(value)){
                    this.errorMessage = msg;
                    throw new TypeError("sci-livesearch: the input value entered by the user is not validated");
                }
            }
        }

        if (this.id === null && this.required){
            this.errorMessage = "Пожалуйста, выберите нужную опцию из списка";
            throw new TypeError("sci-livesearch: the input entered by the user is not correct");
        }

        return value;
    }

    set value(value){}

    addValidator(validator, message){
        let id = Symbol("validator");
        if (validator instanceof RegExp){
            let expression = validator;
            validator = value => value.match(expression) !== null;
        }
        this.__validators[id] = {
            checker: validator,
            message: message
        }

        return id;
    }

    removeValidator(id){
        delete this.__validators[id];
    }

    search(value, autoopen=true){
        this.input.value = value;
        this.__livesearch(value, autoopen);
    }

    updateItems(){
        let htmlList = this.querySelector("ul");
        if (htmlList === null){
            htmlList = document.createElement("ul");
            this.append(htmlList);
        }
        this.__items = new SciItemList(this, htmlList);
        this._adjustOpen();
    }

}

SciLivesearch.observedAttributes = ["align", "disabled", "label", "placeholder", "position", "width"];

