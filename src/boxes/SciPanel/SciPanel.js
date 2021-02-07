class SciPanel extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciPanel.template === null){
            SciPanel.template = this._createTemplate(SciPanel.templateText);
        }

        let content = SciPanel.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__label = shadow.querySelector("label");
        this.__form = shadow.querySelector("sci-form");

        this.__label.addEventListener("click", event => {
            if (self.disabled){
                return;
            }

            if (!self.compacted){
                self.compact();
                let newEvent = new CustomEvent("sci-panel-compact", {bubbles: true});
                self.dispatchEvent(newEvent);
            } else {
                self.expand();
                let newEvent = new CustomEvent("sci-panel-expand", {bubbles: true});
                self.dispatchEvent(newEvent);
            }
        });

        this.__form.addEventListener("sci-submit", event => {
            event.stopPropagation();

            if (self.disabled){
                return;
            }

            let newEvent = new CustomEvent("sci-submit", {bubbles: true});
            self.dispatchEvent(newEvent);
        });

        this.__form.addEventListener("sci-reset", event => {
            event.stopPropagation();

            if (self.disabled){
                return;
            }

            let newEvent = new CustomEvent("sci-reset", {bubbles: true});
            self.dispatchEvent(newEvent);
        })
    }

    _enableChildren(){
        return this.__form.enable();
    }

    _disableChildren(){
        return this.__form.disable();
    }

    get compacted(){
        return this.getAttribute("compacted") !== null;
    }

    set compacted(value){
        if (value){
            this.setAttribute("compacted", "");
        } else {
            this.removeAttribute("compacted");
        }
    }

    get expanded(){
        return !this.compacted;
    }

    set expanded(value){
        this.compacted = !value;
    }

    get onReset(){
        return this.__form.onReset;
    }

    set onReset(value){
        this.__form.onReset = value;
    }

    get onSubmit(){
        return this.__form.onSubmit;
    }

    set onSubmit(value){
        this.__form.onSubmit = value;
    }

    get value(){
        return this.__form.value;
    }

    set value(value){
        this.__form.value = value;
    }

    compact(){
        this.compacted = true;
    }

    expand(){
        this.expanded = true;
    }

    getElement(name){
        return this.__form.getElement(name);
    }

    getElements(){
        return this.__form.getElements();
    }

}

SciPanel.observedAttributes = ["disabled", "height", "label", "width"];