


function signIn(){
    $(document).ready(function(){
        $.get("http://localhost:3000" + '/getUsers', function(data){
            console.log(data);
        });
    });
}

function signUp(){
    var user = $("#username").val();
    var pass = $("#password").val();
    var userJSON = {'username': user, 'password': pass};
    console.log(user, pass);
    $.post("http://localhost:3000/addUser", userJSON, function(data){
        console.log(data);
    }) 
}