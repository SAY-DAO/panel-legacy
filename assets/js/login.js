

$(document).ready(function(){

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
            alert('valid form submitted'); // for demo
            return false; // for demo
        }
    });

    $('#login').on('click' , function(e){
        e.preventDefault();
        
        if($('#login_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/panel/auth/login',
                method: 'POST',
                headers : {
                    'Access-Control-Allow-Origin'  : baseUrl
                },
                data: {
                    username: $('#username').val(),
                    password: $('#password').val(),
                },
                success: function(data)  {
                    var access_token = data.access_token;
                    $.cookie('access_token', access_token); // set access token in cookie for authorization
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

