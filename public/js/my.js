$(function () {
    $('path').click(function () {
        url = $(this).attr('class'); 
		var res = url.split(" ");
        document.location.href = '/' + res[1];
    })
});