$(function () {

    $(".nav-main-mobile ul").animate({left: -250});
    
    $(".nav-main-mobile-button-container").click(function() {
        $(".nav-main-mobile").addClass("open", "swing");
        $(".nav-main-mobile ul").animate({left: 0});
    });
    
    $(".nav-main-mobile .background").click(function() {
        $(".nav-main-mobile ul").animate({left: -250}, "swing", function() {
            $(".nav-main-mobile").removeClass("open");
        });
    });
    
});