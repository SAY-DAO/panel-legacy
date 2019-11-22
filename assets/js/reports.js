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
                if(need_type == 0){
                    status_option = '<button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusS3">NGO received money</button>\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusS4" disabled>Available for child</button>';
                }else if(need_type == 1){
                    status_option = '<button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusP3">Purchased</button>\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusP4" disabled>Delivered to NGO</button>\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm statusP5" disabled>Delivered to child</button>';
                }

                var query = '<tr>\
                <td>' + $('tr').length + '</td>\
                <td id="' + needId + '">\
                ' + status_option + '\
                </td>';
                


                for (var i=2 ; i < keys.length ; i++) {

                    if(value[keys[i]] == null){
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
                // console.log(needId);
                $('#reportDoneNeedList').append(query);

                if(need_status == 03){
                    $('#' + needId).find('.statusS3').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusS4').prop("disabled", false);
                }else if(need_status == 04){
                    $('#' + needId).find('.statusS3').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusS4').prop("disabled", true).addClass('doneStatus');
                }else if(need_status == 13){
                    $('#' + needId).find('.statusP3').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusP4').prop("disabled", false);

                }else if(need_status == 14){
                    $('#' + needId).find('.statusP3').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusP4').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusP5').prop("disabled", false);
                }else if(need_status == 15){
                    $('#' + needId).find('.statusP3').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusP4').prop("disabled", true).addClass('doneStatus');
                    $('#' + needId).find('.statusP5').prop("disabled", true).addClass('doneStatus');
                }

            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    // $('#reportDoneNeedList').on('click' , '.changeStatus' , function(e){
    //     e.preventDefault();
    //     console.log('change status clicked!');
    //     status_needId = $(this).parent().attr('id');

        // $('#' + status_needId).find('.need_status').removeClass("hidden");

    // })

})
