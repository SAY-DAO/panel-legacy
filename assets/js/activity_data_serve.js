$(document).ready(function(){
    isAthorized();

    // var keys = ['socialworker_id' , 'activityCode']

    // $.ajax({
    //     url: '',
    //     method: 'GET',
    //     dataType: 'json',
    //     headers : {
    //         'Access-Control-Allow-Origin'  : baseUrl,
    //         'Athorization': $.cookie('access_token')    // check if authorize for this action
    //     },
    //     success: function(data) {
    //         console.log(data);
    //         $.each(data , function(key ,value){
    //             var query = '<tr>';
    //             for(var i = 0 ; i < keys.length ; i++){
    //                 query += '<td>' + value[keys[i]] + '</td>';
    //             }
    //             query+= '</tr>';
    //             $('#activityList').append(query);
    //         })
    //     },
    //     error: function(data) {
    //         console.log(data);
    //     }
    // })


})