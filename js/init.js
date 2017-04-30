$(function() {
    $(".mobile-button").click(function() {
        $(".nav-mobile").toggleClass("open");
        $(this).toggleClass("open");
    });
    $('.logo').tilt({
        perspective: 100,
        glare: true,
        maxGlare: .2
    })
    $(".card-image").click(function() {
        $(this).parent().find(".modal").addClass("active");
    });
    $(".modal .btn-clear").click(function() {
        $(this).closest(".modal").removeClass("active");
    });
});