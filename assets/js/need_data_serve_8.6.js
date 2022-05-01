$(document).ready(function(){
    isAuthorized();
    hasPrivilege();

    // Reset static fields after refresh
    $('.static').val('');
    $('.static').prop('selectedIndex',0);

    // needs form validation
    $('#need_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            child_id: {
                required: true,
            },
            // TODO: temporarily disabled due to first adding new need by SWs
            // need_name: {
            //     required: true,
            // },
            need_name_fa: {
                required: true,
            },
            // TODO: temporarily disabled due to first adding new need by SWs
            // need_category: {
            //     required:true,
            // },
            need_cost: {
                required: true,
                number: true,
            },
            "need_icon[]": {
                // required: true, // TODO: temporarily disabled for problem in adding by pre-need
                extension: "jpg,png,jpeg",
                filesize: 1    // MB
            },
            need_type: {
                required: true,
            },
            direct_link: {
                url: true,
            },
            need_doing_duration: {
                number: true,
            },
            // TODO: temporarily disabled due to first adding new need by SWs
            // need_description: {
            //     required: true,
            // },
            // need_description_fa: {
            //     required: true,
            // },
        },
        messages: {
            child_id: {
                required: "انتخاب کودک ضروری است.",
            },
            // TODO: temporarily disabled due to first adding new need by SWs
            // need_name: {
            //     required: "وارد کردن نام نیاز ضروری است.",
            // },
            need_name_fa: {
                required: "وارد کردن نام نیاز ضروری است.",
            },
            // TODO: temporarily disabled due to first adding new need by SWs
            // need_category: {
            //   required: "انتخاب دسته‌بندی نیاز ضروری است.",
            // },
            need_cost: {
                required: "وارد کردن هزینه نیاز ضروری است.",
                number: "لطفا فقط عدد وارد کنید.",
            },
            "need_icon[]": {
                // required: "انتخاب آیکون نیاز ضروری است.",    // TODO: temporarily disabled for problem in adding by pre-need
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB",
            },
            need_type: {
                required: "انتخاب نوع نیاز ضروری است.",
            },
            direct_link: {
                url: "اشتباه شد.",
            },
            need_doing_duration: {
                number: "لطفا فقط عدد وارد کنید.",
            },
            // TODO: temporarily disabled due to first adding new need by SWs
            // need_description: {
            //     required: "وارد کردن شرح نیاز ضروری است.",
            // },
            // need_description_fa: {
            //     required: "وارد کردن شرح نیاز ضروری است.",
            // },
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

    $('#receipt_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            "r_need_receipts[]": {
                extension: "jpg,png,jpeg,PDF",
                filesize: 3,    // MB
                required: true,
            },
            r_receipt_title: {
                required: true,
            },
        },
        messages: {
            "r_need_receipts[]": {
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB",
                required: "رسید را انتخاب کنید.",
            },
            r_receipt_title: {
                required: "عنوان رسید را وارد کنید.",
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
    
    var edit_needId = -1;
    var edit_receiptId = -1;

    var keys = ['id' , 'child_id' , 'name' , 'name_fa' , 'title' , 'imageUrl' , 'cost' , 'paid' , 'progress' , 'status' , 'type' , 'informations' , 'details' , 'isUrgent' , 'category' , 'description' , 'description_fa', 'link' , 'created' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'updated', 'doneAt', 'child_delivery_date']

    // Get Children Needs by child id
    $('#child_need_select').change(function() {
        var selected_child = $(this).val();
        if(selected_child) {
            $.ajax({
                url: SAYApiUrl + '/child/childId=' + selected_child + '/needs',
                method: 'GET',
                dataType: 'json',
                beforeSend: function() {
                    $('.select_btn').prop('disabled', 'disabled');
                    $('#needs_preloader').show();
                },
                success: function(data) {
                    $('.total_count').empty();
                    var pre_needs = selected_child === "104" || false;
                    var row_index = 1;
                    
                    // Change data to needs
                    data = data['needs'];

                    $('.total_count').html(' - ' + data.length + ' تا');
                    // Sort needs list => first !done needs(based on `created` Descending), second done needs(based on `doneAt` Descending)
                    var copy_needData = $.extend(true, [], data);
                    var sortedNeedData = pre_needs ? copy_needData : copy_needData.sort(SortByDone).sort(SortNeedsList);
                    
                    $.each(sortedNeedData, function(key, value){
                        var needId = value['id'];
                        var name_translations = value['name_translations'];
                        var description_translations = value['description_translations'];
                        
                        var confirmStatus = -1;
                        var needType = value['type'];
                        var sayName = value['childSayName'];
        
                        // first td for row count numbers, second td for operational buttons
                        var query = '<tr>\
                        <td>' + row_index + '</td>\
                        <td id="' + needId + '">\
                        <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                        <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                        <button class="btn btn-embossed btn-warning btn-block btn-sm receiptBtn" onclick="editScroll()">Receipt</button>\
                        <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                        </td>\
                        <td>' + sayName + '</td>';
                        for(var i=2 ; i < keys.length ; i++){
                            
                            if ( keys[i] == 'name') {
                                value[keys[i]] = name_translations.en;
                            }

                            if ( keys[i] == 'name_fa') {
                                value[keys[i]] = rtl(name_translations.fa);
                            }

                            if ( keys[i] == 'description') {
                                value[keys[i]] = description_translations.en;
                            }

                            if ( keys[i] == 'description_fa') {
                                value[keys[i]] = rtl(description_translations.fa);
                            }

                            if (keys[i] == 'imageUrl') {
                                value[keys[i]] = getImgFile(value[keys[i]]);
                            }

                            if (keys[i] == 'cost' || keys[i] == 'paid') {
                                value[keys[i]] = cost(value[keys[i]]);
                            }

                            if (keys[i] == 'link') {
                                if(value[keys[i]] != null) {
                                    value[keys[i]] = linkTo(value[keys[i]]);
                                }
                            }

                            if (keys[i] == 'progress') {
                                value[keys[i]] = value[keys[i]] + '%'
                            }

                            if (keys[i] == 'type') {
                                if(value[keys[i]] == 0){
                                    value[keys[i]] = 'Service';
                                }
                                if(value[keys[i]] == 1){
                                    value[keys[i]] = 'Product';
                                }
                            }

                            if (keys[i] == 'status') {
                                if(value[keys[i]] == 0){
                                    value[keys[i]] = 'Not paid';
                                }
                                if(value[keys[i]] == 1){
                                    value[keys[i]] = 'Partially paid';
                                }
                                if(value[keys[i]] == 2){
                                    value[keys[i]] = fullPayment();
                                }
                                
                                if(needType == 0){
                                    if(value[keys[i]] == 3) {
                                        value[keys[i]] = ngoDelivery();
                                    }
                                    if(value[keys[i]] == 4) {
                                        value[keys[i]] = childDelivery();
                                    }
                                }
        
                                if(needType == 1){
                                    if(value[keys[i]] == 3) {
                                        value[keys[i]] = purchased();
                                    }
                                    if(value[keys[i]] == 4) {
                                        value[keys[i]] = ngoDelivery();
                                    }
                                    if(value[keys[i]] == 5) {
                                        value[keys[i]] = childDelivery();
                                    }
                                }
                            }

                            if (keys[i] == 'details' || keys[i] == 'title' || keys[i] == 'informations') {
                                if(Boolean(value[keys[i]]) != false) {
                                    value[keys[i]] = rtl(value[keys[i]]);
                                }
                            }

                            if (keys[i] == 'isUrgent') {
                                if(value[keys[i]] == false){
                                    value[keys[i]] = 'Not urgent';
                                }
                                if(value[keys[i]] == true){
                                    value[keys[i]] = 'Urgent';
                                }
                            }

                            if (keys[i] == 'category') {
                                if(value[keys[i]] == 0){
                                    value[keys[i]] = 'Growth';
                                }
                                if(value[keys[i]] == 1){
                                    value[keys[i]] = 'Joy';
                                }
                                if(value[keys[i]] == 2){
                                    value[keys[i]] = 'Health';
                                }
                                if(value[keys[i]] == 3){
                                    value[keys[i]] = 'Surroundings';
                                }
                            }

                            if (keys[i] == 'isConfirmed') {
                                if(value[keys[i]] == false){
                                    value[keys[i]] = 'Not confirmed';
                                }
                                if(value[keys[i]] == true){
                                    value[keys[i]] = 'Confirmed';
                                    confirmStatus = 1;
                                }
                            }

                            if(keys[i] == 'confirmDate' || keys[i] == 'created' || keys[i] == 'updated' || keys[i] == 'child_delivery_date' || keys[i] == 'doneAt') {
                                value[keys[i]] = jalaliDate(value[keys[i]]);
                            }
    
                            if(Boolean(value[keys[i]]) == false){
                                value[keys[i]] = nullValues();
                            }

                            query += '<td>' + value[keys[i]] + '</td>';
                        }
                        query += '</tr>';
                        $('#needList').append(query);
                        hasPrivilege();

                        // disable confirm button if the need has confirmed already!
                        if(confirmStatus == 1){
                            $('#' + needId).find('.confirmBtn').prop("disabled", true);
                            $('#' + needId).find('.confirmBtn').text("Confirmed");
                        }

                        if (global_user_role != ROLES.SUPER_ADMIN && confirmStatus == 1) {
                            $('#' + needId).find('.editBtn').prop("disabled", true);
                        }

                        // TODO: Pre Defined needs (this is a hard code)
                        if (selected_child == 104) {
                            $('#' + needId).find('.confirmBtn').hide();
                            $('#' + needId).find('.receiptBtn').hide();
                        }
                        row_index += 1;
                    })
                    $('#needs_preloader').hide();
                    $('.select_btn').prop('disabled', false);
                },
                error: function(data) {
                    console.log(data.responseJSON.message);
                    $('.select_btn').prop('disabled', false);
                }
            })
        }
        $('#needList').empty();
    })

    // Get Needs by confirm status and ngo_id
    $('.need_filter').change(function() {
        var confirm_status = $('#need_confirm_status').val();
        var selected_ngo = $('#need_ngo').val();
        var payable_status = $('#need_payable_status').val();
        if((confirm_status && selected_ngo) || payable_status) {
            $.ajax({
                url: `${SAYApiUrl}/needs?${confirm_status ? `isConfirmed=${confirm_status}&` : ``}${selected_ngo ? `ngoId=${selected_ngo}&` : ``}${payable_status ? `unpayable=${!$.parseJSON(payable_status)}` : ``}&isChildConfirmed=true`,
                method: 'GET',
                dataType: 'json',
                headers: {
                    'X-TAKE': '500',
                },
                beforeSend: function() {
                    $('#needs_preloader').show();
                    $('.select_btn').prop('disabled', 'disabled');
                },
                success: function(data) {
                    console.log(data);
                    var total_count = data['totalCount'];
                    data = data['needs'].filter(n => n.child_id != 104);
                    $('.total_count').html(' - ' + data.length + ' تا');
                    console.log(total_count)
                    var row_index = 1;

                    // Sort needs list => first !done needs(based on `created` Descending), second done needs(based on `doneAt` Descending)
                    var copy_needData = $.extend(true, [], data);
                    var sortedNeedData = copy_needData.sort(SortByDone).sort(SortNeedsList);

                    $.each(sortedNeedData, function(key, value){
                        var needId = value['id'];
                        var confirmStatus = -1;
                        var needType = value['type'];
                        var sayName = value['childSayName'];
                        var name_translations = value['name_translations'];
                        var description_translations = value['description_translations'];

                        // first td for row count numbers, second td for operational buttons
                        var query = '<tr>\
                        <td>' + row_index + '</td>\
                        <td id="' + needId + '">\
                        <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                        <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                        <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                        </td>\
                        <td>' + sayName + '</td>';
                        for(var i=2 ; i < keys.length ; i++){
                            
                            if ( keys[i] == 'name') {
                                value[keys[i]] = name_translations.en;
                            }

                            if ( keys[i] == 'name_fa') {
                                value[keys[i]] = rtl(name_translations.fa);
                            }

                            if ( keys[i] == 'description') {
                                value[keys[i]] = description_translations.en;
                            }

                            if ( keys[i] == 'description_fa') {
                                value[keys[i]] = rtl(description_translations.fa);
                            }

                            if (keys[i] == 'imageUrl') {
                                value[keys[i]] = getImgFile(value[keys[i]]);
                            }

                            if (keys[i] == 'cost' || keys[i] == 'paid') {
                                value[keys[i]] = cost(value[keys[i]]);
                            }

                            if (keys[i] == 'link') {
                                if(value[keys[i]] != null) {
                                    value[keys[i]] = linkTo(value[keys[i]]);
                                }
                            }

                            if (keys[i] == 'progress') {
                                value[keys[i]] = value[keys[i]] + '%'
                            }

                            if (keys[i] == 'type') {
                                if(value[keys[i]] == 0){
                                    value[keys[i]] = 'Service';
                                }
                                if(value[keys[i]] == 1){
                                    value[keys[i]] = 'Product';
                                }
                            }

                            if (keys[i] == 'status') {
                                if(value[keys[i]] == 0){
                                    value[keys[i]] = 'Not paid';
                                }
                                if(value[keys[i]] == 1){
                                    value[keys[i]] = 'Partially paid';
                                }
                                if(value[keys[i]] == 2){
                                    value[keys[i]] = fullPayment();
                                }
                                
                                if(needType == 0){
                                    if(value[keys[i]] == 3) {
                                        value[keys[i]] = ngoDelivery();
                                    }
                                    if(value[keys[i]] == 4) {
                                        value[keys[i]] = childDelivery();
                                    }
                                }
        
                                if(needType == 1){
                                    if(value[keys[i]] == 3) {
                                        value[keys[i]] = purchased();
                                    }
                                    if(value[keys[i]] == 4) {
                                        value[keys[i]] = ngoDelivery();
                                    }
                                    if(value[keys[i]] == 5) {
                                        value[keys[i]] = childDelivery();
                                    }
                                }
                            }

                            if (keys[i] == 'details' || keys[i] == 'title' || keys[i] == 'informations') {
                                if(Boolean(value[keys[i]]) != false) {
                                    value[keys[i]] = rtl(value[keys[i]]);
                                }
                            }

                            if (keys[i] == 'isUrgent') {
                                if(value[keys[i]] == false){
                                    value[keys[i]] = 'Not urgent';
                                }
                                if(value[keys[i]] == true){
                                    value[keys[i]] = 'Urgent';
                                }
                            }

                            if (keys[i] == 'category') {
                                if(value[keys[i]] == 0){
                                    value[keys[i]] = 'Growth';
                                }
                                if(value[keys[i]] == 1){
                                    value[keys[i]] = 'Joy';
                                }
                                if(value[keys[i]] == 2){
                                    value[keys[i]] = 'Health';
                                }
                                if(value[keys[i]] == 3){
                                    value[keys[i]] = 'Surroundings';
                                }
                            }

                            if(keys[i] == 'doing_duration') {
                                value[keys[i]] = value[keys[i]] + " days";
                            }

                            if (keys[i] == 'isConfirmed') {
                                if(value[keys[i]] == false){
                                    value[keys[i]] = 'Not confirmed';
                                }
                                if(value[keys[i]] == true){
                                    value[keys[i]] = 'Confirmed';
                                    confirmStatus = 1;
                                }
                            }

                            if(keys[i] == 'confirmDate' || keys[i] == 'created' || keys[i] == 'updated' || keys[i] == 'doneAt' || keys[i] == 'child_delivery_date') {
                                value[keys[i]] = jalaliDate(value[keys[i]]);
                            }
    
                            if(Boolean(value[keys[i]]) == false){
                                value[keys[i]] = nullValues();
                            }

                            query += '<td>' + value[keys[i]] + '</td>';
                        }
                        query += '</tr>';
                        $('#needList').append(query);
                        hasPrivilege();

                        // disable confirm button if the need has confirmed already!
                        if(confirmStatus == 1){
                            $('#' + needId).find('.confirmBtn').prop("disabled", true);
                        }
                        row_index += 1;
                    })
                    $('#needs_preloader').hide();
                    $('.select_btn').prop('disabled', false);
                },
                error: function(data) {
                    console.log(data.responseJSON.message);
                    $('.select_btn').prop('disabled', false);
                }
            })
        } else {
            $('.total_count').empty();
        }
        $('#needList').empty();
    })

    // get Pre-defined needs of children in need forms drop down
    $.ajax({
      url: SAYApiUrl + "/preneeds/", // TODO: Pre Defined needs
      method: "GET",
      dataType: "json",
      success: function (data) {
        // console.log("predefined needs", data);
        $.each(data, function (key, value) {
          var name = value["name"];
          var title = value["type"] == 0 ? value["details"] : value["title"]; // show details for services, and title for products
          var query = "";
          query +=
            '<option value="' +
            value["id"] +
            '">' +
            name +
            " | " +
            value["cost"] +
            " | " +
            title +
            "</option>";
          $("#pre_need_id").append(query);
        });
      },
      error: function (data) {
        console.log(data.responseJSON.message);
      },
    });

    // need form fill out with Pre-defined need data
    $('#pre_need_id').change(function() {
        $('#need_name').prop("disabled", true);
        $('#need_name_fa').prop("disabled", true);
        $('#need_description').prop("disabled", true);
        $('#need_description_fa').prop("disabled", true);
        $('#need_category').prop("disabled", true);
        $('#need_type').prop("disabled", true);
        
        var selected_need = $(this).val();
        $.ajax({
            url: SAYApiUrl + '/need/needId=' + selected_need,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#need_form_preloader').show();
            },
            success: function(data) {

                var need_icon = baseUrl + data['imageUrl'];
                var name_translations = data['name_translations'];
                var description_translations = data['description_translations'];

                $('#need_name').val(name_translations.en);
                $('#need_name_fa').val(name_translations.fa);
                $('#need_category').val(data['category']).change();
                $('#need_type').val(data['type']).change();
                $('#is_urgent').val(data['isUrgent']).change();
                $('#need_cost').val(data['cost']);
                $('#need_description').val(description_translations.en);
                $('#need_description_fa').val(description_translations.fa);
                $('#need_details').val(data['details']);
                $('#need_informations').val(data['informations']);
                $('#need_doing_duration').val(data['doing_duration']);
                $('#direct_link').val(data['link']);

                // // Trying to show predefined icon
                // $('#need_icon').val(need_icon);

                // need_icon.addEventListener('loadImage', function() {
                //     $('#need_icon').val(need_icon);
                // }, false)
                
                // console.log("icon: ", $('#need_icon').val());
                
                $('#need_form_preloader').hide();
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
    })


    // Add new Need
    $('#sendNeedData').on('click' , function(e){
        e.preventDefault();

        $('#editNeedData').attr("disabled" , true);
        // recieving data from html form
        var childId = $('#child_id').val();
        var imageUrl = $('#need_icon')[0].files[0];
        var category = $('#need_category').val() || -1;
        var cost = $('#need_cost').val().replaceAll(',','');
        var details = $('#need_details').val();
        var informations = $('#need_informations').val();
        var type = $('#need_type').val();
        var doing_duration = $('#need_doing_duration').val();
        var isUrgent = $('#is_urgent').val();
        var name_translations = JSON.stringify({
            en: $('#need_name').val() || "",
            fa: $('#need_name_fa').val(),
        });
        var description_translations = JSON.stringify({
            en: $('#need_description').val() || "",
            fa: $('#need_description_fa').val() || "",
        });
        
        var link = $('#direct_link').val();

        var form_data = new FormData();
        form_data.append('child_id', childId);
        form_data.append('name_translations', name_translations);
        form_data.append('description_translations', description_translations);
        form_data.append('category', category);
        form_data.append('cost', cost);
        form_data.append('details', details);
        form_data.append('informations', informations);
        form_data.append('type', type);
        form_data.append('isUrgent', isUrgent);

        if (imageUrl) {
            form_data.append('imageUrl', imageUrl);
        }
        if(link){
            form_data.append('link', link);
        }
        if(doing_duration){
            form_data.append('doing_duration', doing_duration);
        }
       
        if($('#need_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/need/',
                method: 'POST',
                cache: false,
                processData: false,
                contentType: false,
                data: form_data,
                beforeSend: function() {
                    return confirm("You are about to add new need.\nAre you sure?");                
                },
                success: function(data)  {
                    // alert("Success\n" + JSON.stringify(data));   //prints the new need added
                    alert("Success\nNeed added successfully!");
                    location.reload(true);
                },
                error: function(data) {
                    console.log(data);
                    bootbox.alert({
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
                    });
                }
            })
        }
    })


    // Confirm a need
    $('#needList').on('click' , '.confirmBtn' , function(e){
        e.preventDefault();
        var needId = $(this).parent().attr('id');
        console.log(needId);

        $.ajax({
            url: SAYApiUrl + '/need/confirm/needId=' + needId,
            method: 'PATCH',

            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("You are about to confirm the need.\nAre you sure?");
            },
            success: function(data) {
                alert("Success\n" + JSON.stringify(data.message));
                // location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: errorTitle(),
                    message: errorContent(data.responseJSON.message),
                });
            }
        })

    })


    // Edit a need
    $('#needList').on('click' , '.editBtn' , function(e){
        e.preventDefault();
        $('.static').val('');

        $('#sendNeedData').attr("disabled" , true);
        $('#child_id').attr("disabled" , true);
        $('#pre_need').hide();

        edit_needId = $(this).parent().attr('id');

        // get the need's data to the form
        $.ajax({
            url: SAYApiUrl + '/need/needId=' + edit_needId,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#need_form_preloader').show();
            },
            success: function(data) {
                var name_translations = data['name_translations'];
                var description_translations = data['description_translations'];

                $('#child_id').val(data['child_id']).change();
                $('#need_name').val(name_translations.en);
                $('#need_name_fa').val(name_translations.fa);
                $('#need_category').val(data['category']).change();
                $('#need_cost').val(data['pretty_cost']);
                $('#need_details').val(data['details']);
                $('#need_informations').val(data['informations']);
                $('#need_description').val(description_translations.en);
                $('#need_description_fa').val(description_translations.fa);
                $('#need_type').val(data['type']).change();
                $('#direct_link').val(data['link']);
                $('#need_doing_duration').val(data['doing_duration']);
                $('#is_urgent').val(data['isUrgent']).change();

                $('#need_form_preloader').hide();
            },
            error: function() {
                console.log(data.responseJSON.message);
            }
        })
    })

    // confirm Edit need
    $('#editNeedData').on('click' , function(e) {
        e.preventDefault();

        console.log("edit need " + edit_needId);

        // getting data from html form

        var imageUrl = $('#need_icon')[0].files[0];
        var category = $('#need_category').val();
        var cost = $('#need_cost').val().replaceAll(',','');
        var details = $('#need_details').val();
        var informations = $('#need_informations').val();
        var type = $('#need_type').val();
        var doing_duration = $('#need_doing_duration').val();
        var isUrgent = $('#is_urgent').val();
        var name_translations = JSON.stringify({
            en: $('#need_name').val(),
            fa: $('#need_name_fa').val(),
        });
        var description_translations = JSON.stringify({
            en: $('#need_description').val(),
            fa: $('#need_description_fa').val(),
        });

        var link = $('#direct_link').val();

        // append datas to a Form Data
        var form_data = new FormData();
        form_data.append('name_translations', name_translations);
        form_data.append('description_translations', description_translations);
        if(imageUrl) {
            form_data.append('imageUrl', imageUrl);
        }
        if(category) {
            form_data.append('category', category);
        }
        if(cost) {
            form_data.append('cost', cost);
        }
        form_data.append('details', details);
        form_data.append('informations', informations);
        if(type) {
            form_data.append('type', type);
        }
        if(isUrgent) {
            form_data.append('isUrgent', isUrgent);
        }
        if(link){
            form_data.append('link', link);
        }
        if(doing_duration){
            form_data.append('doing_duration', doing_duration);
        }
        console.log(form_data);

        //remove required rules of all fields
        $('#need_form select').each(function() {
            $(this).rules('remove', 'required');
        })
        //TODO: After fixing the pre-need icon problem, the required validation of icon input should be remove here.
        
        // update the need with new data in the form
        if($('#need_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/need/update/needId=' + edit_needId,
                method: 'PATCH',
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                    return confirm("You are about to edit the need.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nNeed " + edit_needId + " updated successfully\n" + JSON.stringify(data.message));
                    location.reload(true);
                },
                error: function(data) {
                    bootbox.alert({
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
                    });
                }

            })  //end of Update ajax
        }

    })  //end of 'confirm edit' function

    // Needs Receipt
    $('#needList').on('click', '.receiptBtn', function(e) {
        e.preventDefault();
        $('.static').val('');
        $('#editReceipt').hide();
        $('#addReceipt').show();

        $('#r_child_id').attr('disabled', true);
        $('#r_need_name_fa').attr('disabled', true);

        edit_needId = $(this).parent().attr('id');

        $.ajax({
            url: SAYApiUrl + '/need/needId=' + edit_needId,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#need_form_preloader').show();
            },
            success: function(data) {
                var name_translations = data['name_translations'];

                $('#r_child_id').val(data['child_id']).change();
                $('#r_need_name_fa').val(name_translations.fa);
                
                $('#need_form_preloader').hide();
            },
            error: function() {
                console.log(data.responseJSON.message);
            }
        })

        showNeedReceipt(edit_needId);
    })

    // Add receipt for needs
    $('#addReceipt').on('click', function(e) {
        e.preventDefault();

        var receipts = $('#r_need_receipts')[0].files[0];
        var code = $('#r_receipt_code').val();
        var title = $('#r_receipt_title').val();
        var description = $('#r_receipt_description').val();

        // append datas to a Form Data
        var form_data = new FormData();
        form_data.append('attachment', receipts);
        if (code) {
            form_data.append('code', code);
        }
        if (title) {
            form_data.append('title', title);
        }
        if (description) {
            form_data.append('description', description);
        }

        $('#r_need_receipts').rules('add', 'required'); // Add attachment required rule in case after edit
        $('#r_receipt_title').rules('add', 'required'); // Add title required rule in case after edit

        if ( $('#receipt_form').valid() ) {
            $("div.alert").hide();

            $.ajax({
                url: `${SAYApiUrl}/needs/${edit_needId}/receipts`,
                method: 'POST',
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                    $('#need_form_preloader').show();
                    return confirm("You are about to add receipts to the need.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nThe receipts added to need: " + edit_needId + "\n" + JSON.stringify(data.message));
                    $('.static').val('');
                    $('#need_form_preloader').hide();
                    showNeedReceipt(edit_needId);
                },
                error: function(data) {
                    $('#need_form_preloader').hide();
                    bootbox.alert({
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
                    });
                }
            })
        }

    })

    // Delete receipt from a need
    $('#need_receipts').on('click', '.delReceipt', function(e) {
        e.preventDefault();
        var receiptId = $(this).parent().attr('id');

        delNeedReceiptById(edit_needId, receiptId);
    })

    // Edit receipt
    $('#need_receipts').on('click', '.editReceipt', function(e) {
        e.preventDefault();
        $('#r_receipt_code').attr('disabled', true);
        $('#addReceipt').hide();
        $('#editReceipt').show();
        $('.static').val('');

        edit_receiptId = $(this).parent().attr('id');
        $('#need_form_preloader').show();
        
        getReceiptById(edit_receiptId, function(output) {
            $('#r_receipt_code').val(output['code']);
            $('#r_receipt_title').val(output['title']);
            $('#r_receipt_description').val(output['description']);
            $('#need_form_preloader').hide();
        })
    })

    // confirm Edit receipt
    $('#editReceipt').on('click', function(e) {
        e.preventDefault();
        var receipts = $('#r_need_receipts')[0].files[0];
        var title = $('#r_receipt_title').val();
        var description = $('#r_receipt_description').val();

        // append datas to a Form Data
        var form_data = new FormData();
        if(receipts) {
            form_data.append('attachment', receipts);
        }
        if (title) {
            form_data.append('title', title);
        }
        if (description) {
            form_data.append('description', description);
        }

        $('#r_need_receipts').rules('remove', 'required'); // Remove attachment required rule
        $('#r_receipt_title').rules('remove', 'required'); // Remove title required rule

        if ( $('#receipt_form').valid() ) {
            $("div.alert").hide();

            $.ajax({
                url: `${SAYApiUrl}/receipts/${edit_receiptId}`,
                method: 'PATCH',
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                    return confirm("You are about to edit the receipt.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nReceipt " + edit_receiptId + " updated successfully");
                    $('.static').val('');
                    $('#addReceipt').show();
                    $('#editReceipt').hide();
                    $('#r_receipt_code').attr('disabled', false);
                    showNeedReceipt(edit_needId);
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
    
    // Delete a need
    $('#needList').on('click', '.deleteBtn' , function(e){
        e.preventDefault();
        var needId = $(this).parent().attr('id');
        console.log(needId);

        $.ajax({
            url: SAYApiUrl + '/need/delete/needId=' + needId,
            method: 'PATCH',

            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("You are about to DELETE the need.\nAre you sure?");
            },
            success: function(data) {
                alert("Success\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: errorTitle(),
                    message: errorContent(data.responseJSON.message),
                });
            }
        })
    })

})
