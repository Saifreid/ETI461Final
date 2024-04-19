$(document).ready(function(){
    $.get('/getUsers', function(data){
        console.log(data);
    });
});