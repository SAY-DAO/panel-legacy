$(document).ready(function(){

    $('#login').on('click' , function(e){
        e.preventDefault();
        
        $.ajax({
            url: 'http://api.sayapp.company/api/v2/panel/auth/login',
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : '*'
            },
            data: {
                username: $('#username').val(),
                password: $('#password').val(),
            },
            success: function(data)  {
                console.log(data);
                window.location.href = "dashboard.html";
            },
            error: function(data) {
                console.log(data);
                alert('wrong!');
            }
        })
    })
})