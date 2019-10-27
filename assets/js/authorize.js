
//  check loging status

function isAthorized(){
    if(!$.cookie('access_token')) {
        window.location.href = "user-login.html";
    }
}


// logout , remove cookie

$(".logout").click(function(e) {
    e.preventDefault();
    $.removeCookie('access_token');
    location.reload();
})