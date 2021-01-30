class SciComboBox extends SciExpandableWidget{
    constructor(){
        super();
        let self = this;

        if (SciComboBox.template === null){
            SciComboBox.template = this._createTemplate(SciComboBox.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let content = SciComboBox.template.content.cloneNode(true);
        shadow.append(content);
        this._implementExpansion();

        this.__defaultValue = null;
        if (this.getAttribute("value")){
            this.__defaultValue = this.getAttribute("value");
        }

        this.updateItems();
        this.value = this.defaultValue;

        this.__preventDefault = this.getAttribute("prevent-default") !== null;

        this.content.addEventListener("click", event => {
            let target = event.target.closest("li");
            if (target !== null && !this.__preventDefault && !target.classList.contains("disabled")){
                self.value = target.dataset.value;
                self.close();
                let newEvent = new Event("change", event);
                self.dispatchEvent(newEvent);
            }
            if (target !== null && target.classList.contains("disabled")){
                event.stopPropagation();
                event.preventDefault();
            }
        });
    }

    get _autoadjustOpen(){
        return true;
    }

    _onChange(){
        this._adjustOpen();
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get items(){
        return this.__items;
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

    get selectedIndex(){
        let value = this.value;
        let item = this.items[value];
        return this.items.indexOf(item);
    }

    get value(){
        this.errorMessage = "";
        let value = this.__value;
        if (value === null && this.required){
            this.errorMessage = "Пожалуйста, выберите нужное значение";
            throw new TypeError("sci-combo-box: The value is not selected by user");
        }
        return value;
    }

    set value(value){
        let item = null;
        if (value !== null){
            item = this.items[value];
            if (item === null || item === undefined){
                value = null;
                this.text = "";
            } else {
                this.text = item.text;
            }
        } else {
            this.text = "";
        }
        this.__value = value;
    }

    updateItems(){
        this.__items = new SciItemList(this, this.querySelector("ul"));
        this._adjustOpen();
    }
}

SciComboBox.observedAttributes = ["label", "opened", "width"];
