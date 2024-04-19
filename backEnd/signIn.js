


function signIn(){
    $(document).ready(function(){
        $.get("http://localhost:3000"+ '/getUsers', function(data){
            console.log(data);
        });
    });
}