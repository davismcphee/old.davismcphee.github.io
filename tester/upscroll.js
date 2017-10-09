var Upscroll = function (selector, options) {

    this.options = Object.assign({
        container: "body",
        minScrollHeight: 100,
        minWidthToHideScroll: 400,
        scrollSpeed: 600,
        scrollTopOffset: 250,
        scrollUpDisplayTime: 2000
    }, options);

    var _data = {
            containerElement: null,
            lastScrollTop: 0,
            upscrollInstances: []
        },
        self = this;

    var show = function (upscrollInstance) {
        upscrollInstance.element.classList.add("show");
    };

    var hide = function (upscrollInstance) {
        upscrollInstance.element.classList.remove("show");
    };

    var slideOut = function (upscrollInstance) {
        upscrollInstance.element.classList.add("slide-out");
    };

    var slideIn = function (upscrollInstance) {
        upscrollInstance.element.classList.remove("slide-out");
    };

    var addIntialTimeout = function (upscrollInstance) {
        upscrollInstance.data.timeout = setTimeout(function () {
            slideIn(upscrollInstance);
            upscrollInstance.data.initialized = true;
        }, upscrollInstance.data.scrollUpDisplayTime);
    };

    var clearInitialTimeout = function (upscrollInstance) {
        clearTimeout(upscrollInstance.data.timeout);
    };

    var upscrollEvent = function () {
        _data.upscrollInstances.forEach(function (upscrollInstance) {
            var scrollTop = upscrollInstance.data.containerElement.scrollTop,
                containerWidth = upscrollInstance.data.containerElement.clientWidth,
                shouldShow = scrollTop >= upscrollInstance.data.minScrollHeight 
                    && containerWidth >= upscrollInstance.data.minWidthToHideScroll,
                isScrollingUp = scrollTop < upscrollInstance.data.lastScrollTop;

            if (shouldShow) {
                show(upscrollInstance);

                if (!upscrollInstance.data.initialized || isScrollingUp)
                    slideOut(upscrollInstance);
                if (upscrollInstance.data.isOpen && upscrollInstance.data.intialized) {
                    slideIn(upscrollInstance);
                } else if (!upscrollInstance.data.isOpen || isScrollingUp) {
                    clearInitialTimeout(upscrollInstance);
                    addIntialTimeout(upscrollInstance);
                }

                upscrollInstance.data.isOpen = true;
            } else {

                if (containerWidth < upscrollInstance.data.minWidthToHideScroll) {
                    show(upscrollInstance);
                    slideOut(upscrollInstance);
                } else {
                    hide(upscrollInstance);
                    slideIn(upscrollInstance);
                }

                upscrollInstance.data.isOpen = false;
                upscrollInstance.data.initialized = false
            }

            upscrollInstance.data.lastScrollTop = scrollTop;
        });
    };

    var getAttrIfExists = function (element, attribute, parseMethod) {
        var returnValue = null;
        if (element.hasAttribute(attribute)) {
            var retrievedAttribute = element.getAttribute(attribute);
            if (parseMethod)
                returnValue = parseMethod(retrievedAttribute);
            else
                returnValue = retrievedAttribute;
        }
        return returnValue;
    };

    this.initialize = function () {
        this.clear();
        
        _data.containerElement = document.querySelector(self.options.container);
        _data.lastScrollTop = _data.containerElement.scrollTop;

        document.querySelectorAll(selector || "[upscroll-button]")
            .forEach(function (upscrollElement) {
                var upscrollInstance = {
                    element: upscrollElement,
                    data: {
                        containerElement: getAttrIfExists(upscrollElement, "data-us-container", function (selector) {
                            return document.querySelector(selector);
                        }) || _data.containerElement,
                        initialized: false,
                        isOpen: false,
                        minScrollHeight: getAttrIfExists(upscrollElement, "data-us-min-scroll-height", parseInt)
                            || self.options.minScrollHeight,
                        minWidthToHideScroll: getAttrIfExists(upscrollElement, "data-us-min-hide-width", parseInt)
                            || self.options.minWidthToHideScroll,
                        scrollSpeed: getAttrIfExists(upscrollElement, "data-us-scroll-speed", parseInt)
                            || self.options.minScrollHeight,
                        scrollTopOffset: getAttrIfExists(upscrollElement, "data-us-scroll-offset", parseInt)
                            || self.options.minScrollHeight,
                        scrollUpDisplayTime: getAttrIfExists(upscrollElement, "data-us-display-time", parseInt)
                            || self.options.minScrollHeight,
                        timeout: null
                    }
                };
                upscrollInstance.lastScrollTop = upscrollInstance.data.containerElement.scrollTop;
                _data.upscrollInstances.push(upscrollInstance);
            });

        window.addEventListener("scroll", upscrollEvent);
        window.addEventListener("resize", upscrollEvent);
    };

    this.clear = function () {
        _data.upscrollInstances.forEach(function (upscrollInstance) {
            hide(upscrollInstance);
            slideIn(upscrollInstance);
        });

        _data.upscrollInstances = [];

        window.removeEventListener("scroll", upscrollEvent);
        window.removeEventListener("resize", upscrollEvent);
    };

    if (!selector)
        this.initialize();

    return this;
};

var upscroll = Upscroll();