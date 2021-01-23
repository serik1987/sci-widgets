class SciTreeNode extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciTreeNode.template === null){
            SciTreeNode.template = this._createTemplate(SciTreeNode.templateText);
        }

        let shadow = this.attachShadow({mode: "open"});
        let content = SciTreeNode.template.content.cloneNode(true);
        shadow.append(content);
        this.__labelElement = shadow.querySelector("label");

        this.__parentTree = null;
        this.__selectable = true;
        this.__expandable = false;
        this.__updatable = false;
        this.__editable = true;
        this.__deletable = true;
        this.__disabled = false;
        this.__lines = true;

        this.__editButton = shadow.querySelector("#btn-edit");
        this.__deleteButton = shadow.querySelector("#btn-delete");
        this.__editBox = shadow.querySelector("#edit-ctrl");
        this.__okButton = shadow.querySelector("#btn-ok");
        this.__cancelButton = shadow.querySelector("#btn-cancel");

        this.__customEditBox = null;
        this.__customDeleteBox = null;

        this.__updateValue();

        shadow.querySelector("label").addEventListener("click", event => {
            let selectable = self.selectable;

            event.stopPropagation();
            event.preventDefault();

            if (!selectable || self.disabled){
                return;
            }

            let newEvent = new CustomEvent("sci-tree-select", {
                detail: self.value,
                bubbles: true
            });
            self.dispatchEvent(newEvent);
        });

        shadow.querySelector(".expand").addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();

            let newEvent;
            let options = {
                detail: self.value,
                bubbles: true
            };

            if (self.compacted){
                self.compacted = false;
                newEvent = new CustomEvent("sci-tree-expand", options);
            } else {
                self.compacted = true;
                newEvent = new CustomEvent("sci-tree-compact", options);
            }

            self.dispatchEvent(newEvent);
        });

        this.__editButton.addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();

            self.edit();
        });

        function finishEdit(event){
            event.stopPropagation();
            event.preventDefault();

            self.label = self.__editBox.value;
            self.editing = false;

            let newEvent = new CustomEvent("sci-tree-edit-finish", {detail: self.value, bubbles: true});
            self.dispatchEvent(newEvent);
        }
        this.__okButton.addEventListener("click", finishEdit);

        function cancelEdit(event){
            event.stopPropagation();
            event.preventDefault();

            self.editing = false;

            let newEvent = new CustomEvent("sci-tree-edit-cancel", {detail: self.value, bubbles: true});
            self.dispatchEvent(newEvent);
        }
        this.__cancelButton.addEventListener("click", cancelEdit);

        this.__editBox.addEventListener("keydown", event => {
            if (event.key === "Enter"){
                finishEdit(event);
            }

            if (event.key === "Escape"){
                cancelEdit(event);
            }
        });

        this.__deleteButton.addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();

            let p;
            if (self.__customDeleteBox){
                p = self.__customDeleteBox(self.value, self.label);
            } else {
                p = Promise.resolve();
            }

            p
                .then(() => {
                    let newEvent = new CustomEvent("sci-tree-delete", {detail: self.value, bubbles: true});
                    self.dispatchEvent(newEvent);
                })
                .catch(() => {});
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "selectable" || name === "non-selectable" || name === "expandable" || name === "non-expandable" ||
            name === "editable" || name === "non-editable" || name === "deletable" || name === "non-deletable" ||
            name === "disabled" || name === "enabled" || name === "lines" || name === "no-lines") {
            this.__updateValue();
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __updateValue(){
        if (!this.__updatable){
            return false;
        }

        this.__updateEmpty();
        this.__updateSelectable();
        this.__updateExpandable();
        this.__updateEditable();
        this.__updateDeletable();
        this.__updateDisabled();
        this.__updateLines();
        this.__updateChildren();
    }

    __updateEmpty(){
        let empty = this.length === 0;
        let classes = this.classList;

        if (empty && !classes.contains("sci-empty")){
            classes.add("sci-empty");
        }

        if (!empty && classes.contains("sci-empty")){
            classes.remove("sci-empty");
        }
    }

    __updateSelectable(){
        let selectable = this.selectable;
        let classes = this.classList;

        if (selectable && classes.contains("sci-non-selectable")){
            classes.remove("sci-non-selectable");
        }

        if (!selectable && !classes.contains("sci-non-selectable")){
            classes.add("sci-non-selectable");
        }
    }

    __updateExpandable(){
        let expandable = this.expandable;
        let classes = this.classList;

        if (expandable && !classes.contains("sci-expandable")){
            classes.add("sci-expandable");
        }

        if (!expandable && classes.contains("sci-expandable")){
            classes.remove("sci-expandable");
        }
    }

    __updateEditable(){
        let editable = this.editable;
        let classes = this.classList;

        if (!!editable && classes.contains("sci-non-editable")){
            classes.remove("sci-non-editable");
        }

        if (!editable && !classes.contains("sci-non-editable")){
            classes.add("sci-non-editable");
        }
    }

    __updateDeletable(){
        let deletable = this.deletable;
        let classes = this.classList;

        if (!!deletable && classes.contains("sci-non-deletable")){
            classes.remove("sci-non-deletable");
        }

        if (!deletable && !classes.contains("sci-non-deletable")){
            classes.add("sci-non-deletable");
        }
    }

    __updateDisabled(){
        let disabled = this.disabled;
        let classes = this.classList;

        if (disabled && !classes.contains("sci-disabled")){
            classes.add("sci-disabled");
        }

        if (!disabled && classes.contains("sci-disabled")){
            classes.remove("sci-disabled");
        }
    }

    __updateLines(){
        let lines = this.lines;
        let classes = this.classList;

        if (lines && classes.contains("sci-no-vr-line")){
            classes.remove("sci-no-vr-line");
        }

        if (!lines && !classes.contains("sci-no-vr-line")){
            classes.add("sci-no-vr-line");
        }

        if (this.__lines && classes.contains("sci-no-hr-line")){
            classes.remove("sci-no-hr-line");
        }

        if (!this.__lines && !classes.contains("sci-no-hr-line")){
            classes.add("sci-no-hr-line");
        }
    }

    __updateChildren(){
        let expandable = this.expandable;
        let editable = this.editable;
        let deletable = this.deletable;
        let disabled = this.disabled;
        let lines = this.lines;
        let childNode = null;

        for (childNode of this.iterate()){
            childNode.__updatable = true;
            childNode.__expandable = expandable;
            childNode.__editable = editable;
            childNode.__deletable = deletable;
            childNode.__disabled = disabled;
            childNode.__lines = lines;
            childNode.__updateValue();
        }
    }

    get childTreeNodes(){
        let children;

        if (this.root){
            children = this.parentTree.children;
        } else {
            children = this.children;
        }

        return children;
    }

    get compacted(){
        return this.classList.contains("sci-compact");
    }

    set compacted(value){
        let classes = this.classList;

        if (!value && classes.contains("sci-compact")){
            classes.remove("sci-compact");
        }

        if (value && !classes.contains("sci-compact")){
            classes.add("sci-compact");
        }
    }

    get deletable(){
        let deletable;

        if (this.getAttribute("deletable") !== null){
            deletable = true;
        } else if (this.getAttribute("non-deletable") !== null){
            deletable = false;
        } else {
            deletable = this.__deletable;
        }

        return deletable;
    }

    set deletable(value){
        this.__deletable = value;
        if (this.__updatable){
            this.__updateDeletable();
            this.__updateChildren();
        }
    }

    get deleteButton(){
        let deleteButton = null;

        if (!this.root){
            deleteButton = this.__deleteButton;
        }

        return deleteButton;
    }

    get disabled(){
        let disabled = false;

        if (this.getAttribute("disabled") !== null){
            disabled = true;
        } else if (this.getAttribute("enabled") !== null){
            disabled = false;
        } else {
            disabled = this.__disabled;
        }

        return disabled;
    }

    set disabled(value){
        if (value){
            this.disable();
        } else {
            this.enable();
        }
    }

    get editable(){
        let editable;

        if (this.getAttribute("editable") !== null){
            editable = true;
        } else if (this.getAttribute("non-editable") !== null){
            editable = false;
        } else {
            editable = this.__editable;
        }

        return editable;
    }

    set editable(value){
        this.__editable = !!value;
        if (this.root.__editable){
            this.__updateEditable();
            this.__updateChildren();
        }
    }

    get enabled(){
        let enabled = true;

        if (this.getAttribute("disabled") !== null){
            enabled = false;
        } else if (this.getAttribute("enabled") !== null){
            enabled = true;
        } else {
            enabled = !this.__disabled;
        }

        return enabled;
    }

    set enabled(value){
        if (value){
            this.enable();
        } else {
            this.disable();
        }
    }

    get editButton(){
        return this.__editButton;
    }

    get editing(){
        return this.classList.contains("sci-editing");
    }

    set editing(value){
        let classes = this.classList;

        if (!!value && !classes.contains("sci-editable")){
            classes.add("sci-editable");
            this.__editBox.value = this.label;
            let size = this.label.length;
            if (size > 30){
                size = 30;
            }
            this.__editBox.size = size;
            this.__editBox.select();
            this.__editBox.focus();
        }

        if (!value && classes.contains("sci-editable")){
            classes.remove("sci-editable");
        }
    }

    get expandable(){
        let expandable;

        if (this.getAttribute("expandable") !== null){
            expandable = true;
        } else if (this.getAttribute("non-expandable") !== null){
            expandable = false;
        } else {
            expandable = this.__expandable;
        }

        return expandable;
    }

    set expandable(value){
        this.__expandable = !!value;
        if (this.root.__updatable){
            this.__updateExpandable();
            this.__updateChildren();
        }
    }

    get length(){
        return this.childTreeNodes.length;
    }

    get lines(){
        let lines;

        if (this.getAttribute("lines") !== null){
            lines = true;
        } else if (this.getAttribute("no-lines") !== null){
            lines = false;
        } else {
            lines = this.__lines;
        }

        return lines;
    }

    set lines(value){
        if (value){
            this.setAttribute("lines", "");
            this.removeAttribute("no-lines");
        } else {
            this.setAttribute("no-lines", "");
            this.removeAttribute("lines");
        }
        
        if (this.__updatable){
            this.__updateLines();
            this.__updateChildren();
        }
    }

    get parentTree(){
        let parentTree;

        if (this.__parentTree !== null){
            parentTree = this.__parentTree;
        } else {
            parentTree = this.parentElement;
        }

        return parentTree;
    }

    set parentTree(value){
        this.__parentTree = value;
    }

    get root(){
        return this.classList.contains("sci-root");
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
        this.__selectable = !!value;
        this.__updateSelectable();
    }

    get selected(){
        return this.classList.contains("sci-selected");
    }

    set selected(value){
        if (!!value && !this.classList.contains("sci-selected")){
            this.classList.add("sci-selected");
        }

        if (!value && this.classList.contains("sci-selected")){
            this.classList.remove("sci-selected");
        }
    }

    get value(){
        return this.getAttribute("value");
    }

    set value(value){
        if (value !== null){
            this.setAttribute("value", value);
        } else {
            this.removeAttribute("value");
        }
    }

    $(value){
        let searchStart = null;

        if (this.root){
            searchStart = this.parentTree;
        } else {
            searchStart = this;
        }

        return searchStart.querySelector(`[value="${value}"]`);
    }

    compact(){
        this.compacted = true;
    }

    disable(){
        this.setAttribute("disabled", "");
        this.removeAttribute("enabled");
        this.__updateDisabled();
    }

    edit(){
        if (this.__customEditBox === null){
            this.editing = true;
            let newEvent = new CustomEvent("sci-tree-edit-start", {detail: this.value, bubbles: true});
            this.dispatchEvent(newEvent);
        } else {
            let initEvent = new CustomEvent("sci-tree-edit-start", {detail: this.value, bubbles: true});
            this.dispatchEvent(initEvent);
            this.__customEditBox(this.value, this.label)
                .then(newLabel => {
                    this.label = newLabel;
                    let finalEvent = new CustomEvent("sci-tree-edit-finish", {detail: this.value, bubbles: true});
                    this.dispatchEvent(finalEvent);
                })
                .catch(e => {
                    let finalEvent = new CustomEvent("sci-tree-edit-cancel", {detail: this.value, bubbles: true});
                    this.dispatchEvent(finalEvent);
                });
        }
    }

    enable(){
        this.setAttribute("enabled", "");
        this.removeAttribute("disabled");
        this.__updateDisabled();
    }

    expand(){
        this.compacted = false;
    }

    iterate(deep = false){
        let self = this;

        return function* () {
            for (let treeNode of self.childTreeNodes){
                yield treeNode;
                if (deep){
                    for (let subNode of treeNode.iterate(true)){
                        yield subNode;
                    }
                }
            }
        }()
    }

    select(){
        this.selected = true;
    }

    unselect(){
        this.selected = false;
    }

}

SciTreeNode.observedAttributes = ["deletable", "disabled", "editable", "enabled", "expandable", "label", "lines",
    "non-deletable", "non-editable", "non-expandable", "non-selectable", "no-lines", "selectable"];