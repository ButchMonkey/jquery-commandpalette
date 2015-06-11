QUnit.test( "Basic palette with five elements should have a '.results' DOM node with 5 elements", function( assert ) {
	$('#commandpalette').commandPalette({
		items: [{
			string: 'firstItem'
		},{
			string: 'secondItem'
		},{
			string: 'thirdItem'
		},{
			string: 'fourthItem'
		},{
			string: 'fifthItem'
		}]
	});

	assert.strictEqual($('#commandpalette').find('.results').children().length, 5, "5 DOM nodes found." );
});


QUnit.test( "Basic palette with five elements should have a '.results' DOM node with 5 elements", function( assert ) {
	$('#commandpalette').commandPalette({
		items: [{
			string: 'firstItem'
		},{
			string: 'secondItem'
		},{
			string: 'thirdItem'
		},{
			string: 'fourthItem'
		},{
			string: 'fifthItem'
		}],
		elementsTemplate: 'item_tmpl'
	});

	var resultsDiv = $('#commandpalette').find('.results');


	assert.strictEqual(resultsDiv.children().find('.f-element').length, 3, "Template test 1" );
	assert.strictEqual(resultsDiv.children().find('.other-element').length, 2, "Template test 2" );
});


QUnit.test( "Keyboard navigation", function( assert ) {
	$('#commandpalette').commandPalette({
		items: [{
			string: 'firstItem'
		},{
			string: 'secondItem'
		},{
			string: 'thirdItem'
		},{
			string: 'fourthItem'
		},{
			string: 'fifthItem'
		}]
	});

	var resultsDiv = $('#commandpalette').find('.results');
	var searchFilterInput = $('#commandpalette').find('.searchFilter');

	window.arrowUpEvent = jQuery.Event("keydown");
	arrowUpEvent.keyCode = 38;

	window.arrowDownEvent = jQuery.Event("keydown");
	arrowDownEvent.keyCode = 40;


	assert.ok(resultsDiv.children().first().hasClass('selected'), "The first item is selected at initialization" );

	searchFilterInput.trigger(arrowUpEvent);
	assert.ok(resultsDiv.children().first().hasClass('selected'), "The first item is still selected after a keyUp event" );

	searchFilterInput.trigger(arrowDownEvent);	
	assert.notOk(resultsDiv.children().first().hasClass('selected'), "The first item is not selected anymore after a keyDown event" );
	assert.ok(resultsDiv.children().first().next().hasClass('selected'), "The second item is now selected after a keyUp event" );

	searchFilterInput.trigger(arrowDownEvent);	
	searchFilterInput.trigger(arrowDownEvent);	
	searchFilterInput.trigger(arrowDownEvent);
	assert.ok(resultsDiv.children().last().hasClass('selected'), "Last item is selected after 3 down keys" );

	searchFilterInput.trigger(arrowDownEvent);
	assert.ok(resultsDiv.children().last().hasClass('selected'), "Last item is still selected after another down key, because the last element is reached" );
});
