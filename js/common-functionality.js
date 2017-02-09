var colours = ["default", "purple", "green", "pink"];
var navMainLinks = document.getElementsByClassName("nav-main")[0].getElementsByTagName("a");
var header = document.getElementsByTagName("header");
var colourSelector = new ColourSelector(colours, navMainLinks, header);
var navMain = document.getElementsByClassName("nav-main")[0];

console.log(document.documentElement.clientWidth);

function adjustNavBar() {
    if (document.documentElement.clientWidth < 370)
        screen
        navMain.classList.add("screen-small");
    else
        navMain.classList.remove("screen-small");
}

adjustNavBar();

window.addEventListener("resize", function(e) {
    adjustNavBar();
});