function ColourSelector(colours, selectables, changeables) {
    
    var self = this;
    this.colours = colours;
    this.selectables = selectables;
    this.changeables = changeables;
    this.activeClass = "active";
    this.coulorParameter = "colour";
    this.defaultColour = "";
    this.checkParameters = function() {
        //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        var urlParams;
        (window.onpopstate = function () {
            var match
                , pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g
                , decode = function (s) {
                    return decodeURIComponent(s.replace(pl, " "));
                }
                , query = window.location.search.substring(1);
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

        for (var i = 0; i < self.changeables.length; i++) 
            self.changeables[i].classList.add(self.defaultColour);

        for (var i = 0; i < self.selectables.length; i++) {
            for (var j = 0; j < self.selectables[i].length; j++) {
                if (self.selectables[i][j].href.includes("?")) 
                    self.selectables[i][j].href += "&";
                else 
                    self.selectables[i][j].href += "?";

                if (self.selectables[i][j].classList.contains(self.activeClass)) {
                    self.selectables[i][j].href += self.coulorParameter + "=" + self.defaultColour;
                    self.colours[j] = self.defaultColour;
                }
                else {
                    self.selectables[i][j].href += self.coulorParameter + "=" + self.colours[j];
                }   
            }
        }
    };
    this.detectNewSelectables = function() {
        for (var x = 0; x < this.selectables.length; x++) {
            for (var y = 0; y < this.selectables[x].length; y++) {
                this.selectables[x][y].currentElementNumber = y;
                this.selectables[x][y].addEventListener("mouseenter", function () {
                    for (var j = 0; j < self.changeables.length; j++) {
                        for (var k = 0; k < self.colours.length; k++) {
                            if (self.changeables[j].classList.contains(self.colours[k]))
                                self.changeables[j].classList.remove(self.colours[k]);
                            else if (self.changeables[j].classList.contains(self.defaultColour))
                                self.changeables[j].classList.remove(self.defaultColour);
                        }
                        self.changeables[j].classList.add(self.colours[this.currentElementNumber]);
                    }
                });
                this.selectables[x][y].addEventListener("mouseleave", function () {
                    for (var j = 0; j < self.changeables.length; j++) {
                        for (var k = 0; k < self.colours.length; k++) {
                            if (self.changeables[j].classList.contains(self.colours[k]))
                                self.changeables[j].classList.remove(self.colours[k]);
                        }
                        self.changeables[j].classList.add(self.defaultColour);
                    }
                });
            }
        }
    };
    this.newSelectables = function(selectables) {
        this.selectables = selectables;
        this.detectNewSelectables();
        this.checkParameters();
    };
    
    this.checkParameters();
    this.detectNewSelectables();
    
}