class SciDialog extends SciWindow{

    constructor(){
        super();
        let self = this;

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
        this.__isModal = false;
        this.__resolve = null;
        this.__reject = null;
        this.onSubmit = null;

        this.addEventListener("click", function(event){
            let target = event.target;

            if (target.getAttribute("name") === "reset" || target.classList.contains("reset")){
                self.close();
                if (self.__isModal){
                    self.__reject();
                }
            }
        });

        shadow.querySelector(".close-button").addEventListener("click", event => {
            self.reset()
                .then(result => {
                    if (result){
                        self.close();
                        let newEvent = new CustomEvent("sci-reset", {bubbles: true});
                        self.dispatchEvent(newEvent);
                    }
                });
        });

        this.__form.addEventListener("sci-submit", event => {
            event.stopImmediatePropagation();

            let newEvent = new CustomEvent("sci-submit", {bubbles: true});
            self.dispatchEvent(newEvent);
        });

        this.__form.addEventListener("sci-reset", event => {
            event.stopImmediatePropagation();

            let newEvent = new CustomEvent("sci-reset", {bubbles: true});
            self.dispatchEvent(newEvent);
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "label") {
            this.shadowRoot.querySelector(".title-label").innerHTML = newValue;
        } else if (name === "permanent"){
            let closeButton = this.shadowRoot.querySelector(".close-button");
            if (newValue !== null){
                closeButton.style.display = "none";
            } else {
                closeButton.style.display = null;
            }
        } else if (name === "size") {
            if (SciDialog.SIZE_LIST.indexOf(newValue) < 0) {
                this.setAttribute("size", "small");
            }
        } else if (name === "width"){
            let win = this.shadowRoot.querySelector(".window");
            if (newValue !== null){
                win.style.width = newValue + "px";
            } else {
                win.style.width = null;
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get form(){
        return this.shadowRoot.querySelector("sci-form");
    }

    get isModal(){
        return this.__isModal;
    }

    get isTooTall(){
        return this.shadowRoot.querySelector(".window").classList.contains("too-tall");
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
        let self = this;
        if (value !== null){
            this.__form.onSubmit = function(data){
                return value(data)
                    .then(newData => {
                        self.close();
                        if (self.__isModal){
                            self.__resolve(newData);
                        }
                        return newData;
                    });
            }
        } else {
            let self = this;
            this.__form.onSubmit = function(data){
                self.close();
                if (self.isModal){
                    self.__resolve(data);
                }
                return Promise.resolve(data);
            }
        }
    }

    getElement(name){
        return this.__form.getElement(name);
    }

    getElements(){
        return this.__form.getElements();
    }

    open(){
        let self = this;
        return this.reset()
            .then(result => {
                if (result){
                    super.open();
                    self.updateHeight(true);
                }
                return result;
            });
    }

    openModal(data = null){
        let self = this;
        if (this.__isModal){
            return Promise.reject(new TypeError("sci-dialog: can't openModal() the same dialog twice!"));
        }
        return this.open()
            .then(result => {
                if (!result){
                    throw new TypeError("sci-dialog: data reset are failed by some reason");
                }
                if (data !== null){
                    this.__form.value = data;
                }
                this.__isModal = true;
                return new Promise((resolve, reject) => {
                    self.__resolve = function(data){
                        self.__isModal = false;
                        self.__resolve = null;
                        self.__reject = null;
                        resolve(data);
                    }
                    self.__reject = function(){
                        self.__isModal = false;
                        self.__resolve = null;
                        self.__reject = null;
                        reject(new TypeError("sci-dialog: the operation was cancelled by the user"));
                    }
                });
            });
    }

    reset(){
        let self = this;
        return this.__form.reset()
            .then(data => {
                if (data === true){
                    self.close();
                    if (self.__isModal){
                        self.__reject();
                    }
                }
                return data;
            });
    }

    submit(){
        return this.__form.submit();
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
SciDialog.observedAttributes = ["label", "permanent", "size", "width"];

