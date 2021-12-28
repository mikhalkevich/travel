$(function () {
    $.ajaxSetup({
        'method': 'post',
        'success': function (data) {
            $('#empty_for_parse').html(data);
        },
        'error': function (msg) {
            console.log(msg);
        }
    });
    $('#parse_countries_states').click(function () {
        $.ajax({
            'url': '/parser/states',
        });
    });
    $('#choose_contry').change(function(){
        var id = $(this).val();
        $.ajax({
            'url': '/parser/cities_form',
            'data': 'id='+id
        });
    });
});
