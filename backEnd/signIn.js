


function signIn(){
    const user = $("#username").val();
    const pass = $("#password").val();
    console.log(user, " ", pass);
    if (user == ""){
        alert("Please enter a valid username!");
        return false;
    };
    if (pass == ""){
        alert("Please enter a valid password!");
        return false;
    };
    $.post("http://localhost:3000/checkLogin", {'username': user, 'password': pass}, function(data){
        console.log(data);

        if (data[0]){
            console.log("User exists");
            window.location = "index.html";
        } else{
            console.log("User does not exist");
            alert("Username and password combination does not exist");
            $("#messageArea").html("Username and password combination does not exist");
        };
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

function register(){
    var user = $("#username").val();
    var pass = $("#password").val();
    var userJSON = {'username': user, 'password': pass};
    console.log(user, pass);
    $.post("http://localhost:3000/registerUser", userJSON, function(data){
        console.log(data);
    }) 
}

function showUsers(){
    $(document).ready(function(){
        $.get("http://localhost:3000" + '/getUsers', function(data){
            console.log(data);
        });
    });
}