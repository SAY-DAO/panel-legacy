$(document).ready(function(){
    isAuthorized();
    hasPrivilege();

    // Cost field comma and number
    $('#need_cost').on('keyup', function() {
        var n = parseInt($(this).val().replace(/\D/g,''),10);
        $(this).val(n.toLocaleString());
    })
    // needs form validation
    $('#need_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            child_id: {
                required: true
            },
            need_name: {
                required: true
            },
            need_category: {
                required:true
            },
            need_cost: {
                required: true,
                number: true
            },
            "need_icon[]": {
                // required: true, // TODO: temporarily disabled for problem in adding by pre-need
                extension: "jpg,png,jpeg",
                filesize: 1    // MB
            },
            "need_receipts[]": {
                filesize: 3    // MB
            },
            need_type: {
                required: true
            },
            affiliate_link: {
                url: true
            },
            direct_link: {
                url: true
            },
            need_doing_duration: {
                number: true
            },
            need_description: {
                required: true
            },
            need_description_summary: {
                required: true
            }
        },
        messages: {
            child_id: {
                required: "انتخاب کودک ضروری است."
            },
            need_name: {
                required: "وارد کردن نام نیاز ضروری است."
            },
            need_category: {
              required: "انتخاب دسته‌بندی نیاز ضروری است."
            },
            need_cost: {
                required: "وارد کردن هزینه نیاز ضروری است.",
                number: "لطفا فقط عدد وارد کنید."
            },
            "need_icon[]": {
                // required: "انتخاب آیکون نیاز ضروری است.",    // TODO: temporarily disabled for problem in adding by pre-need
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            "need_receipts[]": {
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            need_type: {
                required: "انتخاب نوع نیاز ضروری است."
            },
            affiliate_link: {
                url: "اشتباه شد."
            },
            direct_link: {
                url: "اشتباه شد."
            },
            need_doing_duration: {
                number: "لطفا فقط عدد وارد کنید."
            },
            need_description: {
                required: "وارد کردن شرح نیاز ضروری است."
            },
            need_description_summary: {
                required: "وارد کردن خلاصه شرح نیاز ضروری است."
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

    var edit_needId = -1;    

    var keys = ['id' , 'child_id' , 'name' , 'name_fa' , 'title' , 'imageUrl' , 'cost' , 'paid' , 'progress' , 'status' , 'type' , 'details' , 'isUrgent' , 'category' , 'description' , 'description_fa' , 'descriptionSummary' , 'descriptionSummary_fa' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'receipts' , 'createdAt' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'lastUpdate']

    // Get Children Needs by child id
    $('#child_need_select').change(function() {
        var selected_child = $(this).val();
        $.ajax({
            url: SAYApiUrl + '/child/childId=' + selected_child + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#needs_preloader').show();
            },
            success: function(data) {
                $('.total_count').empty();
                console.log('option:' + selected_child);
                var row_index = 1;
                var sayName = data['sayName'];
                data = data['needs'];
                $.each(data, function(key, value){
                    var needId = value['id'];
                    var confirmStatus = -1;
                    var needType = value['type'];
    
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

                        if(keys[i] == 'confirmDate' || keys[i] == 'createdAt' || keys[i] == 'lastUpdate') {
                            value[keys[i]] = localDate(value[keys[i]]);
                        }
 
                        if(value[keys[i]] == null){
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

    // Get Needs by confirm status and ngo_id
    $('.need_filter').change(function() {
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

                        if(keys[i] == 'confirmDate' || keys[i] == 'createdAt' || keys[i] == 'lastUpdate') {
                            value[keys[i]] = localDate(value[keys[i]]);
                        }
 
                        if(value[keys[i]] == null){
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
        url: SAYApiUrl + '/child/childId=104&confirm=2',  // TODO: Pri Defined needs
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // console.log("predefined needs", data);
            data = data['needs']
            $.each(data, function(key, value){
                var title = value['type'] == 0 ? value['details'] : value['title']; // show details for services, and title for products
                var query = '';
                    query += '<option value="' + value['id'] + '">' + value['name'] + ' | ' + value['cost'] + ' | ' + title + '</option>';
                $('#pre_need_id').append(query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    // need form fill out with Pre-defined need data
    $('#pre_need_id').change(function() {
        $('#need_name').prop("disabled", true);
        $('#need_description').prop("disabled", true);
        $('#need_description_summary').prop("disabled", true);
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

                $('#need_name').val(data['name']);
                $('#need_category').val(data['category']).change();
                $('#need_type').val(data['type']).change();
                $('#is_urgent').val(data['isUrgent']).change();
                $('#need_cost').val(data['cost']);
                $('#need_description').val(data['description']);
                $('#need_description_summary').val(data['descriptionSummary']);
                $('#need_details').val(data['details']);
                $('#need_doing_duration').val(data['doing_duration']);
                $('#affiliate_link').val(data['affiliateLinkUrl']);
                $('#direct_link').val(data['link']);
                $('#need_name_fa').val(data['name_fa']);
                $('#need_description_fa').val(data['description_fa']);
                $('#need_description_summary_fa').val(data['descriptionSummary_fa']);

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
        var name = $('#need_name').val();
        var imageUrl = $('#need_icon')[0].files[0];
        var category = $('#need_category').val();
        var cost = $('#need_cost').val();
        var details = $('#need_details').val();
        var description = $('#need_description').val();
        var descriptionSummary = $('#need_description_summary').val();
        var type = $('#need_type').val();
        var doing_duration = $('#need_doing_duration').val();
        var isUrgent = $('#is_urgent').val();        

        var affiliateLinkUrl = $('#affiliate_link').val();
        var link = $('#direct_link').val();
        var receipts = $('#need_receipts')[0].files[0];
        var name_fa = $('#need_name_fa').val();
        var description_fa = $('#need_description_fa').val();
        var descriptionSummary_fa = $('#need_description_summary_fa').val();

        var form_data = new FormData();
        form_data.append('child_id', childId);
        form_data.append('imageUrl', imageUrl);
        form_data.append('name', name);
        form_data.append('category', category);
        form_data.append('cost', cost);
        form_data.append('details', details);
        form_data.append('description', description);
        form_data.append('descriptionSummary', descriptionSummary);
        form_data.append('type', type);
        form_data.append('isUrgent', isUrgent);

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
        if(name_fa){
            form_data.append('name_fa', name_fa);
        }
        if(description_fa){
            form_data.append('description_fa', description_fa);
        }
        if(descriptionSummary_fa){
            form_data.append('descriptionSummary_fa', descriptionSummary_fa);
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
                        title: "Error!",
                        message: data.responseJSON.message,
                    });
                }
            })
        }
    })


    // Confirm a need
    $('#needList').on('click' , '.confirmBtn' , function(e){
        e.preventDefault();
        var needId = $(this).parent().attr('id');
        var childId = $('#child_need_select').val();
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
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }
        })

    })


    // Edit a need
    $('#needList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendNeedData').attr("disabled" , true);
        $('#child_id').attr("disabled" , true);
        $('#pre_need').hide();

        edit_needId = $(this).parent().attr('id');
        console.log(edit_needId);

        // get the need's data to the form
        $.ajax({
            url: SAYApiUrl + '/need/needId=' + edit_needId,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#need_form_preloader').show();
            },
            success: function(data) {
                console.log(data);

                $('#child_id').val(data['child_id']).change();
                $('#need_name').val(data['name']);
                $('#need_category').val(data['category']).change();
                $('#need_cost').val(data['cost']);
                $('#need_details').val(data['details']);
                $('#need_description').val(data['description']);
                $('#need_description_summary').val(data['descriptionSummary']);
                $('#need_type').val(data['type']).change();
                $('#affiliate_link').val(data['affiliateLinkUrl']);
                $('#direct_link').val(data['link']);
                $('#need_doing_duration').val(data['doing_duration']);
                $('#is_urgent').val(data['isUrgent']).change();
                $('#need_name_fa').val(data['name_fa']);
                $('#need_description_fa').val(data['description_fa']);
                $('#need_description_summary_fa').val(data['descriptionSummary_fa']);

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

        var name = $('#need_name').val();
        var imageUrl = $('#need_icon')[0].files[0];
        var category = $('#need_category').val();
        var cost = $('#need_cost').val();
        var details = $('#need_details').val();
        var description = $('#need_description').val();
        var descriptionSummary = $('#need_description_summary').val();
        var type = $('#need_type').val();
        var doing_duration = $('#need_doing_duration').val();
        var isUrgent = $('#is_urgent').val();
        
        var affiliateLinkUrl = $('#affiliate_link').val();
        var link = $('#direct_link').val();
        var receipts = $('#need_receipts')[0].files[0];
        var name_fa = $('#need_name_fa').val();
        var description_fa = $('#need_description_fa').val();
        var descriptionSummary_fa = $('#need_description_summary_fa').val();

        // append datas to a Form Data
        var form_data = new FormData();
        if(imageUrl) {
            form_data.append('imageUrl', imageUrl);
        }
        if(name) {
            form_data.append('name', name);
        }
        if(category) {
            form_data.append('category', category);
        }
        if(cost) {
            form_data.append('cost', cost);
        }
        if(details) {
            form_data.append('details', details);
        }
        if(description) {
            form_data.append('description', description);
        }
        if(descriptionSummary) {
            form_data.append('descriptionSummary', descriptionSummary);
        }
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
        if(name_fa){
            form_data.append('name_fa', name_fa);
        }
        if(description_fa){
            form_data.append('description_fa', description_fa);
        }
        if(descriptionSummary_fa){
            form_data.append('descriptionSummary_fa', descriptionSummary_fa);
        }
        console.log(form_data);

        //remove required rules of all fields
        $('#need_form select').each(function() {
            $(this).rules('remove', 'required');
        })
        $('#need_form input, textarea').each(function() {
            $(this).rules('remove', 'required');
        })
        
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
                        title: "Error!",
                        message: data.responseJSON.message,
                    });
                }

            })  //end of Update ajax
        }

    })  //end of 'confirm edit' function

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
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }
        })
    })

})
