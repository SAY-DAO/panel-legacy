$(document).ready(function(){
    isAthorized();
    
    var keys = ['privilege' , 'name']

    $.ajax({
        url: SAYApiUrl + '/privilege/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Athorization': $.cookie('access_token')    // check if authorize for this action
        },
        success: function(data) {
            // console.log(data);

            $.each(data , function(key , value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + '</option>';
                $('#social_worker_type').append(query);
                // console.log("privilege value: " + query);
            })

        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })
})
