class SciForm extends SciWidget{

    constructor(){
        super();

        if (SciForm.template === null){
            SciForm.template = this._createTemplate(SciForm.templateText);
        }

        let content = SciForm.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__defaultValue = null;
    }

    __updateChildren(){
        for (let localName in this.__defaultValue){
            if (this.__defaultValue.hasOwnProperty(localName)){
                let localValue = this.__defaultValue[localName];
                let element = this.getElement(localName);
                if (element !== null){
                    element.value = localValue;
                }
            }

        }
    }

    get defaultValue(){
        return this.__defaultValue;
    }

    get value(){
        let value = {};
        let noErrors = true;

        for (let element of this.getElements()){
            let elementName = element.getAttribute("name");
            let elementValue = null;
            try{
                elementValue = element.value;
            } catch (TypeError){
                noErrors = false;
            }
            if (elementValue !== undefined){
                value[elementName] = elementValue;
            }
        }

        if (!noErrors){
            throw new TypeError("sci-form: some of the fields were filled incorrectly by the user");
        }

        return value;
    }

    set value(value){
        this.__defaultValue = {...value};
        this.__updateChildren();
    }

    getElement(name){
        return this.querySelector(`[name=${name}]`);
    }

    getElements(){
        return this.querySelectorAll("[name]");
    }

    reset(){
        for (let element of this.getElements()){
            element.value = null;
        }

        this.__updateChildren();
    }

}