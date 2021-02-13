class SciListInput extends SciExpandableWidget{

    constructor(){
        super();
        let self = this;

        if (SciListInput.template === null){
            SciListInput.template = document.createElement("template");
            SciListInput.template.innerHTML = SciListInput.templateText;
        }

        let content = SciListInput.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__inputWrapper = shadow.querySelector(".input-wrapper");
        this.__input = shadow.querySelector("input");

        this.__input.addEventListener("focus", event => {
            if (!self.classList.contains("sci-focus")){
                self.classList.add("sci-focus");
            }
        });

        ["mousedown", "touchstart"].forEach(eventName => {
            shadow.querySelector(".content").addEventListener(eventName, event => {
                event.preventDefault();
                let target = event.target.closest("li.sci-list-input-livesearch-item");
                let index = parseInt(target.dataset.index);
                let value = self.__predefinedValues[index];
                self.appendItem(value);
                self.__input.value = "";
                self.__livesearchString = "";
                self.__predefinedValues = [];
                self.__selectedIndex = -1;
                self.close();
            });
        });

        this.__input.addEventListener("blur", event => {
            if (self.classList.contains("sci-focus")){
                self.classList.remove("sci-focus");
            }

            if (self.__input.value !== "" && self.__isAddOnBlur){
                self.addUserItem();
            }
        });

        this.__input.addEventListener("keydown", event => {
            if (event.key === "Backspace" && self.__input.value.length === 0){
                let elements = self.elements;
                let element = elements[elements.length - 1];
                if (element !== undefined){
                    self.deleteItem(element);
                }
            }
        });

        this.__input.addEventListener("keyup", event => {
            if (event.key === "Shift" || event.key === "Control" || event.key === "Alt" || self.disabled){
                return;
            }
            self.errorMessage = null;

            if (event.key === "," || self.__input.value.indexOf(",") !== -1 ||
                (event.key === "Enter" && self.__selectedIndex === -1)){
                self.addUserItem()
                    .then(() => {
                        self.__input.focus();
                    });
            } else if (event.key === "ArrowDown" && self.__selectedIndex !== -1){
                let items = self.shadowRoot.querySelector(".content ul").children;
                let item = items[self.__selectedIndex];
                if (item !== undefined && self.__selectedIndex < items.length - 1){
                    if (item.classList.contains("selected")){
                        item.classList.remove("selected");
                    }
                    let newItem = items[++self.__selectedIndex];
                    if (!newItem.classList.contains("selected")){
                        newItem.classList.add("selected");
                    }
                }
                event.preventDefault();
            } else if (event.key === "ArrowUp" && self.__selectedIndex !== -1){
                let items = self.shadowRoot.querySelector(".content ul").children;
                let item = items[self.__selectedIndex];
                if (item !== undefined && self.__selectedIndex > 0){
                    if (item.classList.contains("selected")){
                        item.classList.remove("selected");
                    }
                    let newItem = items[--self.__selectedIndex];
                    if (!newItem.classList.contains("selected")){
                        newItem.classList.add("selected");
                    }
                }
                event.preventDefault();
                let L = self.__input.value.length;
                self.__input.selectionStart = self.__input.selectionEnd = L;
            } else if (event.key === "Enter" && self.__selectedIndex !== -1){
                let index = self.__selectedIndex;
                let value = self.__predefinedValues[index];
                if (value !== undefined){
                    self.appendItem(value);
                    self.__input.value = "";
                    self.__livesearchString = "";
                    self.__predefinedValues = [];
                    self.__selectedIndex = -1;
                    self.close();
                }
            }
        });

        window.addEventListener("resize", event => {
            self.updateSize();
        });

        this.addEventListener("sci-delete-item", event => {
            if (event.target instanceof SciListInputItem){
                event.stopPropagation();
                self.deleteItem(event.target);
            }
        });

        this.addEventListener("sci-edit-item", event => {
            if (event.target instanceof SciListInputItem){
                event.stopPropagation();
                self.editItem(event.target);
            }
        });

        this.updateSize();

        this.__updateItem = null;
        this.__onItemAdd = null;
        this.__isAddOnBlur = true;

        /* livesearch implementation */

        this.__ready = true;
        this.__livesearchString = "";
        this.__onLivesearch = null;
        this.__selectedIndex = -1;
        this.__predefinedValues = [];

        this._implementExpansion();

        this.__input.addEventListener("input", function livesearch(event) {
            let value = self.__input.value;

            if (value === ""){
                self.close();
            }

            if (value !== "" && self.onLivesearch !== null && self.__ready){
                self.__ready = false;
                self.__livesearchString = value;
                self.onLivesearch(self.__livesearchString)
                    .then(result => {
                        if (!(result instanceof Array)){
                            result = [];
                        }
                        return result;
                    })
                    .catch(message => {
                        self.errorMessage = message;
                        return [];
                    })
                    .then(result => {
                        if (self.__input.value !== ""){
                            self.__putResult(result);
                        }

                        self.__ready = true;
                        if (self.__livesearchString !== self.__input.value){
                            livesearch(event);
                        }
                    });
            }
        });

        /* Edit box */

        this.__editBox = this.querySelector("[slot='edit-dialog']");

        /* Item dragging */

        this.__placeholder = null;

        this.addEventListener("sci-drag-start", event => {
            this.__createPlaceholder();
            this.__putPlaceholder(event.target, "left");
            this.updateSize();
        });

        this.addEventListener("sci-drag-move", event => {
            let data = this.__elementFromPoint(event.target, event.detail.x, event.detail.y);
            if (data !== null){
                this.__putPlaceholder(data.element, data.side);
            } else {
                this.__removePlaceholder();
            }
            this.updateSize();
        });

        this.addEventListener("sci-drag-end", event => {
            if (this.__placeholder.parentElement === this){
                this.insertBefore(event.target, this.__placeholder);
            }
            this.__removePlaceholder();
            this.updateSize();
        });

        this.addEventListener("sci-drag-cancel", event => {
            this.__removePlaceholder();
            this.updateSize();
        });
    }

    __putResult(result){
        let index = 0;
        this.__predefinedValues = [];
        let htmlList = document.createElement("ul");
        for (let resultInfo of result){
            this.__predefinedValues.push(resultInfo.value);
            let htmlListItem = document.createElement("li");
            htmlListItem.classList.add("sci-list-input-livesearch-item");
            if (index === 0){
                htmlListItem.classList.add("selected");
            }
            htmlListItem.innerHTML = resultInfo.html;
            htmlListItem.dataset.index = index.toString();
            htmlList.append(htmlListItem);
            ++index;
            if (index >= 3){
                break;
            }
        }

        let container = this.shadowRoot.querySelector(".content");
        container.innerHTML = "";
        container.append(htmlList);
        if (index === 0){
            this.close();
        } else {
            this.open();
        }

        if (result.length === 0){
            this.__selectedIndex = -1;
        } else {
            this.__selectedIndex = 0;
        }
    }

    __elementFromPoint(target, x, y){
        let workingElement = null;
        let side = undefined;
        let distance = Infinity;
        for (let element of this.elements){
            let r = element.getBoundingClientRect();
            if (y >= r.top && y <= r.bottom && element !== target){
                let d_left = Math.abs(x - r.left);
                let d_right = Math.abs(x - r.right);
                if (d_left < distance){
                    workingElement = element;
                    side = "left";
                    distance = d_left;
                }
                if (d_right < distance){
                    workingElement = element;
                    side = "right";
                    distance = d_right;
                }
            }
        }

        if (workingElement !== null){
            return {element: workingElement, side: side};
        } else {
            return null;
        }
    }

    __createPlaceholder(){
        if (this.__placeholder === null){
            this.__placeholder = document.createElement("div");
            this.__placeholder.classList.add("sci-placeholder");
        }
    }

    __putPlaceholder(element, side){
        if (side === "left"){
            this.insertBefore(this.__placeholder, element);
        }
        if (side === "right"){
            let nextElement = element.nextElementSibling;
            if (nextElement !== null){
                this.insertBefore(this.__placeholder, nextElement);
            } else {
                this.appendChild(this.__placeholder);
            }
        }
    }

    __removePlaceholder(){
        this.__placeholder.remove();
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "width"){
            super.attributeChangedCallback(name, oldValue, newValue);
            this.updateSize();
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _enableChildren(){
        for (let element of this.elements){
            element.enable();
        }
        this.__input.disabled = false;
    }

    _disableChildren(){
        for (let element of this.elements){
            element.disable();
        }
        this.__input.disabled = true;
    }

    get _autoadjustOpen(){
        return false;
    }

    get _openOnClick(){
        return false;
    }

    get editBox(){
        return this.__editBox;
    }

    get elements(){
        return this.getElementsByTagName("sci-list-input-item");
    }

    get firstElement(){
        let element = this.elements[0];
        if (element === undefined){
            element = null;
        }
        return element;
    }

    get lastElement(){
        let elements = this.elements;
        let L = elements.length;
        let element;
        if (L > 0){
            element = elements[L-1];
        } else {
            element = null;
        }
        return element;
    }

    get onItemAdd(){
        return this.__onItemAdd;
    }

    set onItemAdd(value){
        if (value === null || typeof value === "function"){
            this.__onItemAdd = value;
        } else {
            throw new TypeError("sci-list-input: the onItemAdd property shall contain string");
        }
    }

    get onLivesearch(){
        return this.__onLivesearch;
    }

    set onLivesearch(value){
        if (value === null || typeof value === "function"){
            this.__onLivesearch = value;
        } else {
            throw new TypeError("sci-list-input: the onLivesearch property shall contain string");
        }
    }

    get updateItem(){
        return this.__updateItem;
    }

    set updateItem(value){
        if (value === null || typeof value === "function"){
            this.__updateItem = value;
        } else {
            throw new TypeError("sci-list-input: incorrect value is assigning to the updateItem property");
        }
    }

    get value(){
        this.errorMessage = null;

        let value = [];
        for (let element of this.elements){
            if (element.error){
                this.errorMessage = "Некоторые элементы списка указаны с ошибками, они подсвечены красным. Пожалуйста," +
                    " исправьте ошибки, нажав на кнопку с карандашом справа от ошибочных элементов";
                throw new TypeError("sci-list-input: incorrectly filled values");
            } else {
                value.push(element.value);
            }
        }

        return value;
    }

    set value(value){
        if (value instanceof Array){
            while (this.elements > 0){
                this.elements[0].remove();
            }
            for (let itemValue of value){
                this.appendItem(itemValue);
            }
        } else {
            throw new TypeError("sci-list-input: the value must be array of objects");
        }
    }

    addUserItem(value = null){
        let self = this;
        self.__isAddOnBlur = false;

        if (value === null){
            value = this.__input.value
                .split(",")[0]
                .trim();
        }
        this.__input.value = value;
        let addPromise;
        if (this.onItemAdd === null){
            addPromise = Promise.resolve({name: value});
        } else {
            addPromise = this.onItemAdd(value);
        }
        return addPromise
            .then(value => {
                self.__input.value = "";
                self.appendItem(value);
            })
            .catch(message => {
                if (message === false){
                    self.__input.value = "";
                } else {
                    this.errorMessage = message;
                }
            })
            .then(() => {
                self.__isAddOnBlur = true;
                self.close();
            });
    }

    appendItem(value){
        this.insertAdjacentHTML("beforeend", "<sci-list-input-item></sci-list-input-item>");
        let element = this.lastElement;
        element.updateValue = this.updateItem;
        element.value = value;
        this.updateSize();

        let event = new CustomEvent("sci-add-item", {bubbles: true, detail: element});
        this.dispatchEvent(event);
    }

    deleteItem(item){
        item.remove();
        this.updateSize();

        let event = new CustomEvent("sci-delete-item", {bubbles: true, detail: item});
        this.dispatchEvent(event);
    }

    editItem(item){
        if (this.__editBox instanceof SciDialog){
            this.__editBox.openModal(item.value)
                .then(newValue => {
                    item.value = newValue;
                    this.updateSize();

                    let event = new CustomEvent("sci-edit-item", {bubbles: true, detail: item});
                    this.dispatchEvent(event);
                })
                .catch(() => {});
        }
    }

    updateSize(){
        let fullWidth;
        let element = this.lastElement;
        let right;
        let inputWidth;
        if (element === null){
            fullWidth = true;
        } else {
            right = element.localRect.right - parseInt(window.getComputedStyle(element).marginRight);
            fullWidth = right < 300;
        }
        if (fullWidth){
            inputWidth = "100%";
        } else {
            inputWidth = right + "px";
        }
        this.__inputWrapper.style.width = inputWidth;
    }

}

SciListInput.observedAttributes = ["disabled", "label", "width"];

