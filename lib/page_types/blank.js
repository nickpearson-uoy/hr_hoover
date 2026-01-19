
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
					content: '<p class="text-highlight"><strong>Unhandled page:</strong> This page cannot not be processed by the automatic import - its contents will need to be re-created manually.</p>'
					       + '<p><strong>Original page:</strong> <a href="#source_url#">#source_url#</a>.</p>',
				},
			},
		];
	},

	// --------------------
};

// --------------------------------------------------
