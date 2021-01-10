class SciCheckbox extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciCheckbox.template === null){
            SciCheckbox.template = this._createTemplate(SciCheckbox.templateText);
        }

        let content = SciCheckbox.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);
        this.__checkbox = shadow.querySelector("input");

        this.__defaultValue = false;
        if (this.getAttribute("checked") !== null){
            this.__defaultValue = true;
            this.__checkbox.checked = true;
            this.classList.add("checked");
        }

        if (this.getAttribute("align-right") !== null){
            let wrapper = shadow.querySelector(".immediate-wrapper");
            let img = shadow.querySelector(".img");
            wrapper.append(img);
        }

        this.addEventListener("click", event => {
            event.preventDefault();
            if (self.disabled){
                return;
            }
            self.value = !self.value;
            let newEvent = new Event("change", event);
            self.dispatchEvent(newEvent);
        });
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get required(){
        return this.getAttribute("required") !== null;
    }

    set required(value){
        if (value){
            this.setAttribute("required", "");
        } else {
            this.removeAttribute("required");
        }
    }

    get undefined(){
        return this.getAttribute("undefined") !== null;
    }

    set undefined(value){
        if (value){
            this.setAttribute("undefined", "");
        } else {
            this.removeAttribute("undefined");
        }
    }

    get value(){
        this.errorMessage = "";
        let checked = this.__checkbox.checked;
        if (this.undefined){
            checked = null;
            if (this.required){
                this.errorMessage = "Пожалуйста, выберите нужную опцию";
                throw new TypeError("sci-checkbox: The user don't select necessary option");
            }
        }
        return checked;
    }

    set value(value){
        if (this.getAttribute("undefined") !== null){
            this.removeAttribute("undefined");
        }
        let checked = !!value;
        this.__checkbox.checked = checked;
        if (checked && !this.classList.contains("checked")){
            this.classList.add("checked");
        }
        if (!checked && this.classList.contains("checked")){
            this.classList.remove("checked");
        }
    }

}

SciCheckbox.observedAttributes = ["disabled", "label"];

SciCheckbox.template = null;

SciCheckbox.templateText = `
<style>
    @import url(../core-styles.css);
    
    :host .immediate-wrapper{
    margin-bottom: 3px;
        font-size: 0;
    }
    
    :host([align-right]) .immediate-wrapper{
        text-align: right;
    }
    
    input{
        display: none;
    }
    
    .img{
        display: inline-block;
        position: relative;
        vertical-align: top;
        margin-right: 5px;
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        cursor: pointer;
        border: 2px solid #1658da;
        border-radius: 4px;
        background: #fff url(../img/checkbox.svg) 50% 50% no-repeat;
        background-size: 100% 100%;
    }
    
    :host([align-right]) .img{
        margin-right: 0;
        margin-left: 5px;
    }
    
    :host(.checked) .img{
        background-color: #1658da;
    }
    
    :host([disabled]) .img{
        border-color: rgb(186, 196, 209);
        cursor: default;
    }
    
    :host(.checked[disabled]) .img{
        background-color: rgb(186, 196, 209);
    }
    
    :host([disabled]) label{
        cursor: default;
    }
    
    :host([undefined]) .img{
        border-color: rgb(186, 186, 209);
        background-color: rgb(186, 196, 209);
    }
    
    label{
        display: inline-block;
        vertical-align: top;
        margin-bottom: 0;
        width: calc(100% - 23px);
        cursor: pointer;
        font-size: 14px;
        line-height: 18px;       
    }
</style>
<div class="immediate-wrapper">
    <input type="checkbox"/>
    <span class="img"></span>
    <label>WARNING. PLEASE, DEFINE THE LABEL ATTRIBUTE OF THIS WIDGET</label>
</div>
<div class="error-message"></div>
`;


customElements.define("sci-checkbox", SciCheckbox);