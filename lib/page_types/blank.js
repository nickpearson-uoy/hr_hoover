
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
					content: '<ul><li><strong>Unhandled page template:</strong> #source_template#</li><li><strong>Source:</strong> <a href="#source_url#">#source_url#</a></li><li><strong>Import page type:</strong> blank</li></ul>',
				},
			},
		];
	},

	// --------------------
};

// --------------------------------------------------
