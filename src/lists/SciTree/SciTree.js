class SciTree extends SciScrollable{

    constructor(){
        super();
        let self = this;

        if (SciTree.template === null){
            SciTree.template = this._createTemplate(SciTree.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let content = SciTree.template.content.cloneNode(true);
        shadow.append(content);
        this._implementScroll();

        this.__root = shadow.querySelector("sci-tree-node");
        this.__root.value = "root";
        this.__root.parentTree = this;
        this.__selectable = true;
        this.__customEditBox = null;
        this.__customDeleteBox = null;

        this.__defaultValue = this.getAttribute("value");
        if (this.getAttribute("multiple") === null){
            this.__value = this.__defaultValue;
            this.__updateValue();
        }

        function selectItem(event) {
            event.stopPropagation();
            event.preventDefault();

            let value = event.detail;
            let cancelThis = false;

            if (!self.multiple && self.value === value){
                cancelThis = true;
            }

            if (cancelThis){
                event.stopImmediatePropagation();
                return;
            }

            self.value = value;

            let newEvent = new CustomEvent("sci-tree-select", {detail: value, bubbles: true});
            self.dispatchEvent(newEvent);
        }
        shadow.addEventListener("sci-tree-select", selectItem);

        function setExpansion(event){
            event.stopPropagation();
            event.preventDefault();
            let value = event.detail;
            self.updateHeight();

            let newEvent = new CustomEvent(event.type, {detail: value, bubbles: true});
            self.dispatchEvent(newEvent);
        }
        shadow.addEventListener("sci-tree-compact", setExpansion);
        shadow.addEventListener("sci-tree-expand", setExpansion);

        function propagate(event){
            event.stopPropagation();
            event.preventDefault();

            let newEvent = new CustomEvent(event.type, {detail: event.detail, bubbles: true});
            self.dispatchEvent(newEvent);
        }
        shadow.addEventListener("sci-tree-edit-start", propagate);
        shadow.addEventListener("sci-tree-edit-cancel", propagate);
        shadow.addEventListener("sci-tree-edit-finish", propagate);

        shadow.addEventListener("sci-tree-delete", event => {
            event.stopPropagation();
            event.preventDefault();

            let value = event.detail;
            event.target.remove();
            self.updateHeight();

            let newEvent = new CustomEvent("sci-tree-delete", {detail: value, bubbles: true});
            self.dispatchEvent(newEvent);
        })

    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.root.label = newValue;
        } else if (name === "multiple") {
            if (newValue !== null) {
                if (this.__defaultValue === null) {
                    this.__value = new Set();
                } else {
                    this.__value = new Set([this.__defaultValue]);
                }
            } else {
                this.__value = this.__defaultValue;
            }

            this.__updateValue();
        } else if (name === "selectable" || name === "non-selectable" || name === "branch-non-selectable" ||
            name === "tree-non-selectable" || name === "expandable" || name === "non-editable" ||
            name === "non-deletable" || name === "no-lines") {
            this.__updateValue();
        } else if (name === "compacted") {
            if (newValue !== null) {
                for (let node of this.iterate(true)) {
                    node.compact();
                }
            }
        } else if (name === "expanded") {
            if (newValue !== null) {
                for (let node of this.iterate(true)) {
                    node.expand();
                }
            }
        } else if (name === "hide-root"){
            let hideRoot = newValue !== null;
            let classes = this.root.classList;

            if (hideRoot && !classes.contains("sci-hide-root")){
                classes.add("sci-hide-root");
            }

            if (!hideRoot && classes.contains("sci-hide-root")){
                classes.remove("sci-hide-root");
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __updateValue(){
        let multiple = this.multiple;
        let selectable = this.selectable;
        let branchNonSelectable = this.branchNonSelectable;
        let treeNonSelectable = this.treeNonSelectable;
        let expandable = this.expandable;
        let nonEditable = this.nonEditable;
        let nonDeletable = this.nonDeletable;
        let noLines = this.noLines;
        let nothingSelected = true;
        let warned = false;

        for (let node of [this.root, ...this.iterate(true)]){
            let output = this.__updateNonInheritedProperties(node, selectable, warned, multiple, nothingSelected,
                branchNonSelectable, treeNonSelectable);
            warned = output.warned;
            nothingSelected = output.nothingSelected;
        }

        this.__updateInheritedProperties(multiple, nothingSelected, selectable, expandable, nonEditable, nonDeletable,
            noLines);
    }

    __updateNonInheritedProperties(node, selectable, warned, multiple, nothingSelected, branchNonSelectable,
                                   treeNonSelectable){
        let value = node.value;
        let nodeClasses = node.classList;
        let nodeSelectable = selectable;

        if (!value && selectable && !warned){
            console.warn("sci-tree: Forgot to set value property for some of the sci-tree-node - item selection "+
                "way work incorrectly");
            warned = true;
        }

        if (multiple && this.__value.has(value)){
            node.select();
        } else if (!multiple && this.__value === value){
            node.select();
            nothingSelected = false;
        } else {
            node.unselect();
        }

        if (multiple && !nodeClasses.contains("sci-multiple")){
            nodeClasses.add("sci-multiple");
        }
        if (!multiple && nodeClasses.contains("sci-multiple")){
            nodeClasses.remove("sci-multiple");
        }

        if (branchNonSelectable && node.length > 0){
            nodeSelectable = false;
        }

        if (treeNonSelectable && node.root){
            nodeSelectable = false;
        }

        node.selectable = nodeSelectable;

        return {warned: warned, nothingSelected: nothingSelected};
    }

    __updateInheritedProperties(multiple, nothingSelected, selectable, expandable, nonEditable, nonDeletable, noLines){
        if (!multiple && nothingSelected){
            this.__value = null;
        }

        if (!selectable){
            this.__value = null;
        }

        this.root.__updatable = false;
        this.root.expandable = expandable;
        this.root.editable = !nonEditable;
        this.root.deletable = !nonDeletable;
        this.root.lines = !noLines;

        this.root.__updatable = true;
        this.root.__updateValue();
    }

    _disableChildren(){
        this.__root.disable();
        this.__root.__updateDisabled();
    }

    _enableChildren(){
        this.__root.enable();
        this.__root.__updateDisabled();
    }

    get branchNonSelectable(){
        return this.getAttribute("branch-non-selectable") !== null;
    }

    set branchNonSelectable(value){
        if (value){
            this.setAttribute("branch-non-selectable", "");
        } else {
            this.removeAttribute("branch-non-selectable");
        }
    }

    get customDeleteBox(){
        return this.__customDeleteBox;
    }

    set customDeleteBox(value){
        this.__customDeleteBox = value;
        for (let node of this.iterate(true)){
            node.__customDeleteBox = value;
        }
    }

    get customEditBox(){
        return this.__customEditBox;
    }

    set customEditBox(value){
        this.__customEditBox = value;
        for (let node of [this.root, ...this.iterate(true)]){
            node.__customEditBox = value;
        }
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get expandable(){
        return this.getAttribute("expandable") !== null;
    }

    set expandable(value){
        if (value){
            this.setAttribute("expandable", "");
        } else {
            this.removeAttribute("expandable");
        }
    }

    get length(){
        let length = 0;

        for (let node of this.iterate(true)){
            length++;
        }

        return length;
    }

    get multiple(){
        return this.getAttribute("multiple") !== null;
    }

    set multiple(value){
        if (value){
            this.setAttribute("multiple", "");
        } else {
            this.removeAttribute("multiple");
        }
    }

    get nonDeletable(){
        return this.getAttribute("non-deletable") !== null;
    }

    set nonDeletable(value){
        if (value){
            this.setAttribute("non-deletable", "");
        } else {
            this.removeAttribute("non-deletable");
        }
    }

    get nonEditable(){
        return this.getAttribute("non-editable") !== null;
    }

    set nonEditable(value){
        if (value){
            this.setAttribute("non-editable", "");
        } else {
            this.removeAttribute("non-editable");
        }
    }

    get noLines(){
        return this.getAttribute("no-lines") !== null;
    }

    set noLines(value){
        if (value){
            this.setAttribute("no-lines", "");
        } else {
            this.removeAttribute("no-lines");
        }
    }

    get root(){
        return this.__root;
    }

    get selectable(){
        let selectable = true;

        if (this.getAttribute("selectable") !== null){
            selectable = true;
        } else if (this.getAttribute("non-selectable") !== null){
            selectable = false;
        } else {
            selectable = this.__selectable;
        }

        return selectable;
    }

    set selectable(value){
        this.__selectable = value;
        this.__updateValue();
    }

    get treeNonSelectable(){
        return this.getAttribute("tree-non-selectable") !== null;
    }

    set treeNonSelectable(value){
        if (value){
            this.setAttribute("tree-non-selectable", "");
        } else {
            this.removeAttribute("tree-non-selectable");
        }
    }

    get value(){
        let value = this.__value;

        if (this.multiple){
            /* The getter just return the value providing no opportunity for the user to set it.However,
            * if this property returns Javascript object, the user can manipulate the value of this property by
            * manipulating the object. In order to prevent such opportunity the object ahsll be cloned before
            * returning to the user */
            value = new Set(value);
        }

        return value;
    }

    set value(value){
        if (this.multiple){
            if (value === null){
                this.__value = new Set();
            } else if (typeof value === "string"){
                if (this.__value.has(value)){
                    this.__value.delete(value);
                } else {
                    this.__value.add(value);
                }
            } else if (value instanceof Set){
                this.__value = new Set(value);
            } else if (value instanceof Array){
                this.__value = new Set(value);
            } else {
                throw new TypeError("sci-tree: the value property accepts only null, string, sets or arrays when " +
                    "multiple is true");
            }
        } else {
            if (value === null){
                this.__value = null;
            } else if (typeof value === "string"){
                this.__value = value;
            } else {
                throw new TypeError("sci-tree: the value property accepts only null or strings when multiple is false");
            }
        }

        this.__updateValue();
    }

    $(value){
        return this.root.$(value);
    }

    addValue(value){
        if (this.multiple){
            this.__value.add(value);
        } else {
            this.__value = value;
        }

        this.__updateValue();
    }

    iterate(deep = false){
        return this.root.iterate(deep);
    }

    removeValue(value){
        if (this.multiple){
            this.__value.delete(value);
            this.__updateValue();
        } else if (this.__value === value){
            this.__value = null;
            this.__updateValue();
        }
    }

}

SciTree.observedAttributes = ["branch-non-selectable", "compacted", "disabled", "editable", "expandable", "expanded",
    "height", "hide-root", "label", "multiple", "non-editable", "non-expandable",  "non-selectable", "no-lines",
    "selectable", "tree-non-selectable", "width"];