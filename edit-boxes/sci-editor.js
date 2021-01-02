class SciEditor extends SciWidget{

    constructor(){
        super();
        this.__defaultValue = "";
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "value") {
            this.__defaultValue = newValue;
            this.value = newValue;
        } else if (name === "position") {
            if (SciEditor.supportedPositions.indexOf(newValue) === -1) {
                throw TypeError("Error in SciEditor 'position' attribute: such a position is not supported");
            }
            SciEditor.supportedPositions.forEach(value => {
                let className = "position-" + value;
                if (this.classList.contains(className)) {
                    this.classList.remove(className);
                }
            });
            let className = "position-" + newValue;
            this.classList.add(className);
        } else if (name === "align"){
            this._setAlign(newValue);
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _setAlign(value){
        if (SciEditor.supportedAligns.indexOf(value) === -1){
            throw new TypeError("Error in set align property or attribute in SciEditor: the align type is unknown or "+
                "unsupported");
        }
        SciEditor.supportedAligns.forEach(align => {
            let alignStyle = "align-" + align;
            if (this.classList.contains(alignStyle)){
                this.classList.remove(alignStyle);
            }
        });
        let alignStyle = "align-" + value;
        this.classList.add(alignStyle);
    }

    get align(){
        return this.getAttribute("align");
    }

    set align(value){
        this.setAttribute("align", value);
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get maxLength(){
        let value = parseInt(this.getAttribute("maxlength"));
        if (isNaN(value)){
            value = Infinity;
        }
        return value;
    }

    set maxLength(value){
        if (value < Infinity) {
            this.setAttribute("maxlength", value);
        } else {
            this.removeAttribute("maxlength");
        }
    }

    get minLength(){
        let value = parseInt(this.getAttribute("minlength"));
        if (isNaN(value)){
            value = 0;
        }
        return value;
    }

    set minLength(value){
        if (value > 0){
            this.setAttribute("minlength", value);
        } else {
            this.removeAttribute("minlength");
        }
    }

    get placeholder(){
        return this.getAttribute("placeholder");
    }

    set placeholder(value){
        if (value !== null){
            this.setAttribute("placeholder", value);
        } else {
            this.removeAttribute("placeholder");
        }
    }

    get selectionString(){
        let i1 = this.selectionStart;
        let i2 = this.selectionEnd;
        let s = this.rawValue;
        if (i1 === undefined || i2 === undefined || s === undefined){
            throw new TypeError("Either selectionStart or selectionEnd or rawValue are not implemented in the extension "+
                "of SciEditor");
        }
        return s.substr(i1, i2-i1);
    }

}

SciEditor.supportedPositions = ["left", "top"];
SciEditor.supportedAligns = ['left', 'right', 'center'];