
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

		main_content = strip_ps_from_lis( main_content );
		main_content = disentangle_blocky_links( main_content );

		return [
			{
				type: 'main_content',
				data:
				{
					name: 'Main content',
					title: '#page_heading#',
					lead: '',
					content: main_content
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

function disentangle_blocky_links( input )
{
	/*

	Turn this...

	<li>
		<a href="http">
			<h3>Lorem ipsum</h3>
			<p>Lorem ipsum</p>
		</a>
	</li>

	...into this

	<li>
		<a href="http">Lorem ipsum</a>
		<br>
		Lorem ipsum
	</li>

	*/
	
	var output = input;

	var list_items = input.match( /\<li\>\s*\<a(.*?)\<\/a\>\s*\<\/li\>/gms );

	list_items.forEach( li_input =>
	{
		if( li_input.indexOf( '</h3>' ) === -1 ) return;

		var li_output = li_input;

		var link_open = li_output.match( /\<a(.*?)\>/ )[ 0 ];

		li_output = li_output.replace( link_open , '' );
		li_output = li_output.replace( '</a>' , '' );

		li_output = li_output.replace( '<h3>' , link_open );
		li_output = li_output.replace( '</h3>' , '</a>' );

		li_output = li_output.replace( /\<p\>/gm , '<br>' );
		li_output = li_output.replace( /\<\/p\>/gm , '' );

		output = output.replace( li_input , li_output );
	});

	return output;
}

// --------------------------------------------------

function strip_ps_from_lis( input )
{
	var list_items = input.match( /\<li\>(.*?)\<\/li\>/gms );

	if( !list_items ) return input;

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
