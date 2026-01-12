
// --------------------------------------------------

const template_page_types =
{
	'answer-template-2017'     : 'default',
	'topic-template-2017'      : 'default',
	'Browse listing page'      : 'listing',
	'Not Found'                : 'listing',
	'multiPage-template-2017'  : 'multipage',
};

// --------------------------------------------------

export default function make_hierarchical( flat_data , root_path_prefix )
{
	// Tidy up the page path
	flat_data.forEach( page =>
	{
		// Remove the prefix
		page[ 'New page path' ] = page[ 'New page path' ].slice( root_path_prefix.length );

		// Trim trailing slashes
		page[ 'New page path' ] = page[ 'New page path' ].replace( /\/$/ , '' );
	});

	let data = [];

	let data_state = null;
	let previous_data_state = null;

	do
	{
		previous_data_state = JSON.stringify( data );

		flat_data.forEach( ( page , page_index ) =>
		{
			if( page !== null ) insert_page( data , page , flat_data , page_index );
		});

		data_state = JSON.stringify( data );
	}
	while( data_state != previous_data_state )

	// Check for pages that weren't picked up
	for( const page of flat_data )
	{
		if( page ) console.log( `- ⚠️ "${ root_path_prefix }${ page[ 'New page path' ] }" Skipped: parent path not found` );
	}

	return data;
}

// --------------------------------------------------

function insert_page( hierarchy , page , source , index_in_source )
{
	const path_parts = page[ 'New page path' ].split( '/' );

	const output_uri = path_parts.pop();
	const parent_path_parts = path_parts;

	// Establish the page type

	let page_type = 'blank';

	if( typeof template_page_types[ page[ 'Page template' ] ] !== 'undefined' )
	{
		page_type = template_page_types[ page[ 'Page template' ] ];
	}

	// Make our new entry

	const new_page =
	{
		name: page[ 'Section name' ],
		source_url: page[ 'Current URL' ],
		source_template: page[ 'Page template' ],
		type: page_type,
		slug: output_uri,
		contents: [],
		children: [],
	};

	// Find this page's home in the hierarchy

	const home = find_home( hierarchy , parent_path_parts );

	if( home )
	{
		// Add the new page...
		home.push( new_page );

		// ...and remove from source
		source[ index_in_source ] = null;
	}
}

// --------------------------------------------------

function find_home( hierarchy , parent_path_parts )
{
	// No parent? Home is the hierarchy root

	if( parent_path_parts.length == 0 )
	{
		return hierarchy;
	}

	// Take the highest/first part of the parent path...
	const oldest_ancestor_slug = parent_path_parts.shift();

	// ...and check against each page of the hierarchy at this level
	for( const page of hierarchy )
	{
		if( oldest_ancestor_slug == page.slug )
		{
			// Recurse if found...
			return find_home( page.children , parent_path_parts );
		}
	}

	// ...otherwise signal that we couldn't find this page's home
	return false;
}

// --------------------------------------------------
