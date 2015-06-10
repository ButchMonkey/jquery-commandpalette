QUnit.test( "hello test", function( assert ) {
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
		onItemSelected: function(item) {
			alert('You selected:' + item.string);
		}
	});

	assert.ok( 1 == "1", "Passed!" );
});