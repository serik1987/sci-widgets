class SciWindow extends SciWidget{
    super(){
        constructor();
    }

    _initializeWindow(){
        this.__windowOverlapper = this.shadowRoot.querySelector(".window-overlapper");
        this.__window = this.shadowRoot.querySelector(".window");
    }

    _createTemplate(htmlCode){
        if (SciWindow.template === null){
            SciWindow.template = super._createTemplate(SciWindow.templateText);
        }

        let template = document.createElement("template");
        let parentContent = SciWindow.template.content.cloneNode(true);
        template.content.append(parentContent);

        let window = template.content.querySelector(".window");
        window.innerHTML = htmlCode;

        return template;
    }

    get window(){
        return this.__window;
    }

    get windowOverlapper(){
        return this.__windowOverlapper;
    }

    close(){
        let classList = this.windowOverlapper.classList;

        if (classList.contains("opened")){
            classList.remove("opened");
            let newEvent = new CustomEvent("sci-window-close", {});
            this.dispatchEvent(newEvent);
        }
    }

    open(){
        let classList = this.windowOverlapper.classList;

        if (!classList.contains("opened")){
            classList.add("opened");
            let newEvent = new CustomEvent("sci-window-open", {});
            this.dispatchEvent(newEvent);
        }
    }
}