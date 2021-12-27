$(function () {
    $('#country_id').click(function () {
        var id = $(this).val();
        $.ajax({
            'url': '/ajax/country',
            'method': 'post',
            'data': 'id=' + id,
            'success': function (data) {
                $('#city_id').show();
                $('#city_id').html(data);
            },
            'error': function (msg) {
                console.log(msg);
            }
        });
    });
});
