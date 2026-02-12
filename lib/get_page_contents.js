
// --------------------------------------------------

import page_type_blank from './page_types/blank.js';
import page_type_custom from './page_types/custom.js';
import page_type_default from './page_types/default.js';
import page_type_multipage from './page_types/multipage.js';
import page_type_listing from './page_types/listing.js';
import page_type_news from './page_types/news.js';

// --------------------------------------------------

export default async function get_page_contents( page_url , page_type )
{
	// --------------------

	const page_types =
	{
		blank     : page_type_blank,
		custom    : page_type_custom,
		default   : page_type_default,
		multipage : page_type_multipage,
		listing   : page_type_listing,
		news      : page_type_news,
	};

	// --------------------

	const headers = new Headers();
	headers.set( 'Authorization' , 'Basic ' + btoa( 'nwp506' + ':' + '***' ) );

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
		return {
			contents: page_types[ page_type ].get_contents( response ),
			meta: extract_meta( response ),
		};
	})
	.catch( error =>
	{
		console.log( error );
	});

	// --------------------
}

// --------------------------------------------------

function extract_meta( body )
{
	const meta = {};

	/* ---------- */

	const description_regex = /\<meta\s*name="description"\s*content=\"(.*?)\"/gm;
	const description_search = description_regex.exec( body );

	if( description_search && description_search[ 1 ].trim() !== "A description of the page and its content" )
	{
		meta.description = description_search[ 1 ].trim();
	}

	/* ---------- */

	return meta;
}


// --------------------------------------------------
