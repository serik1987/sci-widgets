class SciListInputItem extends SciDraggable{

    constructor(){
        super();
        let self = this;

        if (SciListInputItem.template === null){
            SciListInputItem.template = this._createTemplate(SciListInputItem.templateText);
        }

        let content = SciListInputItem.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__value = null;
        this.__updateValue = null;

        shadow.querySelector(".edit").addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();

            let newEvent = new CustomEvent("sci-edit-item", {bubbles: true, detail: self});
            self.dispatchEvent(newEvent);
        });

        shadow.querySelector(".delete").addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();

            let newEvent = new CustomEvent("sci-delete-item", {bubbles: true, detail: self});
            self.dispatchEvent(newEvent);
        });

        /* Implementation of the item dragging */

        this._implementDragging();

        let draggingEvents = ["mousedown", "touchstart"];
        for (let event of draggingEvents){
            for (let element of shadow.querySelectorAll(".controls")){
                element.addEventListener(event, o => o.stopPropagation());
            }
        }
    }

    get error(){
        return this.getAttribute("error") !== null;
    }

    set error(value){
        if (value){
            this.setAttribute("error", "");
        } else {
            this.removeAttribute("error");
        }
    }

    get localRect(){
        let childRect = this.getBoundingClientRect();
        let parentRect = this.parentElement.getBoundingClientRect();

        return {
            top: childRect.top - parentRect.top,
            bottom: parentRect.bottom - childRect.bottom,
            height: childRect.height,
            left: childRect.left - parentRect.left,
            right: parentRect.right - childRect.right,
            width: childRect.width
        }
    }

    get selected(){
        return this.getAttribute("selected") !== null;
    }

    set selected(value){
        if (value){
            this.setAttribute("selected", "");
        } else {
            this.removeAttribute("selected");
        }
    }

    get updateValue(){
        return this.__updateValue;
    }

    set updateValue(f){
        if (f === null || typeof f === "function"){
            this.__updateValue = f;
        } else {
            throw new TypeError("sci-list-input-item: updateValue must be function");
        }
    }

    get value(){
        return this.__value;
    }

    set value(value){
        this.__value = value;
        if (this.__updateValue !== null && value !== null){
            this.__updateValue(value);
        }
    }



}

SciListInputItem.observedAttributes = ["disabled", "label"];