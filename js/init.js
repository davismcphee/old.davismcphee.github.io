(function ($) {
    $(function () {
        $('.button-collapse').sideNav({
            closeOnClick: true
        });
        $('.parallax').parallax();
        $('.carousel.carousel-slider').carousel({
            fullWidth: true
            , indicators: true
        });
        $("#slides").slidesjs({
            navigation: false
            , play: {
                interval: 5000
                , auto: true
                , pauseOnHover: true
                , restartDelay: 2500
                , effect: "fade"
            }
        });
        $('.collapsible').collapsible();

        function scrollToAnchor(id) {
            var aTag = $(id);
            $('html,body').animate({
                scrollTop: aTag.offset().top - 63
            }, 'slow');
        }
        $(".navbar-fixed a, .side-nav a").click(function (e) {
            e.preventDefault();
            if ($(this)[0] != $(".button-collapse")[0]) {
                $(this).closest("ul").find("a").removeClass("active");
                $(this).addClass("active");
                scrollToAnchor($(this).attr("href"));
            }
        });
        $(window).scroll(function () {
            var windscroll = $(window).scrollTop();
            if (windscroll >= 100) {
                var ting = $('.scroll-section');
                $('.scroll-section').each(function (i) {
                    if ($(this).position().top <= windscroll + 300) {
                        $('nav a.active, .side-nav a.active').removeClass('active');
                        $('nav a, .side-nav a').eq(i + 1).addClass('active');
                    }
                });
            }
            else {
                $('nav a.active, .side-nav a.active').removeClass('active');
                $('nav a:first, .side-nav a:first').addClass('active');
            }
        }).scroll();
        $("#audio-button").click(function () {
            $("#audio-button i").toggleClass("hidden");
            $("#index-banner video").prop("muted") ? $("#index-banner video").prop("muted", false) : $("#index-banner video").prop("muted", true);
        });
    }); // end of document ready
})(jQuery); // end of jQuery name space