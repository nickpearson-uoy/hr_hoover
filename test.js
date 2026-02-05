
// --------------------------------------------------

import t4_connection from './lib/t4_connection.js';
import server_config from './.t4_config.js';

const api_call = t4_connection( server_config );

// --------------------------------------------------

api_call(
{
	method: 'GET',
	path: `/hierarchy/328971/en`,
	body: null,
})
.then( response =>
{
	// Throw an error if not a 200 response code
	if( response.status !== 200 )
	{
		throw( `⚠️ Error - got response code ${ response.status }` );
	}

	// Otherwise pass on the returned body
	return response.json();
})
.then( data =>
{
	console.log( data );
})

// --------------------------------------------------
