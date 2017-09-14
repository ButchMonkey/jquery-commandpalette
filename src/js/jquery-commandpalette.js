(function($) {
  /**
   * @param {?} element
   * @param {?} hidden_corners
   * @return {?}
   */
  $.fn.visible = function(element, hidden_corners) {
    var j = $(this).eq(0);
    var t = j.get(0);
    var $window = $(window);
    var viewTop = $window.scrollTop();
    var viewBottom = viewTop + $window.height();
    var elemTop = j.offset().top;
    var elemBottom = elemTop + j.height();
    var compareTop = elemTop;
    var compareBottom = elemBottom;
    /** @type {boolean} */
    var clientSize = true;
    return!!clientSize && (compareBottom <= viewBottom && compareTop >= viewTop);
  };
  
  var app;
  var $input;
  var element;
  var values;
  
  var selectedClass = "cPalette_selected";
  var itemClass = "cPalette_item-";
  
  /**
   * @param {string} method
   * @return {?}
   */
  $.fn.commandPalette = function(method) {
    /**
     * @param {string} data
     * @return {?}
     */
    function fn(data) {
      var param = data.tmpl || data.original.tmpl;
      var value = data.string || data.value || '';
      var subValue = data.subValue;
      
      if (typeof subValue === "undefined")
      {
         subValue = (!!data.original && !!data.original.subValue) ? data.original.subValue : ''; 
      }
      
      param = param.replace("$$value$$", value)
              .replace("$$subValue$$", subValue);
      return $(param);
    }
    /**
     * @return {undefined}
     */
    function render() {
      app.empty();
      /** @type {DocumentFragment} */
      var sNode = document.createDocumentFragment();
      if (context.length) {
        var field = fn(context[0]).addClass(selectedClass);
        sNode.appendChild(field.get(0));
        /** @type {number} */
        var i = 1;
        var j = context.length;
        for (;i < j;i++) {
          field = fn(context[i]);
          sNode.appendChild(field.get(0));
        }
      }
      app.get(0).appendChild(sNode);
    }
    /**
     * @return {undefined}
     */
    function handler() {
      setTimeout(function() {
        var called = {
          pre : "<b>",
          post : "</b>",
          /**
           * @param {string} content
           * @return {?}
           */
          extract : function(content) {
            return content.value;
          }
        };
        context = fuzzy.filter($input[0].value, values, called);
        if (callback) {
          callback($input[0].value, context, $("." + selectedClass).get(0));
        }
        render();
      }, 1);
    }
    var context;
    var func;
    var callback;
    var methods = {
      /**
       * @param {?} args
       * @constructor
       */
      init : function(args) {
        this.empty();
        element = args.elementsTemplate;
        func = args.onItemSelected;
        callback = args.onFilter;
        values = context = args.items || [];
        if (element) {
          var compiled = tmpl(element);
          /**
           * @param {Object} data
           * @return {undefined}
           */
          compileTemplateFunction = function(data) {
            /** @type {string} */
            data.tmpl = '<div id="' + itemClass + data.index + '">' + compiled(data) + "</div>";
          };
        } else {
          /**
           * @param {Object} data
           * @return {undefined}
           */
          compileTemplateFunction = function(data) {
            /** @type {string} */
            data.tmpl = '<div id="' + itemClass + data.index + '">$$value$$<span class="cPalette_subvalue">$$subValue$$</span></div>';
          };
        }
        /** @type {number} */
        var i = 0;
        var valuesLen = values.length;
        for (;i < valuesLen;i++) {
          /** @type {number} */
          values[i].index = i;
          compileTemplateFunction(values[i]);
        }
        this.append('<input type="text" class="cPalette_searchFilter" placeholder="Search ..."><div class="cPalette_results"></div>');
        app = this.find(".cPalette_results");
        $input = this.find(".cPalette_searchFilter").focus();
        render();
        /**
         * @param {Event} evt
         * @return {undefined}
         */
        document.onclick = function(evt) {
          if (evt.toElement.id.substring(0, itemClass.length) === itemClass) {
            /** @type {number} */
            var j = parseInt(evt.toElement.id.substring(itemClass.length), 10);
            func(values[j]);
          }
        };
//        
//        document.mouseenter = function(evt) {
//          if (evt.toElement.id.substring(0, itemClass.length) === itemClass) {
//             evt.addClass(selectedClass);
//          }
//        };
//        
//        document.mouseleave = function(evt) {
//          if (evt.toElement.id.substring(0, itemClass.length) === itemClass) {
//             evt.removeClass(selectedClass);
//          }
//        };
        
        
        $input.keydown(function(event) {
          var code = event.keyCode;
          if (code == "38") {
            var header = app.find("." + selectedClass);
            var _self = header.prev();
            if (_self.length) {
              _self.addClass(selectedClass);
              header.removeClass(selectedClass);
              if (!_self.prev().visible()) {
                _self.get(0).scrollIntoView();
              }
            }
          } else {
            if (code == "40") {
              header = app.find("." + selectedClass);
              var c = header.next();
              if (c.length) {
                c.addClass(selectedClass);
                header.removeClass(selectedClass);
                if (!c.visible()) {
                  c.get(0).scrollIntoView(false);
                }
              }
            } else {
              if (code == "13") {
                /** @type {number} */
                var j = parseInt(app.find("." + selectedClass)[0].id.substring(itemClass.length), 10);
                func(values[j]);
              } else {
                handler();
              }
            }
          }
        });
      },
      /**
       * @param {Array} allBindingsAccessor
       * @return {undefined}
       */
      update : function(allBindingsAccessor) {
        values = context = allBindingsAccessor || [];
        if (element) {
          var compiled = tmpl(element);
          /**
           * @param {Object} data
           * @return {undefined}
           */
          compileTemplateFunction = function(data) {
            /** @type {string} */
            console.log(data)
            data.tmpl = '<div id="'+ itemClass + data.index + '">' + compiled(data) + "</div>";
          };
        } else {
          /**
           * @param {Object} data
           * @return {undefined}
           */
          compileTemplateFunction = function(data) {
            /** @type {string} */
            data.tmpl = '<div id="'+ itemClass + data.index + '">$$value$$<span class="cPalette_subvalue">$$subValue$$</span></div>';
          };
        }
        /** @type {number} */
        var i = 0;
        var valuesLen = values.length;
        for (;i < valuesLen;i++) {
          /** @type {number} */
          values[i].index = i;
          compileTemplateFunction(values[i]);
        }
        render();
      }
    };
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
      if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error("Method " + method + " does not exist on jQuery.commandPalette");
      }
    }
    return this;
  };
})(jQuery);


