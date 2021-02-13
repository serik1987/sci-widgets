class SciDraggable extends SciWidget{

    constructor(){
        super();

        this.__restore();
    }

    _implementDragging(){
        let self = this;

        this.addEventListener("mousedown", event => {
            if (event.detail === 1 && event.button === 0){
                event.preventDefault();
                self.__startDrag(event.clientX, event.clientY);
            }
        });

        this.addEventListener("touchstart", event => {
            if (event.touches.length === 1){
                event.preventDefault();
                self.__previousTouch = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                }
                self.__startDrag(self.__previousTouch.x, self.__previousTouch.y);
            }
        });

        window.addEventListener("mousemove", event => {
            if (self.dragging){
                event.preventDefault();
                self.__drag(event.clientX, event.clientY);
            }
        });

        window.addEventListener("touchmove", event => {
            if (self.dragging){
                if (event.touches.length === 1){
                    self.__previousTouch = {
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY
                    }
                    self.__drag(self.__previousTouch.x, self.__previousTouch.y);
                } else {
                    self.__cancelDrag();
                }
            }
        });

        this.addEventListener("mouseup", event => {
            if (self.dragging){
                event.preventDefault();
                self.__finishDrag(event.clientX, event.clientY);
            }
        });

        this.addEventListener("touchend", event => {
            if (self.dragging){
                event.preventDefault();
                self.__finishDrag(self.__previousTouch.x, self.__previousTouch.y);
            }
        });

        document.addEventListener("mouseleave", event => {
            if (self.dragging){
                event.preventDefault();
                self.__cancelDrag();
            }
        });

        document.addEventListener("touchcancel", event => {
            if (self.dragging){
                event.preventDefault();
                self.__cancelDrag();
            }
        });

    }

    __startDrag(x0, y0){
        let rect = this.getBoundingClientRect();
        this.__positionX = x0 - rect.left;
        this.__positionY = y0 - rect.top;
        this.__initialX = rect.left;
        this.__initialY = rect.top;
        this.__dragging = true;
        this.style.position = "fixed";
        this.style.zIndex = "10000";
        this.__updatePosition(x0, y0);

        let newEvent = new CustomEvent("sci-drag-start", {bubbles: true, detail: {x: x0, y: y0}});
        this.dispatchEvent(newEvent);
    }

    __drag(x, y){
        this.__updatePosition(x, y);

        let newEvent = new CustomEvent("sci-drag-move", {bubbles: true, detail: {x: x, y: y}});
        this.dispatchEvent(newEvent);
    }

    __finishDrag(x, y){
        this.__restore();

        let newEvent = new CustomEvent("sci-drag-end", {bubbles: true, detail: {x: x, y: y}});
        this.dispatchEvent(newEvent);
    }

    __cancelDrag(){
        this.__restore();

        let newEvent = new CustomEvent("sci-drag-cancel", {bubbles: true});
        this.dispatchEvent(newEvent);
    }

    __updatePosition(x, y){
        let dx = x - this.__positionX;
        let dy = y - this.__positionY;
        this.style.left = dx + "px";
        this.style.top = dy + "px";
    }

    __restore(){
        this.style.position = null;
        this.style.zIndex = null;
        this.style.left = null;
        this.style.top = null;
        this.__dragging = false;
        this.__positionX = -1;
        this.__positionY = -1;
        this.__initialX = -1;
        this.__initialY = -1;
        this.__previousTouch = null;
    }

    __printLine(str){
        let p = document.createElement("p");
        p.innerHTML = str;
        document.body.append(p);
    }

    get dragging(){
        return this.__dragging;
    }



}