$(document).ready(function(){
    isAthorized();
    hasPrivilege();

    var keys = ['id' , 'name' , 'imageUrl' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'cost', 'donated' , 'details' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'ngoName' , 'ngoAddress' , 'receipts' , 'doneAt'];

    $.ajax({
        url: SAYApiUrl + '/need/all/confirm=2?done=1',
        method: 'GET',
        dataType: 'json',
        headers: {
            'Access-Control-Allow-Origin' : baseUrl,
            'Athorization': $.cookie('access_token'),    // check if authorize for this action
            'Cache-Control': 'no-cache'
        },
        success: function(data) {
            console.log(data);
            needData = data['needs'];
            $.each(needData, function(key, value){
                var query = '<tr>\
                <td>' + $('tr').length + '</td>';

                for (var i=1 ; i < keys.length ; i++) {
                    if(value[keys[i]] == null){
                        value[keys[i]] = nullValues();
                    }
                    
                    if (keys[i] == 'imageUrl') {
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    if (keys[i] == 'cost' || keys[i] == 'donated') {
                        value[keys[i]] = value[keys[i]] + ' Toman'
                    }

                    if(keys[i] == 'doing_duration') {
                        value[keys[i]] = value[keys[i]] + " days";
                    }

                    if(keys[i] == 'affiliateLinkUrl' || keys[i] == 'link') {
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
