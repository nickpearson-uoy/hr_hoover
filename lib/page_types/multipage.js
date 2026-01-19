
// --------------------------------------------------

export default
{
	// --------------------

	get_contents: function( body )
	{
		return [
			{
				type: 'main_content',
				data:
				{
					name: 'Main content',
					title: '#page_heading#',
					lead: '',
					content: extract_between( body , '<!-- InstanceBeginEditable name="MainContent" -->' , '<!-- InstanceEndEditable -->' )
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
