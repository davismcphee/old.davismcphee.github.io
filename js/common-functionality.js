var colours = ["default", "purple", "green", "pink"];
var navMainLinks = document.getElementsByClassName("nav-main")[0].getElementsByTagName("a");
var header = document.getElementsByTagName("header");
var colourSelector = new ColourSelector(colours, navMainLinks, header);
var navMain = document.getElementsByClassName("nav-main")[0];

window.addEventListener("resize", function(e) {
    if (document.documentElement.clientWidth < 360)
        navMain.classList.add("screen-small");
    else
        navMain.classList.remove("screen-small");
});