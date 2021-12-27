$(function(){
   $('#parse_countries_states').click(function(){
$.ajax({
   'url':'/parser/states',
   'method':'post',
   'success':function(data){
      $('#empty_for_parse').html(data);
   },
   'error':function (msg){
      console.log(msg);
   }
});
   });
});
