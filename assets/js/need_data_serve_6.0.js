$(document).ready(function(){
    isAuthorized();
    hasPrivilege();

    // Reset static fields after refresh
    $('.static').val('');

    // needs form validation
    $('#need_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            child_id: {
                required: true,
            },
            need_name: {
                required: true,
            },
            need_name_fa: {
                required: true,
            },
            need_category: {
                required:true,
            },
            need_cost: {
                required: true,
                number: true,
            },
            "need_icon[]": {
                // required: true, // TODO: temporarily disabled for problem in adding by pre-need
                extension: "jpg,png,jpeg",
                filesize: 1    // MB
            },
            "need_receipts[]": {
                extension: "jpg,png,jpeg,PDF",
                filesize: 3,    // MB
            },
            need_type: {
                required: true,
            },
            affiliate_link: {
                url: true,
            },
            direct_link: {
                url: true,
            },
            need_doing_duration: {
                number: true,
            },
            need_description: {
                required: true,
            },
            need_description_fa: {
                required: true,
            },
        },
        messages: {
            child_id: {
                required: "انتخاب کودک ضروری است.",
            },
            need_name: {
                required: "وارد کردن نام نیاز ضروری است.",
            },
            need_name_fa: {
                required: "وارد کردن نام نیاز ضروری است.",
            },
            need_category: {
              required: "انتخاب دسته‌بندی نیاز ضروری است.",
            },
            need_cost: {
                required: "وارد کردن هزینه نیاز ضروری است.",
                number: "لطفا فقط عدد وارد کنید.",
            },
            "need_icon[]": {
                // required: "انتخاب آیکون نیاز ضروری است.",    // TODO: temporarily disabled for problem in adding by pre-need
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB",
            },
            "need_receipts[]": {
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB",
            },
            need_type: {
                required: "انتخاب نوع نیاز ضروری است.",
            },
            affiliate_link: {
                url: "اشتباه شد.",
            },
            direct_link: {
                url: "اشتباه شد.",
            },
            need_doing_duration: {
                number: "لطفا فقط عدد وارد کنید.",
            },
            need_description: {
                required: "وارد کردن شرح نیاز ضروری است.",
            },
            need_description_fa: {
                required: "وارد کردن شرح نیاز ضروری است.",
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

    $('#receipt_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            "r_need_receipts[]": {
                extension: "jpg,png,jpeg,PDF",
                filesize: 3,    // MB
                required: true,
            },
        },
        messages: {
            "r_need_receipts[]": {
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB",
                required: "رسید را وارد کنید.",
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

    var keys = ['id' , 'child_id' , 'name' , 'name_fa' , 'title' , 'imageUrl' , 'cost' , 'paid' , 'progress' , 'status' , 'type' , 'informations' , 'details' , 'isUrgent' , 'category' , 'description' , 'description_fa' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'receipts' , 'created' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'updated']

    var summaryKeys = ['id', 'isConfirmed', 'imageUrl', 'name', 'title', 'cost', 'status', 'type', 'isUrgent', 'category', 'created']

    // Get Children Needs by child id
    $('#child_need_select').change(function() {
        $('#child_sayName').empty();
        $('#child_avatar').empty();
        $('#childIdentity').removeClass('hidden');

        var selected_child = $(this).val();
        // Fill child avatar and SAY name
        getChildById(selected_child, function(output) {
            $('#child_sayName').text(output.sayName);
            $('#child_avatar').html(getImgFile(output.avatarUrl));
        })

        $.ajax({
            url: `${SAYApiUrl}/child/${selected_child}/needs/summary`,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#needs_preloader').show();
            },
            success: function(data) {
                $('.total_count').empty();
                var total_count = data['total_count'];
                $('.total_count').html(' - ' + total_count + ' تا');
                console.log('option:' + selected_child);
                var row_index = 1;
                
                // Change data to needs
                data = data['needs'];
                $.each(data, function(key, value){
                    var needId = value['id'];
                    var confirmStatus = value['isConfirmed'];
                    var needType = value['type'];
    
                    // first td for row count numbers, second td for operational buttons
                    var query = '<tr>\
                    <td>' + row_index + '</td>\
                    <td id="' + needId + '">\
                        <button class="btn btn-embossed btn-info btn-block btn-sm moreBtn">اطلاعات بیش‌تر</button>\
                        <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                        <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                        <button class="btn btn-embossed btn-warning btn-block btn-sm receiptBtn" onclick="editScroll()">Receipt</button>\
                        <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                    </td>';
                    for(var i=2 ; i < summaryKeys.length ; i++){
                        
                        if ( summaryKeys[i] == 'name') {
                            value[summaryKeys[i]] = rtl(value[summaryKeys[i]]);
                        }

                        if (summaryKeys[i] == 'imageUrl') {
                            value[summaryKeys[i]] = getImgFile(value[summaryKeys[i]]);
                        }

                        if (summaryKeys[i] == 'cost' || summaryKeys[i] == 'paid') {
                            value[summaryKeys[i]] = cost(value[summaryKeys[i]]);
                        }

                        if (summaryKeys[i] == 'type') {
                            if(value[summaryKeys[i]] == 0){
                                value[summaryKeys[i]] = 'Service';
                            }
                            if(value[summaryKeys[i]] == 1){
                                value[summaryKeys[i]] = 'Product';
                            }
                        }

                        if (summaryKeys[i] == 'status') {
                            value[summaryKeys[i]] = generateStatus(value[summaryKeys[i]], needType);
                        }

                        if (summaryKeys[i] == 'details' || summaryKeys[i] == 'title' || summaryKeys[i] == 'informations') {
                            if(Boolean(value[summaryKeys[i]]) != false) {
                                value[summaryKeys[i]] = rtl(value[summaryKeys[i]]);
                            }
                        }

                        if (summaryKeys[i] == 'isUrgent') {
                            if(value[summaryKeys[i]] == false){
                                value[summaryKeys[i]] = 'Not urgent';
                            }
                            if(value[summaryKeys[i]] == true){
                                value[summaryKeys[i]] = 'Urgent';
                            }
                        }

                        if (summaryKeys[i] == 'category') {
                            value[summaryKeys[i]] = generateCategory(value[summaryKeys[i]]);
                        }

                        if(summaryKeys[i] == 'confirmDate' || summaryKeys[i] == 'created' || summaryKeys[i] == 'updated') {
                            value[summaryKeys[i]] = jalaliDate(value[summaryKeys[i]]);
                        }
 
                        if(Boolean(value[summaryKeys[i]]) == false){
                            value[summaryKeys[i]] = nullValues();
                        }

                        query += '<td>' + value[summaryKeys[i]] + '</td>';
                    }
                    query += '</tr>';
                    $('#needList').append(query);
                    hasPrivilege();

                    // disable confirm button if the need has confirmed already!
                    if(confirmStatus){
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

            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
        $('#needList').empty();
    })

    // Get Needs by confirm status and ngo_id
    $('.need_filter').change(function() {
        $('#childIdentity').addClass('hidden');

        var confirm_status = $('#need_confirm_status').val();
        var selected_ngo = $('#need_ngo').val();
        $.ajax({
            url: SAYApiUrl + '/need/all/confirm=' + confirm_status + '?ngoId=' + selected_ngo,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#needs_preloader').show();
            },
            success: function(data) {
                console.log(data);
                var total_count = data['totalCount'];
                $('.total_count').html(' - ' + total_count + ' تا');
                data = data['needs'];
                var row_index = 1;
                $.each(data, function(key, value){
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

                        if (keys[i] == 'receipts') {
                            if(value[keys[i]] != null){
                                value[keys[i]] = getFile(value[keys[i]]);
                            }
                        }

                        if (keys[i] == 'cost' || keys[i] == 'paid') {
                            value[keys[i]] = cost(value[keys[i]]);
                        }

                        if (keys[i] == 'affiliateLinkUrl' || keys[i] == 'link') {
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

                        if(keys[i] == 'confirmDate' || keys[i] == 'created' || keys[i] == 'updated') {
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
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
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
                $('#affiliate_link').val(data['affiliateLinkUrl']);
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
        
        var affiliateLinkUrl = $('#affiliate_link').val();
        var link = $('#direct_link').val();
        var receipts = $('#need_receipts')[0].files[0];

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
        if(affiliateLinkUrl){
            form_data.append('affiliateLinkUrl', affiliateLinkUrl);
        }
        if(link){
            form_data.append('link', link);
        }
        if(receipts){
            form_data.append('receipts', receipts);
        }
        if(doing_duration){
            form_data.append('doing_duration', doing_duration);
        }
       
        console.log(form_data);
        
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
                $('#need_cost').val(toLocale(data['cost']));
                $('#need_details').val(data['details']);
                $('#need_informations').val(data['informations']);
                $('#need_description').val(description_translations.en);
                $('#need_description_fa').val(description_translations.fa);
                $('#need_type').val(data['type']).change();
                $('#affiliate_link').val(data['affiliateLinkUrl']);
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

        var affiliateLinkUrl = $('#affiliate_link').val();
        var link = $('#direct_link').val();
        var receipts = $('#need_receipts')[0].files[0];

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
        if(affiliateLinkUrl){
            form_data.append('affiliateLinkUrl', affiliateLinkUrl);
        }
        if(link){
            form_data.append('link', link);
        }
        if(receipts){
            form_data.append('receipts', receipts);
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

    // Add receipt for needs
    $('#needList').on('click', '.receiptBtn', function(e) {
        e.preventDefault();
        $('.static').val('');

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
    })

    $('#addReceipt').on('click', function(e) {
        e.preventDefault();

        var receipts = $('#r_need_receipts')[0].files[0];

        // append datas to a Form Data
        var form_data = new FormData();
        if (receipts) {
            form_data.append('receipts', receipts);
        }

        if ( $('#receipt_form').valid() ) {
            $.ajax({
                url: SAYApiUrl + '/need/update/needId=' + edit_needId,
                method: 'PATCH',
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                    return confirm("You are about to add receipts to the need.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nThe receipts added to need: " + edit_needId + "\n" + JSON.stringify(data.message));
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

    // Get need by ID
    $('#needList').on('click' , '.moreBtn' , function(e){
        var needId = $(this).parent().attr('id');
        $('#details-modal').modal('show');

        $.ajax({
            url: `${SAYApiUrl}/need/needId=${needId}`,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('.clear').empty();
                $('#get_need_preloader').show();
            },
            success: function(data) {
                var status = data['status'];
                var type = data['type'];
                getSwName(data['confirmUser'], function(output) {
                    $('#confirmUser').html(data['confirmUser'] ? output : nullValues());
                });

                $('#needName, #needName_fa').text(data['name']);
                $('#sayName').text(data['childSayName']);
                $('#needIcon').html(getImgFile(data['imageUrl']));
                $('#needImage').html(getImgFile(data['img']));
                $('#needName_en').text(data['name_translations'].en);
                $('#title').html(data['title'] ? data['title'] : nullValues());
                $('#cost').text(cost(data['cost']));
                $('#paid').text(cost(data['paid']));
                $('#donated').text(cost(data['donated']));
                $('#progress').text(data['progress'] + '%');
                $('#needStatus').html(generateStatus(status, type));
                $('#type').text(data['type_name']);
                $('#category').text(generateCategory(data['category']));
                $('#informations').html(data['informations'] ? data['informations'] : nullValues());
                $('#details').html(data['details'] ? data['details'] : nullValues());
                $('#description_en').text(data['description_translations'].en);
                $('#description').text(data['description']);
                $('#duration').text(data['doing_duration'] + ' روز');
                $('#receipts').html(getFile(data['receipts']));
                $('#created').html(jalaliDate(data['created']));
                $('#confirmDate').html(jalaliDate(data['confirmDate']));
                $('#updated').html(jalaliDate(data['updated']));
                $('#statusUpdated').html(jalaliDate(data['status_updated_at']));
                $('#doneAt').html(jalaliDate(data['doneAt']));
                $('#confirmStatus').text(data['isConfirmed']);
                $('#confirmUser').text(getSwName(data['confirmUser']));
                $('#aff').html(data['affiliateLinkUrl'] ? linkTo(data['affiliateLinkUrl'], 'لینک affiliate خرید کالا') : nullValues());
                $('#direct').html(data['link'] ? linkTo(data['link'], 'لینک مستقیم خرید کالا') : nullValues());
                $('#urgent').text(booleanValue(data['isUrgent']));
                $('#confirmStatus').text(booleanValue(data['isConfirmed']));

                $('#get_need_preloader').hide();
            },
            error: function() {
                console.log(data.responseJSON.message);
            }            
        })
    })

})
