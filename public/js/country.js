$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: 'post',
        success: function (data) {
            $('.empty').html(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
    $('#link_news').click(function(){
         alpha3 = $(this).attr('data-alpha3');
         console.log(alpha3);
        $.ajax({
            url: '/ajax/news',
            data: 'alpha3='+alpha3,
        });
    });
    $('#link_links').click(function(){
        country_id = $(this).attr('data-country');
        console.log(country_id);
        $.ajax({
            url: '/ajax/links',
            data: 'country_id='+country_id,
            success: function (data) {
                $('.empty_links').html(data);
            },
        });
    });
});