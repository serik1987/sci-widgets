class SciItemList{

    constructor(parent, element){
        this.__parent = parent;
        this.__element = element;
        this.__children = [];
        this.__childItems = {};
        let self = this;

        let di = 0;
        for (let child of element.querySelectorAll("li")){
            let childItem = SciItem.create(this, child);
            let value = childItem.value;
            this.__children.push(childItem);
            this.__childItems[value] = childItem;
            if (childItem instanceof SciDoubleItem){
                di++;
            }
            Object.defineProperty(this, value, {
                configurable: true,
                enumerable: true,
                value: childItem,
                writable: false
            });
        }

        this._doubleItems = di;

        this[Symbol.iterator] = function*(){
            for (let item of self.__children){
                yield item;
            }
        }
    }

    get _doubleItems(){
        return this.__doubleItems;
    }

    set _doubleItems(value){
        this.__doubleItems = parseInt(value);
        let parent = this.parent;
        if (this.__doubleItems > 0 && !parent.classList.contains("complex-list")){
            parent.classList.add("complex-list");
        }
        if (this.__doubleItems === 0 && parent.classList.contains("complex-list")){
            parent.classList.remove("complex-list");
        }
    }

    get length(){
        return this.__children.length;
    }

    get parent(){
        return this.__parent;
    }

    get element(){
        return this.__element;
    }

    add(item, before=null){
        if (!(item instanceof SciItem)){
            throw new TypeError("sci-item-list: The item argument is given incorrectly");
        }
        item.__parent = this;
        if (before === null){
            this.__children.push(item);
            this.element.append(item.element);
        } else {
            let beforeIndex, beforeItem;
            if (typeof before === "number" && before >= 0 && before < this.length){
                beforeIndex = before;
                beforeItem = this.__children[beforeIndex];
            } else if (before instanceof SciItem) {
                beforeIndex = this.indexOf(before);
                beforeItem = before;
                if (beforeIndex === -1){
                    throw new TypeError("sci-item-list: add(): the item referred to in the before argument "+
                        "is not in this item list");
                }
                this.element.insertBefore(item.element, beforeItem.element);
            } else {
                throw new TypeError("sci-item-list: The before argument is given incorrectly  in the add method");
            }
            this.__children.splice(beforeIndex, 0, item);
            this.element.insertBefore(item.element, beforeItem.element);
        }
        this.__childItems[item.value] = item;
        Object.defineProperty(this, item.value, {
            configurable: true,
            enumerable: true,
            value: item,
            writable: false
        });
        if (item instanceof SciDoubleItem){
            this._doubleItems++;
        }
        if (typeof this.__parent._onChange === "function"){
            this.__parent._onChange();
        }
    }

    addItems(){
        let doubleItems = 0;
        for (let item of arguments){
            item.__parent = this;
            this.__children.push(item);
            this.element.append(item.element);
            this.__childItems[item.value] = item;
            Object.defineProperty(this, item.value, {
                configurable: true,
                enumerable: true,
                value: item,
                writable: false
            });
            if (item instanceof SciDoubleItem){
                doubleItems++;
            }
        }
        this._doubleItems += doubleItems;
        if (typeof this.__parent._onChange === "function"){
            this.__parent._onChange();
        }
    }

    remove(arg){
        let index, item;
        if (typeof arg === "number" && arg >= 0 && arg < this.length){
            index = arg;
            item = this.__children[arg];
        } else if (arg instanceof SciItem){
            index = this.indexOf(arg);
            item = arg;
            if (index === -1){
                throw new TypeError("sci-item-list: bad argument of remove() function");
            }
        } else {
            throw new TypeError("sci-item-list: bad argument to remove() function");
        }
        this.__children.splice(index, 1);
        delete this.__childItems[item.value];
        delete this[item.value];
        item.element.remove();
        if (this.__parent.value === item.value){
            this.__parent.value = null;
        }
        if (item instanceof SciDoubleItem){
            this._doubleItems--;
        }
        if (typeof this.__parent._onChange === "function"){
            this.__parent._onChange();
        }
    }

    indexOf(item){
        return this.__children.indexOf(item);
    }

    getItem(index){
        return this.__children[index];
    }

    sort(){
        this.__children.sort((item1, item2) => {
            if (item1.text < item2.text){
                return -1;
            }
            if (item1.text === item2.text){
                return 0;
            }
            if (item1.text > item2.text){
                return 1;
            }
        });

        for (let item of this.__children){
            this.element.append(item.element);
        }
    }

    clear(){
        for (let item of this){
            delete this[item];
        }
        this.__children = [];
        this.__childItems = {};
        this.element.innerHTML = "";
        this._doubleItems = 0;
        this.__parent.value = null;
        if (typeof this.__parent._onChange === "function"){
            this.__parent._onChange();
        }
    }

}