
// --------------------------------------------------

var text = `<h2 class="list-header">Athena Swan staff data dashboards - for authorised staff</h2>
<ul>
<li><a href="/admin/hr/management-information/staff-management/flexileave-employee-updates"> FlexiLeave employee updates </a><br />Employee changes for departmental FlexiLeave administrators</li>
<li><a href="/admin/hr/management-information/staff-management/contact-phone-numbers"> Contact phone numbers </a>
<p>Access to contact phone numbers for line managers and departmental managers</p>
</li>
<li><a href="/admin/hr/management-information/staff-management/current-staffing-requests"> Current staffing requests </a>
<p>Check the status of staffing requests from your department</p>
</li>
<li><a href="/admin/hr/management-information/staff-management/fixed-term-contracts"> Fixed-term contracts </a>
<p>Reminder of fixed-term contracts approaching their end date <br /><em>Authorised users can subscribe to this report</em></p>
</li>
<li><a href="/admin/hr/management-information/staff-management/fixed-term-funding"> Fixed-term funding </a>
<p>Reminder of staff employed on fixed-term funding sources approaching their end date <br /><em>Authorised users can subscribe to this report</em></p>
</li>
<li><a href="https://tableau.york.ac.uk/#/site/HumanResources/views/Academicprobationdates/Academicprobationdates?:iid=1"> Probation review dates: academic staff </a>
<p>Prompt of probation review points for new academic staff <br /><em>We recommend departments subscribe to this report</em></p>
</li>
<li><a href="https://tableau.york.ac.uk/#/site/HumanResources/views/Probationreviewdates/Allprobationdates"> Probation review dates: all staff </a>
<p>Prompt of probation review dates for your new staff</p>
</li>
<li><a href="/admin/hr/management-information/staff-management/department-visas"> Upcoming visa expiries </a>
<p>Staff with expiring visas in your department</p>
</li>
</ul>
<p><strong>Original page:</strong> <a href="https://www.york.ac.uk/admin/hr/browse/management-information/staff-management">https://www.york.ac.uk/admin/hr/browse/management-information/staff-management</a>.</p>`;

// --------------------------------------------------

function strip_ps_from_lis( input )
{
	var list_items = input.match( /\<li\>(.*?)\<\/li\>/gms );

	var replacements = [];

	list_items.forEach( list_item =>
	{
		var paragraphs = list_item.match( /\<p\>(.*?)\<\/p\>/gms );

		if( !paragraphs ) return;

		paragraphs.forEach( paragraph =>
		{
			replacements.push(
			{
				search: paragraph,
				replace: paragraph.replace( /^\<p\>/m , '<br/>' ).replace( /\<\/p\>$/m , '' ),
			});
		});
	});

	var output = input;

	replacements.forEach( replacement =>
	{
		output = output.replace( replacement.search , replacement.replace );
	});

	return output;
}
	
console.log( strip_ps_from_lis( text ) );

// --------------------------------------------------
