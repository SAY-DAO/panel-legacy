

$(document).ready(function(){

    $('#login').on('click' , function(e){
        e.preventDefault();
        
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
                var json = JSON.parse(data);
                var access_token = json.access_token;
                $.cookie('access_token', access_token); // set access token in cookie for authorization
                window.location.href = "dashboard.html";
                // console.log(access_token);
            },
            error: function(data) {
                var json = JSON.parse(data.responseText);
                bootbox.alert({
                    title: "Error!",
                    message: json.message,
                });
            }
        })
    })
})

