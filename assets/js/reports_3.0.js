$(document).ready(function(){
    isAuthorized();
    hasPrivilege();

    $('.date_time').datetimepicker({
        dateFormat: 'yy-m-d',
        timeFormat: 'H:0:0',
    });
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
    var keys = ['id' , 'type' , 'name' , 'title' , 'status' , 'expected_delivery_date' , 'ngo_delivery_date' , 'imageUrl' , 'childGeneratedCode' , 'childSayName' , 'childFirstName' , 'childLastName' , 'cost', 'donated' , 'details' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'ngoName' , 'ngoAddress' , 'receipts' , 'doneAt'];
    
    // for the report to ngo ajax
    var reportNGO_keys = ['id' , 'ngoName' , 'childGeneratedCode' , 'childFirstName' , 'childLastName' , 'name' , 'title' , 'imageUrl' , 'cost' , 'expected_delivery_date'];

    // Handle status filtering in done needs report
    $('#type_filter').change(function() {
        if ($(this).val() == 0) {   // if service
            $('#1s').show();
            $('#1p').hide();
            $('#status_filter_product').val('-1');
        } else if ($(this).val() == 1) {   // if product
            $('#1s').hide();
            $('#1p').show();
            $('#status_filter_service').val('-1');
        } else if ($(this).val() == -1) {   // if none
            $('#1s').hide();
            $('#1p').hide();
            $('#status_filter_service').val('-1');
            $('#status_filter_product').val('-1');
        }
    })
    
    // get Done needs
    $('.done_filter').change(function() {
        var selected_ngo = $('#ngo_filter').val();
        var selected_type = $('#type_filter').val() != -1 ? $('#type_filter').val() : '';

        if (selected_type == 0) {
            var selected_status = $('#status_filter_service').val() != -1 ? $('#status_filter_service').val() : '';
        } else if (selected_type == 1) {
            var selected_status = $('#status_filter_product').val() != -1 ? $('#status_filter_product').val() : '';
        }

        $.ajax({
            url: SAYApiUrl + '/need/all/confirm=2?done=1&ngoId=' + selected_ngo + '&type=' + selected_type + '&status=' + selected_status,
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
                    var need_type = value['type'];
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

                        if (keys[i] == 'expected_delivery_date' || keys[i] == 'ngo_delivery_date' || keys[i] == 'doneAt') {
                            if (value[keys[i]] != null) {
                                value[keys[i]] = localDate(value[keys[i]]);
                            }
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
        $('#reportDoneNeedList').empty();
    })

    // Handle delivery date fields
    $('#need_status_product').change(function() {
        if ($(this).val() == 3) {   // if product purchase
            $('#expected_delivery').show();
        } else {
            $('#expected_delivery').hide();
        }
        if ($(this).val() == 4) {   // if product delivered to NGO
            $('#real_delivery').show();
        } else {
            $('#real_delivery').hide();
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
                $('#expected_delivery').hide();
                $('#real_delivery').hide();
                
                $('#need_name').val(data['name']);
                $('#expected_delivery_date').val(localDate(data['expected_delivery_date']));
                $('#ngo_delivery_date').val(localDate(data['ngo_delivery_date']));

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
        var expected_delivery = false;
        var real_delivery = false;
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
                expected_delivery = true;
                // add rule
                $('#expected_delivery_date').rules('add', {
                    required: true,
                    messages: {required: "انتخاب تاریخ تحویل ضروری است."}
                });
            }else{
                $('#expected_delivery_date').rules('remove', 'required');    // remove rule
            }
            if (status == 4) {
                real_delivery = true;
                // add rule
                $('#ngo_delivery_date').rules('add', {
                    required: true,
                    messages: {required: "انتخاب تاریخ رسیدن کالا ضروری است."}
                });
            }else{
                $('#ngo_delivery_date').rules('remove', 'required');    // remove rule
            }
        }
        var expected_delivery_date = UTCDate($('#expected_delivery_date').val());   // utc date to back
        var ngo_delivery_date = UTCDate($('#ngo_delivery_date').val()); // utc date to back

        // append datas to a Form Data
        var form_data = new FormData();
        if (status) {
            form_data.append('status', status);
        }
        if (receipts) {
            form_data.append('receipts', receipts);
        }
        if(expected_delivery == true) { // if the product status is changing to 3
            form_data.append('expected_delivery_date', expected_delivery_date);
        }
        if(real_delivery == true) { // if the product status is changing to 4
            form_data.append('ngo_delivery_date', ngo_delivery_date);
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

                        if (reportNGO_keys[i] == 'expected_delivery_date') {
                            if (value[reportNGO_keys[i]] != null) {
                                value[reportNGO_keys[i]] = localDate(value[reportNGO_keys[i]]);
                            }
                        }

                        if (value[reportNGO_keys[i]] == null) {
                            value[reportNGO_keys[i]] = nullValues();
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