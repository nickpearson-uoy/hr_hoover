
// --------------------------------------------------

import t4_connection from './t4_connection.js';
import server_config from '../.t4_config.js';

const api_call = t4_connection( server_config );

// --------------------------------------------------

export default async function create_branch( page , parent_id , path = '' )
{
	const section_path = `${ path }/${ page.slug }`;

	console.log( `- ${ section_path } (${ page.type })` );

	return api_call(
	{
		method: `POST`,
		path: `/hierarchy/en`,
		body:
		{
			name: page.name,
			parent: parent_id,
		},
	})
	.then( response =>
	{
		// Throw an error if not a 200 response code
		if( response.status !== 200 )
		{
			throw( `⚠️ Error creating new section: got response code ${ response.status }` );
		}

		// Otherwise pass on the returned body
		return response.json();
	})
	.then( data => data.id ) // Pass on just the new section's id
	.then( section_id =>
	{
		// Apply the output URI

		if( page.slug )
		{
			return set_section_options( section_id , page.slug )
		}

		return section_id;
	})
	.then( section_id =>
	{
		// Create the contents

		if( page.contents )
		{
			return create_all_contents( section_id , page.contents , page );
		}
		else
		{
			return section_id;
		}

	})
	.then( section_id =>
	{
		// Create children

		if( page.children && page.children.length > 0 )
		{
			const child_maker = async ( children ) =>
			{
				for( const child of children )
				{
					await create_branch( child , section_id , `${ path }/${ page.slug }` );
				}
			}

			return child_maker( page.children );
		}

		return section_id;
	})
	.catch( error => { console.log( error ) } );
}

// --------------------------------------------------

function set_section_options( section_id , output_uri )
{
	return new Promise( ( resolve , reject ) =>
	{
		return api_call(
		{
			method: 'GET',
			path: `/hierarchy/${ section_id }/en`,
			body: null,
		})
		.then( response => response.json() )
		.then( section =>
		{
			section[ 'output-uri' ] = output_uri;
			section[ 'show' ] = true;

			return api_call(
			{
				method: 'PUT',
				path: `/hierarchy/${ section_id }/en`,
				body: section,
			})
			.then( () =>
			{
				resolve( section_id );
			});
		})
		.catch( error =>
		{
			console.log( `Error setting section options for ${ section_id }` );
			console.log( error );
			reject( section_id );
		});
	});
}

// --------------------------------------------------

async function create_all_contents( section_id , contents , page )
{
	const content_maker = async ( contents ) =>
	{
		for( const content of contents )
		{
			await create_content( section_id , content , page );
		}
	}

	await content_maker( contents );

	return section_id;
}

// --------------------------------------------------

function create_content( section_id , content , page )
{
	// --------------------

	const content_types =
	{
		main_content:
		{
			id: 190,
			fields:
			{
				name: 'Name#',
				title: 'Title#',
				lead: 'Lead#',
				content: 'Content#',
			}
		},
		additional_content:
		{
			id: 191,
			fields:
			{
				name: 'Name#',
				content: 'Text content#',
			}
		},
		news: // TODO: news 2.0 integration
		{
			id: 190,
			fields:
			{
				name: 'Name#',
				title: 'Title#',
				lead: 'Lead#',
				content: 'Content#',
			}
		},
	};

	// --------------------

	return new Promise( ( resolve , reject ) =>
	{
		const content_type = content_types[ content.type ];

		const elements = Object.keys( content_type.fields ).reduce( ( _elements , field_key ) =>
		{
			if( typeof content.data[ field_key ] !== 'undefined' )
			{
				_elements[ content_type.fields[ field_key ] ] = content.data[ field_key ];

				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( /\#page_name\#/g , page.name );
				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( /\#page_heading\#/g , ( page.heading.trim() ? page.heading : page.name ) );
				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( /\#source_url\#/g , page.source_url );
				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( /\#source_template\#/g , page.source_template );

				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( /class=\"highlighted-event\"/g , 'class="text-highlight"' );
				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( /\<h1 tabindex=\"\-1\"\>.*?\<\/h1\>/g , '' );
				_elements[ content_type.fields[ field_key ] ] = _elements[ content_type.fields[ field_key ] ].replace( '<p class="sort-order">A&#8202;to&#8202;Z</p>' , '' );

				return _elements;
			}
		} , {} );

		return api_call(
		{
			method: 'POST',
			path: `/content/${ section_id }/en`,
			body:
			{
				contentTypeID: content_types[ content.type ].id,
				language: 'en',
				channels: [ 1 ],
				elements: elements,
			},
		})
		.then( () =>
		{
			resolve( section_id );
		})
		.catch( error =>
		{
			console.log( `Error creating contents for ${ section_id }` );
			console.log( error );
			reject( section_id );
		});
	});

	// --------------------
}

// --------------------------------------------------
