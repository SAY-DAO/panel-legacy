$(document).ready(function(){
    isAthorized();
    hasPrivilege();

    var keys = ['id' , 'name' , 'imageUrl' , 'childGeneratedCode' , 'cost' , 'details' , 'doing_duration' , 'affiliateLinkUrl' , 'ngoName' , 'ngoAddress' , 'receipts' , 'doneAt'];

    $.ajax({
        url: SAYApiUrl + '/need/all/confirm=2?done=1',
        method: 'GET',
        dataType: 'json',
        headers: {
            'Access-Control-Allow-Origin' : baseUrl,
            'Athorization': $.cookie('access_token')    // check if authorize for this action
        },
        success: function(data) {
            console.log(data);
            $.each(data, function(key, value){
                var query = '<tr>\
                <td>' + $('tr').length + '</td>';

                for (var i=1 ; i < keys.length ; i++) {
                    if(value[keys[i]] == null){
                        value[keys[i]] = nullValues();
                    }
                    
                    if (keys[i] == 'imageUrl') {
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    if (keys[i] == 'cost') {
                        value[keys[i]] = value[keys[i]] + ' Toman'
                    }

                    if(keys[i] == 'doing_duration') {
                        value[keys[i]] = value[keys[i]] + " days";
                    }

                    if(keys[i] == 'affiliateLinkUrl') {
                        if(value[keys[i]] != null) {
                            value[keys[i]] = linkTo(value[keys[i]]);
                        }
                    }

                    if(keys[i] == 'receipts') {
                        if(value[keys[i]] != null) {
                            value[keys[i]] = getFile(value[keys[i]]);
                        }
                    }

                    query += '<td>' + value[keys[i]] + '</td>';
                }
                query += '</tr>';
                $('#reportDoneNeedList').append(query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })
})