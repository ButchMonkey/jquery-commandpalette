/**
 * Copyright 2015, Gwenael Pluchon
 * Licensed under the MIT license.
 * https://github.com/gwenaelp/jquery-commandpalette
 *
 * @author Gwenaël Pluchon
 * @desc A small plugin that shows up a customizable command palette, and provide a simple API to interact with it.
 */

 //TODO tests
 //TODO build
 //TODO make it cross-browser
(function($){
	/*
	 * Copyright 2012, Digital Fusion
	 * Licensed under the MIT license.
	 * http://teamdf.com/jquery-plugins/license/
	 *
	 * @author Sam Sehnert
	 * @desc A small plugin that checks whether elements are within
	 *		 the user visible viewport of a web browser.
	 *		 only accounts for vertical position, not horizontal.
	 */
	$.fn.visible = function(partial,hidden){
		
		var $t				= $(this).eq(0),
			t				= $t.get(0),
			$w				= $(window),
			viewTop			= $w.scrollTop(),
			viewBottom		= viewTop + $w.height(),
			_top			= $t.offset().top,
			_bottom			= _top + $t.height(),
			compareTop		= _top,
			compareBottom	= _bottom,
			clientSize		= true;
		
		return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
	};

	var table, searchFilter, elementsTemplate, allData;

	$.fn.commandPalette = function (methodOrOptions) {
		var filteredData, onItemSelected, onFilter;

		var methods = {
			/**
			 * @method init
			 * @constructor
			 */
			init : function(options) {
				elementsTemplate = options.elementsTemplate;
				onItemSelected = options.onItemSelected;
				onFilter = options.onFilter;
				
				allData = filteredData = options.items || [];

				if(elementsTemplate) {
					var compiledTemplate = tmpl(elementsTemplate);
					compileTemplateFunction = function (item) {
						item.tmpl = '<div id="item-'+ item.index +'">'+ compiledTemplate(item) +'</div>';
					}
				} else {
					compileTemplateFunction = function (item) {
						item.tmpl = '<div id="item-'+ item.index +'">$$string$$</div>';
					}
				}

				for(var i = 0, li = allData.length; i < li; i++) {
					allData[i].index = i;
					compileTemplateFunction(allData[i]);
				}

				this.append('<input type="text" id="searchFilter" placeholder="Search ..."><div class="table" id="results"></div>')

				table = this.find('#results');
				searchFilter = this.find('#searchFilter').focus();

				updateTableDOM();

				//TODO check if it's possible to associate an onclick event to the plugin's node
				document.onclick = function(event) {
					//FIXME caution, this condition could cause collision with other features, add parent check
					if(event.toElement.id.substring(0,5) === 'item-') {
						var selectedIndex = parseInt(event.toElement.id.substring(5), 10);
						onItemSelected(allData[selectedIndex]);
					}
				}

				searchFilter.keydown(function(event) {
					var keyCode = event.keyCode;

					if (keyCode == '38') {
						var selected = table.find('.selected');
						var prev = selected.prev();
						if(prev.length) {
							prev.addClass('selected');
							selected.removeClass('selected');
							if(!prev.prev().visible()) {
								prev.get(0).scrollIntoView();
							}
						}
					} else if(keyCode == '40') {
						var selected = table.find('.selected');
						var next = selected.next();
						if(next.length) {
							next.addClass('selected');
							selected.removeClass('selected');
							if(!next.visible()) {
								next.get(0).scrollIntoView(false);
							}
						}
					} else if(keyCode == '13') {
						var selectedIndex = parseInt(table.find('.selected')[0].id.substring(5), 10);
						onItemSelected(allData[selectedIndex]);
					} else {
						fuzzySearch();
					}
				});
			},

			/**
			 * @method update
			 * Updates the managed items collection, and refreshes the command palette
			 */
			update: function(items) {
				allData = filteredData = items || [];
				if(elementsTemplate) {
					//FIXME cache this var?
					var compiledTemplate = tmpl(elementsTemplate);
					compileTemplateFunction = function (item) {
						item.tmpl = '<div id="item-'+ item.index +'">'+ compiledTemplate(item) +'</div>';
					}
				} else {
					compileTemplateFunction = function (item) {
						item.tmpl = '<div id="item-'+ item.index +'">$$string$$</div>';
					}
				}

				for(var i = 0, li = allData.length; i < li; i++) {
					allData[i].index = i;
					compileTemplateFunction(allData[i]);
				}

				updateTableDOM();
			}
		};

		if(methods[methodOrOptions]) {
			return methods[methodOrOptions].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof methodOrOptions === 'object' || ! methodOrOptions) {
			// Default to "init"
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  methodOrOptions + ' does not exist on jQuery.commandPalette');
		}

		/**
		 * @function createResultElement
		 * @private
		 * Generates the jquery element associated to a result item
		 */
		function createResultElement(item) {
			var tmpl = item.tmpl || item.original.tmpl;
			return $(tmpl.replace('$$string$$', item.string));
		}

		/**
		 * @function updateTableDOM
		 * @private
		 * Reinserts correct results in the palette's proposals
		 */
		function updateTableDOM() {
			table.empty();
			var fragment = document.createDocumentFragment();

			if(filteredData.length) {
				var el = createResultElement(filteredData[0]).addClass('selected');
				fragment.appendChild(el.get(0));

				for(var i = 1, li = filteredData.length; i < li; i++) {
					var el = createResultElement(filteredData[i]);
					fragment.appendChild(el.get(0));
				}
			}
			table.get(0).appendChild(fragment);
		}

		/**
		 * @function fuzzySearch
		 * @private
		 * Filters results displayed
		 */
		function fuzzySearch() {
			//The timeout avoid getting old searchFilter value
			setTimeout(function() {
				var fuzzySearchOptions = {
					pre: '<b>',
					post: '</b>',
					extract: function(el) { return el.string; }
				};

				filteredData = fuzzy.filter(searchFilter[0].value, allData, fuzzySearchOptions);
				if(onFilter) {
					onFilter(searchFilter[0].value, filteredData, $('.selected').get(0));
				}
				updateTableDOM();	
			}, 1);
		}

		return this;
	}
}(jQuery));
