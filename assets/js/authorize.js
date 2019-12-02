
var jwt = document.createElement("script");
jwt.type = "text/javascript";
jwt.src = "assets/js/jwt-decode.min.js";
document.body.appendChild(jwt);


//global variables to use in another js files

var global_user_id = '';
var global_username = '';
var global_user_role = '';
var global_user_ngo = '';


//  check loging status

function isAthorized() {
    if(!$.cookie('access_token')) {
        window.location.href = "user-login.html";
    } else {
        var jsonPayload = jwt_decode($.cookie('access_token'));
        var user_id = jsonPayload.identity;
        var username = jsonPayload.user_claims.username;
        var user_firstName = jsonPayload.user_claims.firstName;
        var user_lastName = jsonPayload.user_claims.lastName;
        var user_role = jsonPayload.user_claims.role;
        var user_ngoId = jsonPayload.user_claims.ngoId;
        var user_fullName = user_firstName + ' ' + user_lastName;
        $('.user_fullName').text(user_fullName);
        global_user_id = user_id;
        global_username = username;
        global_user_role = user_role;
        global_user_ngo = user_ngoId;
    }
}

function hasPrivilege() {
    if(global_user_role != 1) {
        // console.log("You don't have privilege.")
        // alert("You don't have appropriate privilege to access this page.");
        // window.location.href = "dashboard.html";
        // $('button').attr("disabled", true);
        $('#childTableNew').hide();
        $('.operation').hide();
        $('#needList').find('.confirmBtn').hide();
        // $('#needList').find('.deleteBtn').hide();
        $('.privilege1').hide();
    }
}


// logout , remove cookie

$(".logout").click(function(e) {
    e.preventDefault();
    $.removeCookie('access_token');
    location.reload();
})
