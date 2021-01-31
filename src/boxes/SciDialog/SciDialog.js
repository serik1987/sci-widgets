class SciDialog extends SciWindow{

    constructor(){
        super();

        if (SciDialog.template === null){
            SciDialog.template = this._createTemplate(SciDialog.templateText);
        }

        let content = SciDialog.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);
        this._initializeWindow();

        if (this.getAttribute("size") === null){
            this.setAttribute("size", "small");
        }

        window.addEventListener("load", event => this.updateHeight(false));
        window.addEventListener("resize", event => this.updateHeight(false));
        this.__form = shadow.querySelector("sci-form");
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.shadowRoot.querySelector(".title-label").innerHTML = newValue;
        } else if (name === size){
            if (SciDialog.SIZE_LIST.find(newValue) < 0){
                this.setAttribute("size", "small");
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    open(){
        super.open();
        this.updateHeight(true);
    }

    updateHeight(updateForm = true){
        let win = this.shadowRoot.querySelector(".window");
        if (win.classList.contains("too-tall")){
            win.classList.remove("too-tall");
            this.__form.padding = null;
        }

        let h = win.querySelector(".window-title").clientHeight +
            win.querySelector("sci-form").scrollHeight;
        let h0 = window.innerHeight;
        if (h + 10 > h0 && !win.classList.contains("too-tall")){
            win.classList.add("too-tall");
            this.__form.padding = 30;
        }

        if (updateForm){
            this.__form.updateHeight();
        }
    }

}


SciDialog.SIZE_LIST = ["tiny", "small", "large"];
SciDialog.observedAttributes = ["label"];