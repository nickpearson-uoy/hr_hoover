
// --------------------------------------------------

import page_type_blank from './page_types/blank.js';
import page_type_custom from './page_types/custom.js';
import page_type_default from './page_types/default.js';
import page_type_multipage from './page_types/multipage.js';
import page_type_listing from './page_types/listing.js';

// --------------------------------------------------

export default async function get_page_contents( page_url , page_type )
{
	// --------------------

	const page_types =
	{
		blank     : page_type_blank,
		custom     : page_type_custom,
		default   : page_type_default,
		multipage : page_type_multipage,
		listing   : page_type_listing,
	};

	// --------------------

	const headers = new Headers();
	headers.set( 'Authorization' , 'Basic ' + btoa( 'username' + ':' + '***' ) );

	// --------------------

	return fetch( page_url , { headers: headers } )
	.then( response =>
	{
		if( response.status !== 200 )
		{
			console.log( `- ⚠️ "${ page_url }" Failed: returned ${ response.status }` );
		}

		return response.text();
	})
	.then( response =>
	{
		return page_types[ page_type ].get_contents( response );
	})
	.catch( error =>
	{
		console.log( error );
	});

	// --------------------
}

// --------------------------------------------------
