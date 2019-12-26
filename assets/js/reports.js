$(document).ready(function(){
    isAuthorized();
    hasPrivilege();

    // change need form validation
    $('#change_need_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            need_status_product: {
                required: true,
            },
            need_status_service: {
                required: true,
            },
            "product_receipts[]": {
                filesize: 3    // MB
            },
            "service_receipts[]": {
                filesize: 3    // MB
            }
        },
        messages: {
            need_status_product: {
                required: "انتخاب وضعیت جدید نیاز ضروری است.",
            },
            need_status_service: {
                required: "انتخاب وضعیت جدید نیاز ضروری است.",
            },
            "product_receipts[]": {
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            "service_receipts[]": {
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent('div'));
        },
        submitHandler: function (form) { // for demo
            alert('valid form submitted'); // for demo
            return false; // for demo
        },
        invalidHandler: function(event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (errors) {
                var message = errors + ' فیلد نادرست وجود دارد، لطفا بازبینی نمایید.';
                $("div.alert").html(message);
                $("div.alert").show();
            } else {
                $("div.alert").hide();
            }
        }
    });

    var status_needId = -1;
    var type_id = -1;
    var keys = ['id' , 'type' , 'name' , 'status' , 'delivery_date' , 'imageUrl' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'cost', 'donated' , 'details' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'ngoName' , 'ngoAddress' , 'receipts' , 'doneAt'];
    
    // for the report to ngo ajax
    var reportNGO_keys = ['id' , 'ngoName' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'name' , 'imageUrl' , 'cost' , 'delivery_date'];

    // get Done needs
    $.ajax({
        url: SAYApiUrl + '/need/all/confirm=2?done=1',
        method: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $('#done_need_preloader').show();
        },
        success: function(data) {
            console.log(data);
            needData = data['needs'];
            var row_index = 1;

            $.each(needData, function(key, value){
                var needId = value[keys[0]];
                var need_type = value[keys[1]];
                var need_status = -1;
                
                var query = '<tr>\
                <td>' + row_index + '</td>\
                <td id="' + needId + '">\
                <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm changeStatus" onclick="editScroll()">Change status</button>\
                </td>\
                ';

                for (var i=2 ; i < keys.length ; i++) {
                    
                    if (keys[i] == 'status') {
                        if(value[keys[i]] == 0){
                            value[keys[i]] = 'Not paid';
                        }
                        if(value[keys[i]] == 1){
                            value[keys[i]] = "Partially paid";
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
                        value[keys[i]] = cost(value[keys[i]]);
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
                        if(value[keys[i]]) {
                            value[keys[i]] = getFile(value[keys[i]]);
                        }
                    }

                    if (keys[i] == 'delivery_date') {
                        if (value[keys[i]] != null) {
                            value[keys[i]] = localDate(value[keys[i]]).split(', ')[0];
                        }
                    }                    

                    if(keys[i] == 'doneAt') {
                        value[keys[i]] = localDate(value[keys[i]]);
                    }

                    if (value[keys[i]] == null) {
                        value[keys[i]] = nullValues();
                    }
                    query += '<td>' + value[keys[i]] + '</td>';
                }

                query += '</tr>';
                $('#reportDoneNeedList').append(query);

                row_index += 1;
            })
            $('#done_need_preloader').hide();

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

            beforeSend: function() {
                $('#change_need_preloader').show();
            },
            success: function(data) {
                $('#delivery').hide();
                
                $('#need_name').val(data['name']);
                $('#delivery_date').val(localDate(data['delivery_date']).split(', ')[0]);

                type_id = data['type'];     // to use in confirm change status
                if (type_id == 0) { // if service
                    $('#product_status').hide();
                    $('#service_status').show();
                    $('#need_status_service').val(data['status']).change();  // need status feild in get need by id
                    $('#p_receipts').hide();
                    $('#s_receipts').show();
                } else if (type_id == 1) {  // if product
                    $('#service_status').hide();
                    $('#product_status').show();
                    $('#need_status_product').val(data['status']).change();  // need status feild in get need by id
                    $('#s_receipts').hide();
                    $('#p_receipts').show();
                }

                $('#need_status_product').change(function() {
                    if ($(this).val() == 3) {   // if product purchase
                        $('#delivery').show();
                    } else {
                        $('#delivery').hide();
                    }
                })
                $('#change_need_preloader').hide();
                
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
        var receipts = -1;
        var delivery = false;
        var need_name = $('#need_name').val();
        if (type_id == 0) { // if service
            $('#need_status_product').rules('remove', 'required');  // remove rule
            status = $('#need_status_service').val();
            receipts = $('#service_receipts')[0].files[0];
        } else if (type_id == 1) {  // if product
            $('#need_status_service').rules('remove', 'required');  // remove rule
            status = $('#need_status_product').val();
            receipts = $('#product_receipts')[0].files[0];
            if (status == 3) {
                delivery = true;
                $('#delivery_date').rules('add', {
                    required: true,
                    messages: {required: "انتخاب تاریخ تحویل ضروری است."}
                });    // add rule
            }else{
                $('#delivery_date').rules('remove', 'required');    // remove rule
            }
        }
        var delivery_date = $('#delivery_date').val();

        // append datas to a Form Data
        var form_data = new FormData();
        if (status) {
            form_data.append('status', status);
        }
        if (receipts) {
            form_data.append('receipts', receipts);
        }
        if(delivery == true) {
            form_data.append('delivery_date', delivery_date);
        }

        if($('#change_need_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/need/update/needId=' + status_needId,
                method: 'PATCH',
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
        }
    })


    // status 3 needs to report to NGO
    $('.report_filter').change(function() {
        var selected_ngo = $('#need_ngo').val();
        var selected_type_id = $('#need_type').val();
        console.log(selected_ngo);
        $.ajax({
            url: SAYApiUrl + '/need/all/confirm=2?status=3&isReported=0&ngoId=' + selected_ngo + '&type=' + selected_type_id,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#report_ngo_preloader').show();
            },
            success: function(data) {
                console.log(data);
                needData = data['needs'];
                var row_index = 1;

                $.each(needData, function(key, value){
                    var query = '<tr>\
                                <td>' + row_index + '</td>';

                    for (var i=2 ; i < reportNGO_keys.length ; i++) {
                        
                        if (reportNGO_keys[i] == 'imageUrl') {
                            value[reportNGO_keys[i]] = getImgFile(value[reportNGO_keys[i]]);
                        }

                        if (reportNGO_keys[i] == 'cost') {
                            value[reportNGO_keys[i]] = cost(value[reportNGO_keys[i]]);
                        }

                        if (reportNGO_keys[i] == 'delivery_date') {
                            if (value[reportNGO_keys[i]] != null) {
                                value[reportNGO_keys[i]] = localDate(value[reportNGO_keys[i]]).split(', ')[0];
                            }
                        }

                        query += '<td>' + value[reportNGO_keys[i]] + '</td>';
                    }

                    query += '</tr>';
                    $('#reportNGONeedList').append(query);

                    row_index += 1;
                })
                $('#report_ngo_preloader').hide();
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
        $('#reportNGONeedList').empty();

    })

})
