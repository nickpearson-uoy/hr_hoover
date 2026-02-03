
// --------------------------------------------------

export default
{
	// --------------------

	get_contents: function( body )
	{
		var start_markers =
		[
			'<div class="pane-inner a-to-z">',
			'<div class="pane-inner alphabetical">',
			'<div class="pane-inner curated-list">',
		];

		var main_content = '';
		var main_position = Infinity;

		start_markers.forEach( start_marker =>
		{
			var content = extract_between( body , start_marker , '</div>' );
			var position = body.indexOf( start_marker );

			if( content !== '' && position < main_position )
			{
				main_content = content;
				main_position = position;
			}
		});

		return [
			{
				type: 'main_content',
				data:
				{
					name: 'Main content',
					title: '#page_heading#',
					lead: '',
					content: strip_ps_from_lis( main_content )
					       + '<p><strong>Original page:</strong> <a href="#source_url#">#source_url#</a>.</p>',
				},
			},
		];
	},

	// --------------------
};

// --------------------------------------------------

function extract_between( input , start_marker , end_marker )
{
	const start_offset = input.indexOf( start_marker );
	if( start_offset === -1 ) return '';
	const start_position = start_offset + start_marker.length;

	const end_offset = input.substring( start_position ).indexOf( end_marker );
	if( end_offset === -1 ) return '';
	const end_position = start_position + end_offset;

	return input.substring( start_position , end_position ).trim();
}

// --------------------------------------------------

function strip_ps_from_lis( input )
{
	var list_items = input.match( /\<li\>(.*?)\<\/li\>/gms );

	var replacements = [];

	list_items.forEach( list_item =>
	{
		var paragraphs = list_item.match( /\<p\>(.*?)\<\/p\>/gms );

		if( !paragraphs ) return;

		paragraphs.forEach( paragraph =>
		{
			replacements.push(
			{
				search: paragraph,
				replace: paragraph.replace( /^\<p\>/m , '<br/>' ).replace( /\<\/p\>$/m , '' ),
			});
		});
	});

	var output = input;

	replacements.forEach( replacement =>
	{
		output = output.replace( replacement.search , replacement.replace );
	});

	return output;
}

// --------------------------------------------------
