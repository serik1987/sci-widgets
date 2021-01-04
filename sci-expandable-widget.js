class SciExpandableWidget extends SciWidget{

    constructor(){
        super();
    }

    _createTemplate(templateText){
        let auxiliaryTemplate = super._createTemplate(SciExpandableWidget.templateText);
        let workingTemplate = super._createTemplate(templateText);
        let content = workingTemplate.content.querySelector(".content");

        while (auxiliaryTemplate.content.children.length > 0){
            let element = auxiliaryTemplate.content.children[0];
            workingTemplate.content.insertBefore(element, content);
        }

        workingTemplate.content.querySelector(".immediate-wrapper .content").replaceWith(content);

        return workingTemplate;
    }

    _implementExpansion(){
        let self = this;

        this.shadowRoot.querySelector(".hamburger").addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();

            if (self.disabled){
                return;
            }

            self.opened = !self.opened;
        });

        this.content.addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();
        });

        this.shadowRoot.querySelector("label").addEventListener("click", event => {
            self.close();
        });

        document.addEventListener("click", event => {
            let target = event.target.closest(self.tagName);
            if (target !== self){
                self.close();
            }
        }, true);
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "opened"){
            if (this._autoadjustOpen) {
                this._adjustOpen();
            }
            let newEvent;
            if (newValue !== null){
                newEvent = new CustomEvent("sci-open", {bubbles: true});
            } else {
                newEvent = new CustomEvent("sci-close", {bubbles: true});
            }
            this.dispatchEvent(newEvent);
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get _autoadjustOpen(){
        return true;
    }

    _adjustOpen(){
        let container = this.offsetParent;
        let mH = container.clientHeight;
        if (container instanceof HTMLBodyElement){
            mH = window.innerHeight;
        }
        let hamburger = this.shadowRoot.querySelector(".hamburger");
        let y0 = hamburger.getBoundingClientRect().bottom;
        let cH = this.content.scrollHeight + 2; // plus borders
        if (y0 + cH > mH){
            let h0 = hamburger.clientHeight;
            let deltaH = y0 + cH - mH;
            let h1 = h0 - deltaH;
            this.content.style.top = h1 + "px";
        } else {
            this.content.style.top = null;
        }
    }

    _disableChildren(){
        this.close();
    }

    get closed(){
        return this.getAttribute("opened") === null;
    }

    set closed(value){
        if (value){
            this.removeAttribute("opened");
        } else {
            this.setAttribute("opened", "");
        }
    }

    get content(){
        return this.shadowRoot.querySelector(".hamburger .content");
    }

    get opened(){
        return this.getAttribute("opened") !== null;
    }

    set opened(value){
        if (value){
            this.setAttribute("opened", "");
        } else {
            this.removeAttribute("opened");
        }
    }

    get text(){
        return this.shadowRoot.querySelector(".hamburger .text").innerHTML;
    }

    set text(value){
        this.shadowRoot.querySelector(".hamburger .text").innerHTML = value;
    }

    open(){
        this.opened = true;
    }

    close(){
        this.closed = true;
    }

}

SciExpandableWidget.templateText = `
<label>ERROR. YOU DON'T GIVE THE LABEL PROPERTY</label>
<div class="immediate-wrapper">
    <div class="hamburger">
        <svg width="10" height="10" viewBox="0 0 100 100" class="icon">
            <path d="M 0 0 H 100 L 50 100 z"></path>
        </svg>
        <div class="text">Текст гамбургера</div>
        <div class="content"></div>
    </div>
</div>
<div class="error-message"></div>
`;