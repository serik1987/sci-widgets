class SciItem{

    constructor(parent, element){
        this.__parent = parent;
        this.__element = element;
    }

    get defaultSelected(){
        return this.widget.defaultValue === this.value;
    }

    get disabled(){
        return this.element.classList.contains("disabled");
    }

    set disabled(value){
        let classList = this.element.classList;
        if (value && !classList.contains("disabled")){
            classList.add("disabled");
        }
        if (!value && classList.contains("disabled")){
            classList.remove("disabled");
        }
    }

    get element(){
        return this.__element;
    }

    get enabled(){
        return !this.disabled;
    }

    set enabled(value){
        this.disabled = !value;
    }

    get index(){
        let index;

        if (this.parent !== null){
            index = this.parent.indexOf(this);
        }

        return index;
    }

    get parent(){
        return this.__parent;
    }

    get selected(){
        return this.widget.value === this.value;
    }

    set selected(value){
        if (value){
            this.widget.value = this.value;
        }
        if (!value && this.widget.value === this.value){
            this.widget.value = null;
        }
    }

    get text(){
        return this.element.innerText.trim();
    }

    set text(value){
        this.element.innerText = value;
    }

    get value(){
        return this.element.dataset.value;
    }

    set value(value){
        this.element.dataset.value = value;
    }

    get widget(){
        if (!this.parent){
            return null;
        }
        return this.parent.parent;
    }

    disable(){
        this.disabled = true;
    }

    enable(){
        this.enabled = true;
    }

    select(){
        this.selected = true;
    }
}

class SciSimpleItem extends SciItem{

}

SciSimpleItem.create = function(value, text){
    let element = document.createElement("li");
    element.dataset.value = value;
    element.innerText = text;
    return new SciSimpleItem(null, element);
}

class SciOptionalItem extends SciItem{

}

SciOptionalItem.create = function(value, text){
    let element = document.createElement("li");
    element.dataset.value = value;
    element.classList.add("optional");
    element.innerText = text;
    return new SciOptionalItem(null, element);
}

class SciDoubleItem extends SciItem{

    constructor(parent, element){
        super(parent, element);

        let children = element.querySelectorAll("p");
        this.__textElement = children[0];
        this.__descriptionElement = children[1];
    }

    get description(){
        return this.__descriptionElement.innerText.trim();
    }

    set description(value){
        this.__descriptionElement.innerText = value;
    }

    get text(){
        return this.__textElement.innerText.trim();
    }

    set text(value){
        this.__textElement.innerText = value;
    }

}

SciDoubleItem.create = function(value, text, description){
    let element = document.createElement("li");
    element.dataset.value = value;
    let firstParagraph = document.createElement("p");
    firstParagraph.innerText = text;
    element.append(firstParagraph);
    let secondParagraph = document.createElement("p");
    secondParagraph.innerText = description;
    element.append(secondParagraph);

    return new SciDoubleItem(null, element);
}

SciItem.create = function(parent, element){
    if (element.querySelectorAll("p").length === 2){
        return new SciDoubleItem(parent, element);
    } else if (element.classList.contains("optional")){
        return new SciOptionalItem(parent, element);
    } else {
        return new SciSimpleItem(parent, element);
    }
}