(function(){var root=this;var fuzzy={};if(typeof exports!=="undefined"){module.exports=fuzzy}else{root.fuzzy=fuzzy}fuzzy.simpleFilter=function(pattern,array){return array.filter(function(string){return fuzzy.test(pattern,string)})};fuzzy.test=function(pattern,string){return fuzzy.match(pattern,string)!==null};fuzzy.match=function(pattern,string,opts){opts=opts||{};var patternIdx=0,result=[],len=string.length,totalScore=0,currScore=0,pre=opts.pre||"",post=opts.post||"",compareString=opts.caseSensitive&&string||string.toLowerCase(),ch,compareChar;pattern=opts.caseSensitive&&pattern||pattern.toLowerCase();for(var idx=0;idx<len;idx++){ch=string[idx];if(compareString[idx]===pattern[patternIdx]){ch=pre+ch+post;patternIdx+=1;currScore+=1+currScore}else{currScore=0}totalScore+=currScore;result[result.length]=ch}if(patternIdx===pattern.length){return{rendered:result.join(""),score:totalScore}}return null};fuzzy.filter=function(pattern,arr,opts){opts=opts||{};return arr.reduce(function(prev,element,idx,arr){var str=element;if(opts.extract){str=opts.extract(element)}var rendered=fuzzy.match(pattern,str,opts);if(rendered!=null){prev[prev.length]={string:rendered.rendered,score:rendered.score,index:idx,original:element}}return prev},[]).sort(function(a,b){var compare=b.score-a.score;if(compare)return compare;return a.index-b.index})}})();
