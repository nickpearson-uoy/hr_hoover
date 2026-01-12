/*

node index.js ${ input_path } ${ root_path_prefix } ${ root_section_id }

*/
// --------------------------------------------------

import Papa from 'papaparse';

import fs from 'node:fs';

// --------------------------------------------------

import make_hierarchical from './lib/make_hierarchical.js';
import get_page_contents from './lib/get_page_contents.js';
import create_branch from './lib/create_branch.js';

// --------------------------------------------------

console.log( `# HR/CMS mega-import tool` );

// --------------------------------------------------

console.log( `## Starting` );

const args = process.argv.slice( 2 );

const input_csv_path = args.shift();
console.log( `- Input file: ${ input_csv_path }` );

const root_path_prefix = args.shift();
console.log( `- Root path prefix: ${ root_path_prefix }` );

const root_section_id = args.shift();
console.log( `- Root section id: ${ root_section_id }` );

// --------------------------------------------------
// Convert input CSV into JSON

console.log( `## Reading input CSV` );

const csv_string = fs.readFileSync( input_csv_path , { encoding: 'utf8' } );

const unfiltered_data = Papa.parse( csv_string , { header:true } ).data;

console.log( `- ${ unfiltered_data.length } rows acquired` );

// --------------------------------------------------
// Filter out any rows we don't want

console.log( `## Filtering input data` );

const flat_data = unfiltered_data.filter( row =>
{
	if( !row[ 'New page path' ] ) return false;
	if( !row[ 'Current URL' ] ) return false;

	// Only keep pages in the path we're interested in
	if( row[ 'New page path' ].indexOf( root_path_prefix ) !== 0 ) return false;

	return true;
});

console.log( `- ${ flat_data.length } rows remaining` );

// --------------------------------------------------
// Convert flat input into hierarchical format

console.log( `## Converting to hierarchical format` );

const data = make_hierarchical( flat_data , root_path_prefix );

// --------------------------------------------------
// Fetch content from source pages

console.log( `## Fetching content from source pages` );

await fetch_stuff( data );

async function fetch_stuff( pages )
{
	for( const page of pages )
	{
		page.contents = await get_page_contents( page.source_url , page.type );

		if( page.children.length > 0 ) await fetch_stuff( page.children );
	};
}

// --------------------------------------------------
// Store a temp copy of the data

fs.writeFileSync( './log/data.json' , JSON.stringify( data , null , 4 ) , { encoding: 'utf8' } );

// --------------------------------------------------
// Feed into the branch creator

console.log( `## Creating pages in the CMS` );

for( const page of data )
{
	await create_branch( page , root_section_id );
}

// --------------------------------------------------

// console.log( data );
// console.log( JSON.stringify( data , null , 4 ) );

console.log( '## Done 😎👍' );

// --------------------------------------------------
