class SciLinkButton extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciLinkButton.template === null){
            SciLinkButton.template = this._createTemplate(SciLinkButton.templateText);
        }

        let template = SciLinkButton.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(template);

        this.__link = shadow.querySelector("a");
        this.__defaultValue = undefined;
        this.__value = undefined;

        function eventProcessor(event){
            if (!event.isTrusted){
                return;
            }

            event.stopPropagation();
            event.preventDefault();

            if (self.disabled || self.active){
                return;
            }

            if (self.href !== null){
                window.open(self.href);
            }

            if (self.toggleable){
                self.value = !self.value;
                let auxEvent = new Event("change", event);
                self.dispatchEvent(auxEvent);
            }

            let newEvent = new MouseEvent("click", event);
            self.dispatchEvent(newEvent);
        }

        this.addEventListener("click", eventProcessor);

        /*
        this.__link.addEventListener("click", eventProcessor);
        for (let svg of this.querySelectorAll("svg")){
            svg.addEventListener("click", eventProcessor);
        }
         */
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.__link.innerHTML = newValue;
        } else if (name === "theme") {
            if (SciLinkButton.themes.indexOf(newValue) === -1) {
                this.setAttribute("theme", oldValue);
                throw TypeError("sci-link-button has wrong value of theme attribute");
            }
            this._updateTheme();
        } else if (name === "menu") {
            this._updateTheme();
        } else if (name === "toggleable") {
            if (newValue !== null) { // toggleable ON
                let toggled = this.getAttribute("toggled") !== null;
                this.__defaultValue = this.__value = toggled;
            } else { // toggleable OFF
                this.__defaultValue = this.__value = undefined;
            }
            this._updateTheme();
        } else if (name === "active"){
            this._updateTheme();
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _updateTheme(){
        let immediateWrapper = this.shadowRoot.querySelector(".immediate-wrapper");
        for (let cssClass of immediateWrapper.classList){
            if (cssClass.endsWith("-theme")){
                immediateWrapper.classList.remove(cssClass);
                break;
            }
        }
        let theme = this.theme;
        if (typeof theme === "string"){
            immediateWrapper.classList.add(theme + "-theme");
        }
    }

    get active(){
        return this.getAttribute("active") !== null;
    }

    set active(value){
        if (value){
            this.setAttribute("active", "");
        } else {
            this.removeAttribute("active");
        }
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get errorMessage(){
        return null;
    }

    set errorMessage(value) {}

    get href(){
        return this.getAttribute("href");
    }

    set href(value){
        this.setAttribute("href", value);
    }

    get menu(){
        return this.getAttribute("menu") !== null;
    }

    set menu(value){
        if (value){
            this.setAttribute("menu", "");
        } else {
            this.removeAttribute("menu");
        }
    }

    get toggleable(){
        return this.getAttribute("toggleable") !== null;
    }

    set toggleable(value){
        if (value){
            this.setAttribute("toggleable", "");
        } else {
            this.removeAttribute("toggleable");
        }
    }

    get theme(){
        if (this.getAttribute("theme") !== null){
            return this.getAttribute("theme");
        }

        if (this.disabled){
            return "gray";
        }

        let T1, T2;
        if (this.menu){
            T1 = "black";
            T2 = "gray-to-black";
        } else {
            T1 = "blue";
            T2 = "gray-to-blue";
        }

        let finalTheme;
        let toggleable = this.toggleable;
        let value = this.value;
        let active = this.active;
        if (!toggleable) {
            finalTheme = T1;
        } else if (active){
            finalTheme = T1;
        } else if (value){
            finalTheme = T1;
        } else {
            finalTheme = T2;
        }

        return finalTheme;
    }

    set theme(value){
        this.setAttribute("theme", value);
    }

    get value(){
        if (this.toggleable){
            return this.__value;
        } else {
            return undefined;
        }
    }

    set value(value){
        if (this.toggleable){
            this.__value = !!value;
            this._updateTheme();
        }
    }

    click(){
        this.__link.click();
    }

    _disableChildren(){
        this._updateTheme();
    }

    _enableChildren(){
        this._updateTheme();
    }

}

SciLinkButton.themes = ["black", "blue", "gray", "gray-to-black", "gray-to-blue"];

SciLinkButton.observedAttributes = ["active", "disabled", "label", "menu", "theme", "toggleable", "width"];

SciLinkButton.template = null;

SciLinkButton.templateText = `
    <style>
        @import url(../core-styles.css);
        
        :host{
            cursor: pointer;
        }
        
        :host([disabled]), :host([active]){
            cursor: default;
        }
        
        :host([disabled]) a, :host([active]) a{
            cursor: default;
        }
        
        .immediate-wrapper{
            display: inline-block;
        }
        
        a{
            color: #1658da;
        }
        
        a:focus{
            outline: none;
        }
        
        .black-theme a{
            color: #333;
        }
        
        .gray-theme a, .gray-to-blue-theme a, .gray-to-black-theme a{
            color: rgb(186, 196, 209);
        }
        
        .gray-to-blue-theme:hover a{
            color: #1658da;
        }
        
        .gray-to-black-theme:hover a{
            color: #333;
        }
        
        a:hover, a:active{
            color: #1658da;
        }
        
        .black-theme a:hover, .black-theme a:active{
            color: #333;
        }
        
        .gray-theme a:hover, .gray-theme a:active{
            color: rgb(186, 196, 209);
        }
        
        .immediate-wrapper ::slotted(svg){
            width: 14px;
            height: 14px;
            vertical-align: -2px;
        }
        
        .immediate-wrapper ::slotted(svg),
        .gray-to-blue-theme:hover ::slotted(svg){
            fill: #1658da;
            stroke: #1658da;
        }
        
        .black-theme ::slotted(svg),
        .gray-to-black-theme:hover ::slotted(svg){
            fill: #333;
            stroke: #333;
        }
        
        .gray-theme ::slotted(svg),
        .gray-to-blue-theme ::slotted(svg),
        .gray-to-black-theme ::slotted(svg){
            fill: rgb(186, 196, 209);
            stroke: rgb(186, 196, 209);
        }
    </style>
    <div class="immediate-wrapper">
        <slot name="image" class="image"></slot>
        <a href="#">ERROR! PLEASE, DEFINE THE LABEL ATTRIBUTE</a>
    </div>
`;

customElements.define("sci-link-button", SciLinkButton);