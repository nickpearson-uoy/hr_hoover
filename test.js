
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
.then( response => response.json() )
.then( section =>
{
	console.log( section );
});

