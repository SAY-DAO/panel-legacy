
var jwt = document.createElement("script");
jwt.type = "text/javascript";
jwt.src = "assets/js/jwt-decode.min.js";
document.body.appendChild(jwt);


//global variables to use in another js files

var global_user_id = '';
var global_username = '';


//  check loging status

function isAthorized(){
    if(!$.cookie('access_token')) {
        window.location.href = "user-login.html";
    }else{
        var jsonPayload = jwt_decode($.cookie('access_token'));
        var user_id = jsonPayload.identity;
        var username = jsonPayload.user_claims.username;
        var user_firstName = jsonPayload.user_claims.firstName;
        var user_lastName = jsonPayload.user_claims.lastName;
        var user_fullName = user_firstName + ' ' + user_lastName;
        $('.user_fullName').text(user_fullName);
        global_user_id = user_id;
        global_username = username;
    }
}


// logout , remove cookie

$(".logout").click(function(e) {
    e.preventDefault();
    $.removeCookie('access_token');
    location.reload();
})
