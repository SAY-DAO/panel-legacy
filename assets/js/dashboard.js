// get users id and user name for payment
$(document).ready(function(){
    isAthorized();

    var user_keys = ['id' , 'userName']
    var payment_keys = ['id' , 'orderId' , 'desc' , 'id_user' , 'amount' , 'donate' , 'track_id' , 'createdAt']

    $.ajax({
        url: SAYApiUrl + '/user/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Athorization': $.cookie('access_token')    // check if authorize for this action
        },
        success: function(data) {
            console.log(data);

            $.each(data , function(key ,value){
                var userId = value[user_keys[0]];

                var query = '<tr id="' + userId + '">\
                <td>' + $('tr').length + '</td>';

                query += '<td>' + value[user_keys[1]] + '</td>';

                //get payments
                $.ajax({
                    url: SAYApiUrl + '/user/report/userId=' + userId,
                    method: 'GET',
                    dataType: 'json',
                    headers : {
                        'Access-Control-Allow-Origin'  : baseUrl,
                        'Athorization': $.cookie('access_token')    // check if authorize for this action
                    },
                    success: function(payment_data) {
                        console.log("payment result: " + userId);
                        $.each(payment_data , function(key ,value){
                        //     for(var i = 1 ; i < payment_keys.length ; i++){
                                query += '<td>' + value[payment_keys[1]] + '</td>';
                        //     }
                        })
                    },
                    error: function(payment_data) {
                        console.log(JSON.stringify(payment_data));
                    }
                })  // end of getting payments

                query+= '</tr>';
                $('#recentPaymantList').append(query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

})

// get all payment reports per user id

$(document).ready(function(){
    // isAthorized();

    // var keys = ['id' , 'orderId' , 'desc' , 'id_user' , 'amount' , 'donate' , 'track_id' , 'createdAt']
    // $.ajax({
    //     url: SAYApiUrl + '/user/report/userId=' ,
    //     method: 'GET',
    //     dataType: 'json',
    //     headers : {
    //         'Access-Control-Allow-Origin'  : baseUrl,
            // 'Athorization': $.cookie('access_token')    // check if authorize for this action
    //     },
    //     success: function(data) {

    //     },
    //     error: function(data) {

    //     }
    // })

})