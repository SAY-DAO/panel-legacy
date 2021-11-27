$(document).ready(function(){
    isAuthorized();
    hasPrivilege();

    // Reset static select inputs
    $('.static').prop('selectedIndex',0);

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
            },
            bank_track_id: {
                number: true,
            },
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
            },
            bank_track_id: {
                number: "لطفا فقط عدد وارد کنید.",
            },
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

    // Add receipt modal form VALIDATION
    $('#receipt_form').validate({
      rules: {
        receipt_title: {
          required: true,
        },
        'receipts_file[]': {
          required: true,
          filesize: 3, // MB
        },
      },
      messages: {
        receipt_title: {
          required: 'ضروری',
        },
        'receipts_file[]': {
          required: 'ضروری',
          filesize: 'بیش‌ترین حجم قابل پذیرش: {0} مگابایت',
        },
      },
      errorPlacement: function (error, element) {
        error.appendTo(element.parent('div'));
      },
    });

    var status_needId = -1;
    var receipt_id = -1;
    var type_id = -1;
    var keys = ['id',
                'type',
                'name',
                'title',
                'status',
                'expected_delivery_date',
                'ngo_delivery_date',
                'dkc',
                'bank_track_id',
                'imageUrl',
                'childGeneratedCode',
                'childSayName',
                'childFirstName',
                'childLastName',
                'cost',
                'paid',
                'purchase_cost',
                'donated',
                'informations',
                'details',
                'affiliateLinkUrl',
                'link',
                'ngoName',
                'ngoAddress',
                'receipt_count',
                'doneAt',
                'child_delivery_date'];
    
    // for the report to ngo ajax
    var reportNGO_keys = ['id',
                        'ngoName',
                        'childGeneratedCode',
                        'childFirstName',
                        'childLastName',
                        'name',
                        'title',
                        'imageUrl',
                        'cost',
                        'purchase_cost',
                        'expected_delivery_date',
                        'bank_track_id',
                        'dkc'];

    // Handle status filtering in done needs report
    $('#type_filter').change(function() {
        console.log($(this).val());
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
            var selected_status = $('#status_filter_service').val() != -1 ? $('#status_filter_service').val() : 2;
        } else if (selected_type == 1) {
            var selected_status = $('#status_filter_product').val() != -1 ? $('#status_filter_product').val() : 2;
        }

        $.ajax({
            url: `${SAYApiUrl}/needs?idDone=true${selected_ngo ? `&ngoId=${selected_ngo}` : ``}${selected_type !== `` ? `&type=${selected_type}` : ``}${selected_status ? `&status=${selected_status}` : ``}`,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('.done_filter').prop('disabled', 'disabled');
                $('#done_need_preloader').show();
            },
            success: function(data) {
                needData = data['needs'];
                var row_index = 1;

                $.each(needData, function(key, value){
                    var needId = value[keys[0]];
                    var need_type = value['type'];
                    var need_status = -1;
                    
                    var query =
                      '<tr>\
                    <td>' +
                      row_index +
                      '</td>\
                    <td id="' +
                      needId +
                      '">\
                    <button type="submit" class="btn btn-block btn-embossed btn-default btn-sm changeStatus" onclick="editScroll()">Change status</button>\
                    <button class="btn btn-embossed btn-warning btn-block btn-sm receiptBtn">رسید</button>\
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

                        if (keys[i] == 'cost' || keys[i] == 'paid' || keys[i] == 'purchase_cost' || keys[i] == 'donated') {
                            if (value[keys[i]] != null) {
                                value[keys[i]] = cost(value[keys[i]]);
                            }
                        }

                        if(keys[i] == 'doing_duration') {
                            value[keys[i]] = value[keys[i]] + " days";
                        }

                        if(keys[i] == 'affiliateLinkUrl' || keys[i] == 'link') {
                            if(value[keys[i]] != null) {
                                value[keys[i]] = linkTo(value[keys[i]]);
                            }
                        }

                        if (keys[i] == 'expected_delivery_date' || keys[i] == 'ngo_delivery_date' || keys[i] == 'doneAt' || keys[i] == 'child_delivery_date') {
                            if (value[keys[i]] != null) {
                                value[keys[i]] = jalaliDate(value[keys[i]]);
                            }
                        }

                        if (keys[i] == 'details' || keys[i] == 'title' || keys[i] == 'informations') {
                            if(value[keys[i]] != null) {
                                value[keys[i]] = rtl(value[keys[i]]);
                            }
                        }

                        if (value[keys[i]] == null) {
                            value[keys[i]] = nullValues();
                        }
                        query += '<td>' + value[keys[i]] + '</td>';
                    }

                    query += '</tr>';
                    $('#reportDoneNeedList').append(query);

                    if (
                      !(
                        need_status === 14 ||
                        need_status === 15 ||
                        need_status === 03 ||
                        need_status === 04
                      )
                    ) {
                      $('#' + needId)
                        .find('.receiptBtn')
                        .hide();
                    }

                    row_index += 1;
                })
                $('#done_need_preloader').hide();
                $('.done_filter').prop('disabled', false);
            },
            error: function(data) {
                console.log(data.responseJSON.message);
                $('.done_filter').prop('disabled', false);
            }
        });

        $('#reportDoneNeedList').empty();
    })

    // Handle Product's fields
    $('#need_status_product').change(function() {
        if ($(this).val() == 3) {   // if product purchase
            $('#expected_delivery').show();
            $('#cost_field').show();
            $('#dkc_number').show();
        } else {
            $('#expected_delivery').hide();
            $('#cost_field').hide();
            $('#dkc_number').hide();
        }
        if ($(this).val() == 4) {   // if product delivered to NGO
            $('#real_delivery').show();
        } else {
            $('#real_delivery').hide();
        }
    })

    // Handle Service's field
    $('#need_status_service').change(function() {
        if ($(this).val() == 3) {   // if money transferred to the NGO
            $('#track_id').show();
        } else {
            $('#track_id').hide();
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
                $("div.alert").hide();

                type_id = data['type'];     // to use in confirm change status
                $('#expected_delivery').hide();
                $('#real_delivery').hide();
                $('#cost_field').hide();
                $('#track_id').hide();
                $('#dkc_number').hide();
                $('#purchase_cost').val(data['purchase_cost'] ? cost(data['purchase_cost']).replace("Toman", "") : data['pretty_paid']);
                $('#bank_track_id').val(data['bank_track_id']);
                $('#dkc').val(data['dkc']);

                $('#need_name').val(data['name']);
                $('#expected_delivery_date').val(localeDate(data['expected_delivery_date']));
                $('#ngo_delivery_date').val(localeDate(data['ngo_delivery_date']));

                if (type_id == 0) { // if service
                    $('#product_status').hide();
                    $('#service_status').show();
                    $('#need_status_service').val(data['status']).change();  // need status feild in get need by id
                } else if (type_id == 1) {  // if product
                    $('#service_status').hide();
                    $('#product_status').show();
                    $('#need_status_product').val(data['status']).change();  // need status feild in get need by id
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
        var expected_delivery = false;
        var real_delivery = false;
        var ngo_money_transfer = false;
        var need_name = $('#need_name').val();
        if (type_id == 0) { // if service
            $('#need_status_product').rules('remove', 'required');  // remove rule
            $('#expected_delivery_date').rules('remove', 'required'); // remove rule
            $('#ngo_delivery_date').rules('remove', 'required');    // remove rule

            status = $('#need_status_service').val();
            if (status == 3) {  // if money transferred to the NGO
                ngo_money_transfer = true;
                // add rule
                $('#bank_track_id').rules('add', {
                    required: true,
                    messages: {required: "شماره پیگیری بانک ضروری است."}
                });
            } else {
                $('#bank_track_id').rules('remove', 'required');    // remove rule
            }
        } else if (type_id == 1) {  // if product
            $('#need_status_service').rules('remove', 'required');  // remove rule
            $('#bank_track_id').rules('remove', 'required');    // remove rule

            status = $('#need_status_product').val();
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
        var purchase_cost = $('#purchase_cost').val().replaceAll(',','');
        var bank_track_id = $('#bank_track_id').val();
        var dkc = $('#dkc').val();

        // append datas to a Form Data
        var form_data = new FormData();
        if (status) {
            form_data.append('status', status);
        }
        if (expected_delivery) { // if the product status is changing to 3
            form_data.append('expected_delivery_date', expected_delivery_date);
            form_data.append('purchase_cost', purchase_cost);
            form_data.append('dkc', dkc);
        }
        if (real_delivery) { // if the product status is changing to 4
            form_data.append('ngo_delivery_date', ngo_delivery_date);
        }
        if (ngo_money_transfer) {   // if the Service status is changing to 3
            form_data.append('bank_track_id', bank_track_id);
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
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
                    });
                }
            })
        }
    })

    // Handle email hint text
    // If 7am < time <1pm = email will send on 1pm, if 1pm < time < 7am = email will send on 7am
    var now = new Date();
    var hour = now.getHours();
    var morningText = 'لیست این نیازها ساعت ۷ صبح به ایمیل هماهنگ کننده‌ی انجمن کودک ارسال می‌شود.';
    var afternoonText = 'لیست این نیازها ساعت ۱ بعد از ظهر به ایمیل هماهنگ کننده‌ی انجمن کودک ارسال می‌شود.';
    if (hour > 7 && hour < 13) {
        $('#email-hint').append(afternoonText);
    } else {
        $('#email-hint').append(morningText);
    }
    
    // status 3 needs to report to NGO
    $('.report_filter').change(function() {
        var selected_ngo = $('#need_ngo').val();
        var selected_type_id = $('#need_type').val();
        console.log(selected_ngo);
        $.ajax({
            url: `${SAYApiUrl}/needs?status=3&isReported=false${selected_ngo ? `&ngoId=${selected_ngo}` : ``}${selected_type_id !== `` ? `&type=${selected_type_id}` : ``}`,
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

                        if (reportNGO_keys[i] == 'cost' || reportNGO_keys[i] == 'purchase_cost') {
                            value[reportNGO_keys[i]] = cost(value[reportNGO_keys[i]]);
                        }

                        if (reportNGO_keys[i] == 'expected_delivery_date') {
                            if (value[reportNGO_keys[i]] != null) {
                                value[reportNGO_keys[i]] = jalaliDate(value[reportNGO_keys[i]]);
                            }
                        }

                        if (keys[i] == 'title') {
                            if(value[keys[i]] != null) {
                                value[keys[i]] = rtl(value[keys[i]]);
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

    // Receipt add/view
    $('#reportDoneNeedList').on('click', '.receiptBtn', function(e) {
        e.preventDefault();
        status_needId = $(this).parent().attr('id');
        $('#needName').empty();
        resetReceiptForm();
        $('#editReceipt').hide();
        $('#addReceipt').show();
        $('#receipt-modal').modal('show');

        $.ajax({
            url: `${SAYApiUrl}/need/needId=${status_needId}`,
            method: 'GET',
            dataType: 'json',
            beforeSend: function () {
                $('#receipt_preloader').show();
            },
            success: function (data) {
                $('#needName').text(data['title'] ? data['title'] : data['name']);
                $('#receipt_preloader').hide();
        },
            error: function (data) {
                console.log(data.responseJSON.message);
            },
        });

        showNeedReceipt(status_needId);
    });

    function resetReceiptForm() {
        receipt_id = -1;
        $('.static_r').val(null);
        $('#receipt_code_search').empty();
        $('#receipt_code_search').append(
          '<option value="0">جستجوی رسیدهای پیشین</option>'
        );
        $('#receipt_code_search').select2('val', 0);
        $('#isPublic').val(0).change();
        $('#receipt_form').validate().resetForm();
        $('#receipt_form .form-control').removeClass('error');
        $('.static_r').prop('disabled', false);
        $('#show_receipt').hide();
        $('#receipt_file_container').find('.file').show();
        getAllReceipts();
    }

    function getAllReceipts() {
        $.ajax({
            url: `${SAYApiUrl}/receipts?take=100`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                $.each(data, (key, receipt) => {
                    var accessibility = receipt['isPublic'] ? 'Public' : 'Private';
                    var query = '';
                    query += `<option value=${receipt['id']}>${receipt['code']} - ${receipt['title']} - ${accessibility}</option>`;
                    $('#receipt_code_search').append(query);
                })
            },
            error: function(err) {
                console.log(err);
            }
        });
    };

    $('#receipt_code_search').change(function () {
      receipt_id = $(this).val();
      if (receipt_id === "0") {
        resetReceiptForm();
        return;
      }
      $('#addReceipt').show();
      $('#editReceipt').hide();
      $('#receipt_preloader').show();
      $('#addReceipt').prop('disabled', 'disabled');
      $('#receipt_code_search').prop('disabled', 'disabled');
      $('#show_receipt').removeAttr('href');

      getReceiptById(receipt_id, function(output) {
        var isPublic = output['isPublic'] ? '1' : '0';
        $('#receipt_code').val(output['code']);
        $('#isPublic').val(isPublic).change();
        $('#receipt_title').val(output['title']);
        $('#receipt_description').val(output['description']);
        $('#show_receipt').attr('href', output['attachment']);
        $('.static_r').prop('disabled', 'disabled');
        $('#addReceipt').prop('disabled', false);
        $('#receipt_code_search').prop('disabled', false);
        $('#receipt_file_container').find('.file').hide();
        $('#show_receipt').show();
        $('#receipt_preloader').hide();
      })
    });

    // Submit adding a receipt to a need
    $('#addReceipt').on('click', function(e) {
        e.preventDefault();

        if (receipt_id !== -1) {
            $.ajax({
                url: `${SAYApiUrl}/receipts/${receipt_id}/needs/${status_needId}`,
                method: 'POST',
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function() {
                    $('#receipt_preloader').show();
                    return confirm('You are attaching the receipt to this need.\nAre you sure?');
                },
                success: function(data) {
                    $('#receipt_preloader').hide();
                    alert("Success");
                    resetReceiptForm();
                    showNeedReceipt(status_needId);
                },
                error: function(err) {
                    $('#receipt_preloader').hide();
                    bootbox.alert({
                        title: errorTitle(),
                        message: errorContent(err.responseJSON.message),
                    });
                }
            });
            $('#receipt_preloader').hide();
            $('#receipt-modal').modal('handleUpdate')
        } else {
            var attachment = $('#receipts_file')[0].files[0];
            var code = $('#receipt_code').val();
            var title = $('#receipt_title').val();
            var description = $('#receipt_description').val();
            var isPublic = $('#isPublic').val();

            var formData = new FormData();
            formData.append('attachment', attachment);
            formData.append('code', code);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('isPublic', isPublic);

            if ($('#receipt_form').valid()) {
                $.ajax({
                    url: `${SAYApiUrl}/needs/${status_needId}/receipts`,
                    method: 'POST',
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    beforeSend: function () {
                        $('#receipt_preloader').show();
                        return confirm('Are you sure?');
                    },
                    success: function (data) {
                        $('#receipt_preloader').hide();
                        alert(`Success\nReceipt "${data.title}" added successfully.`);
                        resetReceiptForm();
                        showNeedReceipt(status_needId);
                    },
                    error: function (data) {
                        $('#receipt_preloader').hide();
                        bootbox.alert({
                            title: errorTitle(),
                            message: errorContent(data.responseJSON.message),
                        });
                    },
                });
                $('#receipt_preloader').hide();
            }
        }
    });

    // Delete a receipt from a need
    $('#need_receipts').on('click', '.delReceipt', function (e) {
        e.preventDefault();
        var del_receipt_id = $(this).parent().attr('id');
        delNeedReceiptById(status_needId, del_receipt_id);
    });

    // Update receipt
    $('#need_receipts').on('click', '.editReceipt', function (e) {
        e.preventDefault();
        resetReceiptForm();
        $('#addReceipt').hide();
        $('#editReceipt').show();
        
        receipt_id = $(this).parent().attr('id');
        $('#receipt_preloader').show();
        $('#editReceipt').prop('disabled', 'disabled');
        $('#receipt_code').attr('disabled', true);
        
        getReceiptById(receipt_id, function(output) {
            var isPublic = output['isPublic'] ? '1' : '0';
            $('#receipt_code').val(output['code']);
            $('#isPublic').val(isPublic).change();
            $('#receipt_title').val(output['title']);
            $('#receipt_description').val(output['description']);
            $('#show_receipt').attr('href', output['attachment']);
            $('#editReceipt').prop('disabled', false);
            $('#receipt_file_container').find('.file').hide();
            $('#show_receipt').show();
            $('#receipt_preloader').hide();
        });
    });

    // Confirm Update receipt
    $('#editReceipt').on('click', function(e) {
        e.preventDefault();
        var title = $('#receipt_title').val();
        var description = $('#receipt_description').val();
        var isPublic = $('#isPublic').val();

        var formData = new FormData();
        if (title) {
            formData.append('title', title);
        }
        if (description) {
            formData.append('description', description);
        }
        formData.append('isPublic', isPublic);

        $('#receipts_file').rules('remove', 'required'); // Remove attachment requtred rule
        $('#receipt_title').rules('remove', 'required'); // Remove title requtred rule

        if ($('#receipt_form').valid()) {
            $.ajax({
                url: `${SAYApiUrl}/receipts/${receipt_id}`,
                method: 'PATCH',
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: formData,
                beforeSend: function () {
                    $('#receipt_preloader').show();
                    return confirm('این تغییر بر روی تمام نیازهایی که این رسید را دارند نیز اعمال می‌شود.\nAre you sure?');
                },
                success: function (data) {
                    $('#receipt_preloader').hide();
                    alert(`Success\nReceipt "${data.title}" changed successfully.`);
                    resetReceiptForm();
                    $('#editReceipt').hide();
                    $('#addReceipt').show();
                    showNeedReceipt(status_needId);
                },
                error: function (data) {
                    $('#receipt_preloader').hide();
                    bootbox.alert({
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
                    });
                },
            });
            $('#receipt_preloader').hide();
        }
    });

})
