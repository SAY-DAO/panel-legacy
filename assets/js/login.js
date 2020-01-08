

$(document).ready(function(){
    var jwt = document.createElement("script");
    jwt.type = "text/javascript";
    jwt.src = "assets/js/jwt-decode.min.js";
    document.body.appendChild(jwt);

    // login form validation
    $('#login_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            username: {
                required: true
            },
            password: {
                required: true,
            }
        },
        messages: {
            username: {
                required: "نام کاربری را وارد کنید."
            },
            password: {
                required: "پسورد را وارد کنید."
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent('div'));
        },
        submitHandler: function (form) { // for demo
            return false; // for demo
        }
    });

    $('#login').on('click' , function(e){
        e.preventDefault();
        
        if($('#login_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/panel/auth/login',
                method: 'POST',
                data: {
                    username: $('#username').val(),
                    password: $('#password').val(),
                },
                success: function(data)  {
                    var access_token = data.access_token;
                    var jsonPayload = jwt_decode(access_token);
                    var expDate = new Date(jsonPayload.exp * 1000); // Expiration date in token is in second, so it needs *1000 to be in milisecond
                    $.cookie('access_token', access_token, {expires: expDate}); // set access token in cookie for authorization
                    window.location.href = "dashboard.html";
                },
                error: function(data) {
                    var json = JSON.parse(data.responseText);
                    bootbox.alert({
                        title: "Error!",
                        message: json.message,
                    });
                }
            })
        }
        
    })
})

