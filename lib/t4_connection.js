
export default ( t4_config ) =>
{
	return ( params ) =>
	{
		// --------------------------------------------------

		const headers =
		{
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Authorization": t4_config.auth_token,
		};

		// --------------------------------------------------

		const fetch_params =
		{
			headers: headers,
			method: params?.method || 'GET',
		};

		if( params?.body ) fetch_params.body = JSON.stringify( params.body );

		// --------------------------------------------------

		return fetch( `${ t4_config.url_base }${ params.path }` , fetch_params );

		// --------------------------------------------------
	};
}
