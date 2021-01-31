class SciScrollable extends SciWidget{

    constructor(){
        super();

        this.__restrictedHeight = false;
        this.__sliderMove = null;
        this.__padding = null;
    }

    _createTemplate(htmlCode){
        let parentTemplate = SciScrollable.template;
        if (parentTemplate === null){
            parentTemplate = super._createTemplate(SciScrollable.templateText);
        }

        let childTemplate = super._createTemplate(htmlCode);

        let template = parentTemplate.cloneNode(true);
        template.content.querySelector(".content").append(childTemplate.content);

        return template;
    }

    _implementScroll(){
        this.__scrollableContent = this.shadowRoot.querySelector(".content");
        let scrollSlider = this.shadowRoot.querySelector(".scroll-slider");
        let self = this;
        this.updateHeight();

        if (!SciWidget.detectMobile()){
            this.classList.add("not-mobile");
        }

        function __getScrollMousePosition(event){
            let x = event.clientX;
            let y = event.clientY;
            let x0 = scrollSlider.getBoundingClientRect().left;
            let y0 = scrollSlider.getBoundingClientRect().top;
            return {
                x: x-x0,
                y: y-y0
            }
        }

        function scrollContent(deltaY){
            let content = self.__scrollableContent;
            let y0 = content.scrollTop;
            let y1 = y0 + deltaY;
            let cH = self.clientHeight;
            let sH = content.scrollHeight;

            if (y1 < 0){
                y1 = 0;
            }

            if (y1 > sH - cH){
                y1 = sH - cH;
            }

            content.scrollTop = y1;
        }

        window.addEventListener("load", event => {
            self.updateHeight();
        })

        window.addEventListener("resize", event => {
            self.updateHeight();
        });

        this.addEventListener("mousewheel", event => {
            self.updateHeight(false);
            self.__setDesktop();

            if (this.__restrictedHeight && this.enabled){
                event.stopPropagation();
                event.preventDefault();
                scrollContent(event.deltaY * SciWidget.PROPERTIES.scrollSpeed);
            }

            self.__updateScrollPosition();
        });

        scrollSlider.addEventListener("mousedown", function initSliderMotion(event) {
            self.updateHeight();
            self.__setDesktop();

            self.__sliderMove = __getScrollMousePosition(event);
        });

        document.addEventListener("mousemove", event => {
            if (self.__sliderMove){
                let oldMove = self.__sliderMove;
                let newMove = __getScrollMousePosition(event);
                let deltaY = newMove.y - oldMove.y;
                scrollContent(deltaY);
                self.__updateScrollPosition();
            }
        });

        document.addEventListener("mouseup", function terminateSliderMotion(event) {
            self.__sliderMove = null;
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "padding"){
            let content = this.shadowRoot.querySelector(".content");
            this.__value = newValue;
            let padding = -1;
            if (newValue !== null){
                padding = parseFloat(newValue);
            }
            if (padding > 0){
                content.style.paddingTop = padding + "px";
                content.style.paddingBottom = padding + "px";
            } else {
                content.style.paddingTop = null;
                content.style.paddingBottom = null;
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get padding(){
        return this.__padding;
    }

    set padding(value){
        if (value !== null){
            this.setAttribute("padding", value);
        } else {
            this.removeAttribute("padding");
        }
    }

    updateHeight(updatePosition = true){
        let content = this.__scrollableContent;
        if (!content){
            throw new TypeError("You don't run the _implementScroll method after creating the DOM structure");
        }

        let sH = content.scrollHeight;
        let cH = this.clientHeight;
        if (cH < sH && !this.classList.contains("scrollable")){
            this.classList.add("scrollable");
            this.__restrictedHeight = true;
        }
        if (cH >= sH && this.classList.contains("scrollable")){
            this.classList.remove("scrollable");
            this.__restrictedHeight = false;
        }

        if (updatePosition){
            this.__updateScrollPosition();
        }
    }

    __updateScrollPosition(){
        if (this.classList.contains("scrollable")){
            let content = this.__scrollableContent;

            let cH = this.clientHeight;
            let sH = content.scrollHeight;
            let slider = this.shadowRoot.querySelector(".scroll-slider");
            let sliderHeight = Math.round(cH * cH / sH - 6);
            if (sliderHeight < 20){
                sliderHeight = 20;
            }
            slider.style.height = sliderHeight + "px";

            let y0 = content.scrollTop;
            let maxHeight = cH - sliderHeight - 6;
            let currentHeight = y0 * maxHeight / (sH - cH);

            slider.style.top = currentHeight + "px";
        }
    }

    __setDesktop(){
        if (!this.classList.contains("not-mobile")){
            this.classList.add("not-mobile");
        }
    }

}