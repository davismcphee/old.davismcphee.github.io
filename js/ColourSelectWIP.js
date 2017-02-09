function ColourSelector(colours, elementsToSelect, elementsToChange) {
    
    var self = this;
    this.colours = colours;
    this.elementsToSelect = elementsToSelect;
    this.elementsToChange = elementsToChange;
    this.activeClass = "active";
    this.coulorParameter = "colour";
    this.defaultColour = "";
    
    function checkParameters() {
        //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        var urlParams;
        (window.onpopstate = function () {
            var match
                , pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g
                , decode = function (s) {
                    return decodeURIComponent(s.replace(pl, " "));
                }
                , query = window.location.href.includes("?") ? window.location.href.substring(window.location.href.indexOf("?") + 1) : "";
            urlParams = {};
            while (match = search.exec(query)) urlParams[decode(match[1])] = decode(match[2]);
        })();
        
        function replaceUrlParam(url, paramName, paramValue){
            if(paramValue == null)
                paramValue = '';
            var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)')
            if(url.search(pattern)>=0){
                return url.replace(pattern,'$1' + paramValue + '$2');
            }
            return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
        }

        self.defaultColour = self.colours[Math.floor((Math.random() * 4))];

        if (self.coulorParameter in urlParams) 
            self.defaultColour = urlParams[self.coulorParameter];

        self.colours.splice(colours.indexOf(self.defaultColour), 1);

        for (var i = 0; i < self.elementsToChange.length; i++) 
            self.elementsToChange[i].classList.add(self.defaultColour);
        
        var replaced = false;

        for (var i = 0; i < self.elementsToSelect.length; i++) {
            
            if (self.coulorParameter in urlParams) {
                replaced = true;
            }
            else {
                if (self.elementsToSelect[i].href.includes("?")) 
                    self.elementsToSelect[i].href += "&";
                else 
                    self.elementsToSelect[i].href += "?";
            }

            if (self.elementsToSelect[i].classList.contains(self.activeClass)) {
                if (replaced)
                    replaceUrlParam(self.elementsToSelect[i].href, self.colourParameter, self.defaultColour);
                else
                    self.elementsToSelect[i].href += self.coulorParameter + "=" + self.defaultColour;
                self.colours[i] = self.defaultColour;
            }
            else {
                if (replaced)
                    replaceUrlParam(self.elementsToSelect[i].href, self.colourParameter, self.colours[i]);
                else
                    self.elementsToSelect[i].href += self.coulorParameter + "=" + self.colours[i];
            }

        }
    }
    
    checkParameters();
    
    for (var i = 0; i < this.elementsToSelect.length; i++) {
        
        this.elementsToSelect[i].currentElementNumber = i;
        
        this.elementsToSelect[i].addEventListener("mouseenter", function () {
            for (var j = 0; j < self.elementsToChange.length; j++) {
                for (var k = 0; k < self.colours.length; k++) {
                    if (self.elementsToChange[j].classList.contains(self.colours[k])) self.elementsToChange[j].classList.remove(self.colours[k]);
                    else if (self.elementsToChange[j].classList.contains(self.defaultColour)) self.elementsToChange[j].classList.remove(self.defaultColour);
                }
                self.elementsToChange[j].classList.add(self.colours[this.currentElementNumber]);
            }
        });
        
        this.elementsToSelect[i].addEventListener("mouseleave", function () {
            for (var j = 0; j < self.elementsToChange.length; j++) {
                for (var k = 0; k < self.colours.length; k++) {
                    if (self.elementsToChange[j].classList.contains(self.colours[k])) self.elementsToChange[j].classList.remove(self.colours[k]);
                }
                self.elementsToChange[j].classList.add(self.defaultColour);
            }
        });
        
        this.elementsToSelect[i].addEventListener("click", function (e) {
            e.preventDefault();
            window.location = this.href;
            checkParameters();
        });
        
    }
    
}