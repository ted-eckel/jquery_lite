(function(root) {
  root.$l = function(selector) {
    var args = Array.prototype.slice.call(arguments);
    var functionCall = [];
    var actions = [];
      for (var i = 0; i < args.length; i++) {
        if (typeof args[i] === "object" && args[i] instanceof HTMLElement) {
          var htmlarray = [args[i]];
          var htmldnc = new DOMNodeCollection(htmlarray);
          actions.push(htmldnc);
        }
        else if (typeof args[i] === "function") {
          functionCall.push(args[i]);
          while (functionCall.length > 0) {
            if (document.readyState === "complete") {
              functionCall.shift()();
            }
          }
        }
        else if (typeof args[i] === "string") {
          var reg = /<(\w+)/;
          console.log(reg.test(args[i]));
          if (reg.test(args[i])){
            var tag = args[i].match(/(\w+)/);
            var t = tag[0];
            var newHTML = document.createElement(t);
            console.log(newHTML, tag[0]);
            var tagContent = args[i].match(/>([\w\s]*)</);
            var newContent = document.createTextNode(tagContent);
            var newHTMLObject = newHTML.appendChild(newContent);
            console.log(newHTMLObject);
            root.$l(newHTMLObject);
          }
          else{
            var NodeList = document.querySelectorAll(selector);
            var NodeArray = Array.prototype.slice.call(NodeList);
            var NodeCollection = new DOMNodeCollection(NodeArray);
            actions.push(NodeCollection);
          }
        }
      }
    return actions;
  };

  function DOMNodeCollection(HTMLElements) {
    this.HTMLElements = HTMLElements;
  }

  DOMNodeCollection.prototype.html = function(string) {
    if (typeof string !== "undefined") {
      this.HTMLElements.forEach(function(n) {
        n.innerHTML = string;
      });
    } else {
      return this.HTMLElements[0].innerHTML;
    }
  };

  DOMNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DOMNodeCollection.prototype.append = function(string) {
    if (typeof string !== "undefined") {
      this.HTMLElements.forEach(function(n) {
        n.innerHTML += string;
      });
    } else {
      return this.HTMLElements[0].innerHTML;
    }
  };

  DOMNodeCollection.prototype.attr = function (attributeName, value) {
    if (arguments.length > 1){
      this.HTMLElements.forEach(function(n){
        n.setAttribute(attributeName, value);
      });
    } else {
      return this.HTMLElements[0].getAttribute(attributeName);
    }
  };

  DOMNodeCollection.prototype.addClass = function (value) {
    this.attr("class", value);
  };

  DOMNodeCollection.prototype.removeClass = function () {
    this.HTMLElements.forEach(function(n){
      n.removeAttribute("class");
    });
  };

  DOMNodeCollection.prototype.children = function () {
    var kids = [];
    this.HTMLElements.forEach(function(n) {
      var childrenArray = Array.prototype.slice.call(n.children);
      childrenArray.forEach(function(o) {
        kids.push(root.$l(o));
      });
    });
    return kids;
  };

  DOMNodeCollection.prototype.parent = function () {
    return this.HTMLElements[0].parentNode;
  };

  DOMNodeCollection.prototype.find = function (value) {
    var result = [];
    this.HTMLElements.forEach(function(n) {
      var findArray = Array.prototype.slice.call(n.querySelectorAll(value));
      findArray.forEach(function(o) {
        result.push(root.$l(o));
      });
    });
    return result;
  };

  DOMNodeCollection.prototype.remove = function(){
    this.HTMLElements.forEach(function(n){
      n.remove();
    });
    this.HTMLElements = [];
  };

  DOMNodeCollection.prototype.on = function(trigger, action){
    this.HTMLElements.forEach(function(n){
      n.addEventListener(trigger, action);
    });
  };

  DOMNodeCollection.prototype.off = function(trigger, action){
    this.HTMLElements.forEach(function(n){
      n.removeEventListener(trigger, action);
    });
  };


})(this);
