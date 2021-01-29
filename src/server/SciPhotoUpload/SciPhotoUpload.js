class SciPhotoUpload extends SciWidget {

    constructor(){
        super();
        let self = this;

        if (SciPhotoUpload.template === null){
            SciPhotoUpload.template = this._createTemplate(SciPhotoUpload.templateText);
        }

        let content = SciPhotoUpload.template.content.cloneNode(true);
        let shadow = this.attachShadow({mode: "open"});
        shadow.append(content);

        this.__img = shadow.getElementById("img");
        this.__uploader = shadow.querySelector("sci-upload");
        this.__url = null;

        let oldUrl = null;
        this.__uploading = false;
        this.__queueUrl = null;

        this.__uploader.addEventListener("sci-upload-start", event => {
            let file = event.detail;
            oldUrl = this.url;
            this.url = URL.createObjectURL(file);

            this.__uploading = true;
            let newEvent = new CustomEvent("sci-upload-start", {bubbles: true, detail: file});
            self.dispatchEvent(newEvent);
        });

        this.__uploader.addEventListener("sci-upload-success", event => {
            this.__uploading = false;
            oldUrl = null;

            let newUrl = event.detail;
            let blobUrl = this.url;

            this.url = newUrl;
            URL.revokeObjectURL(blobUrl);

            if (this.__queueUrl !== null){
                this.url = this.__queueUrl;
                this.__queueUrl = null;
            }

            let newEvent = new CustomEvent("sci-upload-success", {bubbles: true, detail: newUrl});
            self.dispatchEvent(newEvent);
        });

        this.__uploader.addEventListener("sci-upload-failed", event => {
            this.__uploading = false;
            let newUrl = this.url;
            let e = event.detail;

            URL.revokeObjectURL(newUrl);
            this.url = oldUrl;

            if (this.__queueUrl !== null){
                this.url = this.__queueUrl;
                this.__queueUrl = null;
            }

            let newEvent = new CustomEvent("sci-upload-failed", {bubbles: true, detail: e});
            self.dispatchEvent(newEvent);
        });

        this.__uploader.addEventListener("sci-remove-start", event => {
            let newEvent = new CustomEvent("sci-remove-start", {bubbles: true, detail: event.detail});
            self.dispatchEvent(newEvent);
        });

        this.__uploader.addEventListener("sci-remove-success", event => {
            this.url = null;

            let newEvent = new CustomEvent("sci-remove-success", {bubbles: true, detail: event.detail});
            self.dispatchEvent(newEvent);
        });

        this.__uploader.addEventListener("sci-remove-failed", event => {
            let newEvent = new CustomEvent("sci-remove-failed", {bubbles: true, detail: event.detail});
            self.dispatchEvent(newEvent);
        });

        this.updateWidth();
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "aspect") {
            if (newValue !== null) {
                let x = parseFloat(newValue);
                if (!(x > 0.0)) {
                    throw new TypeError("sci-photo-upload: the aspect attribute can't have value below zero or " +
                        "not a number");
                }
            }
            this.updateWidth();
        } else if (name === "width" || name === "height"){
            super.attributeChangedCallback(name, oldValue, newValue);
            this.updateWidth();
        } else if (name === "placeholder"){
            this.url = this.url;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    _enableChildren(){
        this.__uploader.enable();
    }

    _disableChildren(){
        this.__uploader.disable();
    }

    get aspect(){
        let value = this.getAttribute("aspect");
        let aspect = 0.0;

        if (value === null){
            aspect = 1.5;
        } else {
            aspect = parseFloat(value);
        }

        return aspect;
    }

    set aspect(value){
        this.setAttribute("aspect", value.toString());
    }

    get errorMessage(){
        return super.errorMessage;
    }

    set errorMessage(value){
        super.errorMessage = value;
        this.updateWidth();
    }

    get onUpload(){
        return this.__uploader.onUpload;
    }

    set onUpload(value){
        this.__uploader.onUpload = value;
    }

    get onRemove(){
        return this.__uploader.onRemove;
    }

    set onRemove(value){
        this.__uploader.onRemove = value;
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

    get url(){
        return this.__url;
    }

    set url(value){
        this.__url = value;

        if (this.__uploading){
            this.__queueUrl = value;
            return;
        }

        if (value === null){
            value = this.placeholder;
        }

        if (value !== null){
            this.__img.style.backgroundImage = `url(${value})`;
        } else {
            this.__img.style.backgroundImage = null;
        }
    }

    get value(){
        return this.__uploader.value;
    }

    set value(value){
        this.url = value;
    }

    load(){
        this.__uploader.load();
    }

    remove(){
        this.__uploader.remove();
    }

    updateWidth(){
        let height = this.clientHeight - 10 - this.__uploader.clientHeight;
        if (this.errorMessage){
            height -= this.shadowRoot.querySelector(".error-message").clientHeight;
        }

        let width = height / this.aspect;

        this.__img.style.width = width + "px";
        this.__img.style.height = height + "px";
    }

}

SciPhotoUpload.observedAttributes = ["aspect", "disabled", "height", "placeholder", "width"];