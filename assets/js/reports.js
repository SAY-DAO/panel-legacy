$(document).ready(function(){
    isAthorized();
    hasPrivilege();

    var status_needId = -1;
    var type_id = -1;
    var keys = ['id' , 'type' , 'name' , 'status' , 'imageUrl' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'cost', 'donated' , 'details' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'ngoName' , 'ngoAddress' , 'receipts' , 'doneAt'];
    
    // for the report to ngo ajax
    var reportNGO_keys = ['id' , 'ngoName' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'name' , 'imageUrl' , 'cost'];

    // get Done needs
    $.ajax({
        url: SAYApiUrl + '/need/all/confirm=2?done=1',
        method: 'GET',
        dataType: 'json',
        headers: {
            'Access-Control-Allow-Origin' : baseUrl,
            'Athorization': $.cookie('access_token'),    // check if authorize for this action
            'Cache-Control': 'no-cache'
        },
        beforeSend: function() {
            $('.preloader').show();
        },
        success: function(data) {
            console.log(data);
            needData = data['needs'];
            $.each(needData, function(key, value){
                var needId = value[keys[0]];
                var need_type = value[keys[1]];
                var need_status = -1;

                // need status show design -> must be review
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
                <td>' + $('#reportDoneNeedList').find('tr').length + '</td>\
                <td id="' + needId + '">\
                <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm changeStatus" onclick="editScroll()">Change status</button>\
                </td>\
                ';

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

                    if(keys[i] == 'doneAt') {
                        value[keys[i]] = localDate(value[keys[i]]);
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
            $('.preloader').hide();

        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    // change needs status
    $('#reportDoneNeedList').on('click' , '.changeStatus' , function(e) {
        e.preventDefault();

        status_needId = $(this).parent().attr('id');
        console.log(status_needId);

        $.ajax({
            url: SAYApiUrl + '/need/needId=' + status_needId,
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'
            },
            beforeSend: function() {
                $('.preloader').show();
            },
            success: function(data) {
                $('#delivery').hide();
                
                $('#need_name').val(data['name']);
                $('#delivery_date').val(data['delivery_date']);

                type_id = data['type'];     // to use in confirm change status
                if (type_id == 0) {
                    $('#product_status').hide();
                    $('#service_status').show();
                    $('#need_status_service').val(data['status']).change();  // need status feild in get need by id

                } else if (type_id == 1) {
                    $('#service_status').hide();
                    $('#product_status').show();
                    $('#need_status_product').val(data['status']).change();  // need status feild in get need by id

                }

                $('#need_status_product').change(function() {
                    if ($(this).val() == 3) {
                        $('#delivery').show();
                    } else {
                        $('#delivery').hide();
                    }
                })
                $('.preloader').hide();
                
            },
            error: function() {
                console.log(data.responseJSON.message);
            }
        })
    })

    // confirm change the need status
    $('#editNeedStatus').on('click' , function(e) {
        e.preventDefault();
        console.log("change status for need " + status_needId);
        var status = -1;

        var need_name = $('#need_name').val();
        if (type_id == 0) {
            status = $('#need_status_service').val();
        } else if (type_id == 1) {
            status = $('#need_status_product').val();
        }
        var delivery_date = $('#delivery_date').val();

        // append datas to a Form Data
        var form_data = new FormData();
        form_data.append('status', status);
        form_data.append('delivery_date', delivery_date);

        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + status_needId,
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
                return confirm('You are about to change status of the need {' + status_needId + ': ' + need_name + '}.\nAre you sure?');
            },
            success: function(data) {
                alert("Success\nNeed {" + status_needId + ': ' + need_name + "}'s status changed successfully\n" + JSON.stringify(data.message));
                location.reload(true);
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }
        })
    })

    

    // status 3 needs to report to NGO
    $('#need_ngo').change(function() {
        var selected_ngo = $(this).val();
        console.log(selected_ngo);
        $.ajax({
            url: SAYApiUrl + '/need/all/confirm=2?status=3&isReported=false&ngoId=' + selected_ngo,
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
                    // console.log(type($('#reportNGONeedList').find('tr').length));
                    var query = '<tr>\
                                <td>' + $('#reportNGONeedList').find('tr').length + '</td>';

                    for (var i=2 ; i < reportNGO_keys.length ; i++) {
                        
                        if (reportNGO_keys[i] == 'imageUrl') {
                            value[reportNGO_keys[i]] = getImgFile(value[reportNGO_keys[i]]);
                        }

                        if (reportNGO_keys[i] == 'cost') {
                            value[reportNGO_keys[i]] = value[reportNGO_keys[i]] + ' Toman'
                        }

                        query += '<td>' + value[reportNGO_keys[i]] + '</td>';
                    }

                    query += '</tr>';
                    $('#reportNGONeedList').append(query);
                })
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
        $('#reportNGONeedList').empty();

    })

})
