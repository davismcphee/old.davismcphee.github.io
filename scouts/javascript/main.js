$(function () {
    var $window = $(window);
    
    //var $scrollAndChange = $(".scroll-and-change");
    var $scroller = $("[data-scroll]");
    $window.scroll(function () {
        $scroller.each(function () {
            var $self = $(this),
                scrollClass = $self.data("scroll-class");
            if ($(window).scrollTop() >= parseInt($self.data("scroll-distance")))
                $self.addClass(scrollClass);
            else
                $self.removeClass(scrollClass);
        });
    });
    
//    var $scroller = $("[data-scroll]");
//    window.onscroll = function () {
//        $scroller.each(function () {
//            var $self = $(this),
//                scrollClass = $self.data("scroll-class");
//            if (document.body.scrollTop >= parseInt($self.data("scroll-distance")))
//                $self.addClass(scrollClass);
//            else
//                $self.removeClass(scrollClass);
//        });
//    };
    
    var $toggler = $("#navbar-main"),
        $headerMain = $("#header-main");
    
    $toggler.on('shown.bs.collapse', function () {
        $headerMain.addClass("open");
    });

    $toggler.on('hide.bs.collapse', function () {
        $headerMain.removeClass("open");
    });
    
    var $scrollUpButton = $("#scroll-up-button");
    
    $scrollUpButton.on("click", function () {
        if ($scrollUpButton.hasClass("show")) {
            $("html, body").animate({
                scrollTop: 0 + scrollTopOffset
            }, scrollSpeed);
        }
        return false;
    });
    
    var scrollUpIsOpen = false,
        scrollUpIntialized = false,
        minWidthToHideScroll = 860,
        minScrollHeight = 400,
        scrollUpDisplayTime = 2000,
        scrollUpTimeout,
        scrollTopOffset = 250,
        scrollSpeed = 600;
        
    
    $window.on("scroll resize", function () {
        var windowWidth = $window.width(),
            scrollTop = $window.scrollTop();
        if (scrollTop >= minScrollHeight && windowWidth >= minWidthToHideScroll) {
            $scrollUpButton.addClass("show");
            if (!scrollUpIntialized)
                $scrollUpButton.addClass("slide-out");
            if (scrollUpIsOpen) {
                if (scrollUpIntialized)
                    $scrollUpButton.removeClass("slide-out");
            } else {
                clearTimeout(scrollUpTimeout);
                scrollUpTimeout = setTimeout(function () {
                    $scrollUpButton.removeClass("slide-out");
                    scrollUpIntialized = true;
                }, scrollUpDisplayTime);
            }
            scrollUpIsOpen = true;
        } else {
            if (windowWidth < minWidthToHideScroll) {
                $scrollUpButton.addClass("show");
                $scrollUpButton.addClass("slide-out");
            } else {
                $scrollUpButton.removeClass("show");
                $scrollUpButton.removeClass("slide-out");
            }
            scrollUpIsOpen = false;
            scrollUpIntialized = false
        }
    });
    
    var $indexSection = $("[data-section-index] [data-section-link]"),
        $sections = $('[data-sections]');
    
    $indexSection.on("click", function () {
        var sectionNumber = $indexSection.index($(this)) + 1,
            $section = $sections.find("#heading-" + sectionNumber),
            $sectionLink = $section.find("a");
        if ($sectionLink.attr("aria-expanded") === "false")
            $sectionLink.click();
        $("html, body").animate({
            scrollTop: $section.offset().top - 120
        }, 600);
        return false;
    });
});