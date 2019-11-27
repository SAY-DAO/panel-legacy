$(document).ready(function(){
    isAthorized();
    hasPrivilege();

    var status_needId = -1;
    var keys = ['id' , 'type' , 'name' , 'status' , 'imageUrl' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'cost', 'donated' , 'details' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'ngoName' , 'ngoAddress' , 'receipts' , 'doneAt'];

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
                var needId = value[keys[0]];
                var need_type = value[keys[1]];
                var need_status = -1;
                var status_option = '';
                
                   // // Dropdown solution
                // var status_option = '<select name="need_status" class="btn btn-block btn-sm btn-dark need_status">\
                // <option value="2">Full payment</option>';
                // if(need_type == 0){
                //     status_option += '<option value="3">NGO receive money</option>\
                //                     <option value="4">Available for child</option>';
                // }else if(need_type == 1){
                //     status_option += '<option value="3">Purchased</option>\
                //                     <option value="4">NGO receive need</option>\
                //                     <option value="5">Delivered to child</option>';
                // }
                // status_option += '</select>';

                if (need_type == 0) {
                    status_option = '\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusS3 activeStatus">NGO receive money</button>\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusS4 deactiveStatus" disabled>Available for child</button>';
                } else if (need_type == 1) {
                    status_option = '<button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusP3 activeStatus">Purchased</button>\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusP4 deactiveStatus" disabled>Delivered to NGO</button>\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusP5 deactiveStatus" disabled>Delivered to child</button>';
                }

                var query = '<tr>\
                <td>' + $('tr').length + '</td>\
                <td id="' + needId + '">\
                ' + status_option + '\
                </td>';

                for (var i=2 ; i < keys.length ; i++) {
                    if (value[keys[i]] == null) {
                        value[keys[i]] = nullValues();
                    }
                    
                    if (keys[i] == 'status') {
                        if(value[keys[i]] == 0){
                            value[keys[i]] = 'Not paid';
                        }
                        if(value[keys[i]] == 1){
                            value[keys[i]] = needInProgress('Almost there');
                        }
                        if(value[keys[i]] == 2){
                            value[keys[i]] = fullPayment();
                        }

                        if(need_type == 0){
                            if(value[keys[i]] == 3) {
                                value[keys[i]] = ngoDelivery();
                                need_status = 03;
                            }
                            if(value[keys[i]] == 4) {
                                value[keys[i]] = childDelivery();
                                need_status = 04;
                            }
                        }

                        if(need_type == 1){
                            if(value[keys[i]] == 3) {
                                value[keys[i]] = purchased();
                                need_status = 13;
                            }
                            if(value[keys[i]] == 4) {
                                value[keys[i]] = ngoDelivery();
                                need_status = 14;
                            }
                            if(value[keys[i]] == 5) {
                                value[keys[i]] = childDelivery();
                                need_status = 15;
                            }
                        }
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

                if(need_status == 03){
                    $('#' + needId).find('.statusS3').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus');
                    $('#' + needId).find('.statusS4').prop("disabled", false).addClass('activeStatus').removeClass('deactiveStatus');
                }else if(need_status == 04){
                    $('#' + needId).find('.statusS3').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus');
                    $('#' + needId).find('.statusS4').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus deactiveStatus');
                }else if(need_status == 13){
                    $('#' + needId).find('.statusP3').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus');
                    $('#' + needId).find('.statusP4').prop("disabled", false).addClass('activeStatus').removeClass('deactiveStatus');

                }else if(need_status == 14){
                    $('#' + needId).find('.statusP3').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus');
                    $('#' + needId).find('.statusP4').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus deactiveStatus');
                    $('#' + needId).find('.statusP5').prop("disabled", false).addClass('activeStatus').removeClass('deactiveStatus');
                }else if(need_status == 15){
                    $('#' + needId).find('.statusP3').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus');
                    $('#' + needId).find('.statusP4').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus deactiveStatus');
                    $('#' + needId).find('.statusP5').prop("disabled", true).addClass('doneStatus').removeClass('activeStatus deactiveStatus');
                }

            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    // change service need status from 2 to 3
    $('#reportDoneNeedList').on('click' , '.statusS3' , function(e){
        e.preventDefault();
        changeStatus_needId = $(this).parent().attr('id');
        console.log(changeStatus_needId + ' S 2 to 3 clicked!');

        var form_data = new FormData();
        form_data.append('status', 3);
        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + changeStatus_needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            beforeSend: function(){
                return confirm('You are about to change the status of the need to "NGO received the money".\nAre you sure?');
            },
            success: function(data) {
                alert("Success\nNeed " + changeStatus_needId + " status changed successfully\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }

        })  
    })

    // change service need status from 3 to 4
    $('#reportDoneNeedList').on('click' , '.statusS4' , function(e){
        e.preventDefault();
        changeStatus_needId = $(this).parent().attr('id');
        console.log(changeStatus_needId + ' S 3 to 4 clicked!');

        var form_data = new FormData();
        form_data.append('status', 4);
        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + changeStatus_needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            beforeSend: function(){
                return confirm('You are about to change the status of the need to "Service is available for the child".\nAre you sure?');
            },
            success: function(data) {
                alert("Success\nNeed " + changeStatus_needId + " status changed successfully\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }

        })  
    })

    // change product need status from 2 to 3
    $('#reportDoneNeedList').on('click' , '.statusP3' , function(e){
        e.preventDefault();
        changeStatus_needId = $(this).parent().attr('id');
        console.log(changeStatus_needId + ' P 2 to 3 clicked!');

        var form_data = new FormData();
        form_data.append('status', 3);
        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + changeStatus_needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            beforeSend: function(){
                return confirm('You are about to change the status of the need to "Purchased".\nAre you sure?');
            },
            success: function(data) {
                alert("Success\nNeed " + changeStatus_needId + " status changed successfully\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }

        })  
    })

    // change product need status from 3 to 4
    $('#reportDoneNeedList').on('click' , '.statusP4' , function(e){
        e.preventDefault();
        changeStatus_needId = $(this).parent().attr('id');
        console.log(changeStatus_needId + ' P 3 to 4 clicked!');

        var form_data = new FormData();
        form_data.append('status', 4);
        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + changeStatus_needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            beforeSend: function(){
                return confirm('You are about to change the status of the need to "Product delivered to the NGO".\nAre you sure?');
            },
            success: function(data) {
                alert("Success\nNeed " + changeStatus_needId + " status changed successfully\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }

        })  
    })

    // change product need status from 4 to 5
    // ************NOTE: this must be remove after change status performed automatically!**************
    $('#reportDoneNeedList').on('click' , '.statusP5' , function(e){
        e.preventDefault();
        changeStatus_needId = $(this).parent().attr('id');
        console.log(changeStatus_needId + ' P 4 to 5 clicked!');

        var form_data = new FormData();
        form_data.append('status', 5);
        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + changeStatus_needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            beforeSend: function(){
                return confirm('You are about to change the status of the need to "Product delivered to the child".\nAre you sure?');
            },
            success: function(data) {
                alert("Success\nNeed " + changeStatus_needId + " status changed successfully\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }

        })  
    })

})
