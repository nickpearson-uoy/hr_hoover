
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
					title: '#page_name#',
					lead: '',
					content: '<p class="text-highlight"><strong>Custom page:</strong> This page is intended to be re-designed with a custom layout.</p>'
					       + '<p><strong>Original page:</strong> <a href="#source_url#">#source_url#</a>.</p>',
				},
			},
		];
	},

	// --------------------
};

// --------------------------------------------------
