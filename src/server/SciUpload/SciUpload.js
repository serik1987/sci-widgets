class SciUpload extends SciWidget{

    constructor(){
        super();
        let self = this;

        if (SciUpload.template === null){
            SciUpload.template = this._createTemplate(SciUpload.templateText);
        }

        let content = SciUpload.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__fileInfo = shadow.querySelector("#file-info");
        this.__loadBox = shadow.querySelector("#load");
        this.__removeBox = shadow.querySelector("#remove");
        this.__input = shadow.querySelector("input");
        this.__value = null;
        this.__url = null;
        this.__updateValue();

        this.__loadBox.addEventListener("click", event => {
            self.load();
        });

        this.__removeBox.addEventListener("click", event => {
            self.remove();
        });

        this.__input.addEventListener("change", event => {
            self.__startLoad();
        });

        this.__upload = null;
        this.__remove = null;
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "multiple") {
            this.__input.multiple = newValue !== null;
        } else if (name === "accept") {
            if (newValue !== null) {
                this.__input.setAttribute("accept", newValue);
            } else {
                this.__input.removeAttribute("accept");
            }
        } else if (name === "no-status-bar") {
            if (newValue !== null) {
                this.__fileInfo.style.display = "none";
            } else {
                this.__fileInfo.style.display = null;
            }
        } else if (name === "no-label"){
            let label = this.shadowRoot.querySelector("label");
            if (newValue !== null){
                label.style.display = "none";
            } else {
                label.style.display = null;
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    __updateValue(){
        let classList = this.__fileInfo.classList;

        if (typeof this.__value === "string") {
            if (!classList.contains("not-selected")) {
                classList.add("not-selected");
            }
            this.__loadBox.enable();
            this.__removeBox.enable();
            this.__fileInfo.innerText = "Файл успешно загружен";
        } else if (this.__value !== null) {
            if (classList.contains("not-selected")) {
                classList.remove("not-selected");
            }
            this.__loadBox.enable();
            this.__removeBox.enable();

            if (this.multiple) {
                this.__fileInfo.innerText = `${this.__value.length} файл(ов) выбрано`;
            } else {
                this.__fileInfo.innerText = this.__value.name;
            }
        } else {
            if (!classList.contains("not-selected")){
                classList.add("not-selected");
            }
            this.__loadBox.enable();
            this.__removeBox.disable();

            this.__fileInfo.innerText = "Файл не выбран";
        }
    }

    _enableChildren(){
        this.__updateValue();
    }

    _disableChildren(){
        this.__loadBox.disable();
        this.__removeBox.disable();
    }

    get accept(){
        return this.getAttribute("accept");
    }

    set accept(value){
        if (value !==  null){
            this.setAttribute("accept", value);
        } else {
            this.removeAttribute("accept");
        }
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

    get onRemove(){
        return this.__remove;
    }

    set onRemove(value){
        if (typeof value === "function"){
            this.__remove = value;
        } else {
            throw new TypeError("sci-upload: The value of the onRemove property must be string");
        }
    }

    get onUpload(){
        return this.__upload;
    }

    set onUpload(value){
        if (typeof value === "function"){
            this.__upload = value;
        } else {
            throw new TypeError("sci-upload: The value of the onUpload property must be string");
        }
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

    get url(){
        return this.__url;
    }

    set url(value){
        this.__url = value.toString();
    }

    get value(){
        this.errorMessage = "";
        if (this.required && this.__value === null){
            this.errorMessage = "Пожалуйста, сначала загрузите файл";
            throw new TypeError("sci-upload: no file was uploaded by the user");
        }
        return this.__value;
    }

    set value(value){
        this.__value = "";
        this.__updateValue();
    }

    load(){
        this.__input.click();
    }

    remove(){
        this.__fileInfo.innerText = "Удаление...";

        let startRemoveEvent = new CustomEvent("sci-remove-start", {bubbles: true, detail: this.__value});
        this.dispatchEvent(startRemoveEvent);

        if (this.onRemove === null){
            throw new TypeError("sci-remove: Please, set the onRemove property");
        }
        this.onRemove(this.__value)

            .then(() => {
                this.__value = null;
                this.__url = null;
                this.__updateValue();

                let removeSuccess = new CustomEvent("sci-remove-success", {bubbles: true, detail: null});
                this.dispatchEvent(removeSuccess);
            })

            .catch(e => {
                this.__updateValue();

                let removeFailure = new CustomEvent("sci-remove-failed", {bubbles: true, detail: e});
                this.dispatchEvent(removeFailure);
            });
    }

    __startLoad(){
        let data = this.__input.files;
        if (!this.multiple){
            data = data[0];
        } else {
            data = [...data];
        }
        this.__fileInfo.innerText = "Загрузка...";
        this.__input.value = "";

        let startUploadEvent = new CustomEvent("sci-upload-start", {bubbles: true, detail: data});
        this.dispatchEvent(startUploadEvent);

        if (this.onUpload === null){
            throw new TypeError("sci-upload: Please, set the onUpload property");
        }
        this.onUpload(data)

            .then(value => {
                if (!value){
                    value = null;
                }
                this.__url = value;
                this.__value = data;
                this.__updateValue();

                let uploadSuccess = new CustomEvent("sci-upload-success", {bubbles: true, detail: this.url});
                this.dispatchEvent(uploadSuccess);
            })

            .catch(e => {
                this.__updateValue();

                let uploadFailed = new CustomEvent("sci-upload-failed", {bubbles: true, detail: e});
                this.dispatchEvent(uploadFailed);
            });
    }

}

SciUpload.observedAttributes = ["accept", "disabled", "label", "multiple", "no-label", "no-status-bar", "width"];