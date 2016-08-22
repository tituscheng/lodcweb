	$(document).ready(function() {
		
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
			defaultDate: '2015-02-01', //yyyy - mm - dd
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: [
				{
					title: '[08:00] Family Baptism Class',
					start: '2015-02-06'
				},
				{
					title: '[10:00] Transforming Live',
					start: '2015-02-10'
				},			
				{
					title: '[09:00] Relationship With God',
					start: '2015-20-20'
				},
				{
					title: '[08:00] Abundant Life',
					start: '2015-02-26'
				},
				{
					title: '[08:00] God is Good',
					start: '2015-03-01'
				},
				{
					title: '[10:00] Jehovah Jireh',
					start: '2015-03-10'
				},
				
			]
		});
		
	});
