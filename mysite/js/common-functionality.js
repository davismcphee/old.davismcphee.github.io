var colours = ["default", "purple", "green", "pink"];
var navMainLinks = document.getElementsByClassName("nav-main")[0].getElementsByTagName("a");
var navMain = document.getElementsByClassName("nav-main")[0];
var navMobileMain = document.getElementsByClassName("nav-mobile-main")[0];
var navMobileMainWrapper = document.getElementsByClassName("nav-mobile-main-wrapper")[0];
var navMobileMainLinks = document.getElementsByClassName("nav-mobile-main")[0].getElementsByTagName("a");
var navMobileMainButton = document.getElementsByClassName("nav-mobile-main-button")[0];
var header = document.getElementsByTagName("header")[0];
var body = document.getElementsByTagName("body")[0];
var changeables = [];
changeables.push(header);
changeables.push(body);
var selectables = [];
selectables.push(navMainLinks);
selectables.push(navMobileMainLinks);
var colourSelector = new ColourSelector(colours, selectables, changeables);

function detectNav() {
    //if (document.documentElement.clientWidth <= 600)
        //colourSelector.newSelectables(navMobileMainLinks);
    //else {
        //colourSelector.newSelectables(navMainLinks);
        if (navMobileMainButton.classList.contains("closed"))
            navMobileMainButton.classList.remove("closed");
        if (navMobileMainButton.classList.contains("opened")) {
            navMobileMainButton.classList.remove("opened");
            if (!navMobileMainWrapper.classList.contains("closed"))
            navMobileMainWrapper.classList.add("closed");
        }        
    //}
}

detectNav();

window.addEventListener("resize", function(e) {
    detectNav();
});

navMobileMainButton.addEventListener("click", function(e) {
    if (this.classList.contains("opened")) {
        this.classList.remove("opened");
        this.classList.add("closed");
        if (!navMobileMainWrapper.classList.contains("closed"))
            navMobileMainWrapper.classList.add("closed");
    } else {
        this.classList.remove("closed");
        this.classList.add("opened");
        if (navMobileMainWrapper.classList.contains("closed"))
            navMobileMainWrapper.classList.remove("closed");
    }
});

