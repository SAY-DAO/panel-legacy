$(document).ready(function(){
    isAthorized();
    hasPrivilege();

    var edit_needId = -1;    

    // Get Children Needs by child id

    var keys = ['id' , 'child_id' , 'ChildName' , 'name' , 'imageUrl' , 'cost' , 'paid' , 'progress' , 'status' , 'type' , 'details' , 'isUrgent' , 'category' , 'description' , 'descriptionSummary' , 'doing_duration' , 'affiliateLinkUrl' , 'link' , 'receipts' , 'createdAt' , 'isConfirmed' , 'confirmDate' , 'lastUpdate']

    $('#child_need_select').change(function() {
        var selected_child = $(this).val();
        $.ajax({
            url: SAYApiUrl + '/child/need/childId=' + selected_child + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin' : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
            success: function(data) {
                console.log('option:' + selected_child);
                // console.log(data);
                $.each(data, function(key, value){
                    var needId = value[keys[0]];
                    var confirmStatus = -1;
                    var needType = -1;
    
                    // first td for row count numbers, second td for operational buttons
                    var query = '<tr>\
                    <td>' + $('tr').length + '</td>\
                    <td id="' + needId + '">\
                    <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                    <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                    <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                    </td>';
                    for(var i=2 ; i < keys.length ; i++){
                        
                        if(value[keys[i]] == null){
                            value[keys[i]] = nullValues();
                        }
                        
                        if (keys[i] == 'imageUrl') {
                            value[keys[i]] = getImgFile(value[keys[i]]);
                        }

                        // if (keys[i] == 'affiliateLinkUrl') {
                        //     value[keys[i]] = linkTo(value[keys[i]]);
                        // }

                        // if (keys[i] == 'receipts') {
                        //     if(value[keys[i]] != null){
                        //         value[keys[i]] = getImgFile(value[keys[i]]);
                        //     }
                        // }

                        if (keys[i] == 'cost' || keys[i] == 'paid') {
                            value[keys[i]] = value[keys[i]] + ' Toman'
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
                            needType = value[keys[i]];
                            console.log("needType: ", needType);
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
                                value[keys[i]] = needInProgress('Almost there');
                            }
                            if(value[keys[i]] == 2){
                                value[keys[i]] = doneNeed('One more Done!');
                            }
                            // }else if(value[keys[i]] == 3 && needType == 0){
                            //     console.log(value[keys[i]]);
                            //     value[keys[i]] = 'NGO received the money.';
                            // }else if(value[keys[i]] == 4 && needType == 0){
                            //     value[keys[i]] = 'Service avalable for the child.';
                            // }else if(value[keys[i]] == 3 && needType == 1){
                            //     value[keys[i]] = 'Need purchased.';
                            // }else if(value[keys[i]] == 4 && needType == 1){
                            //     value[keys[i]] = 'NGO received the Need.';
                            // }else if(value[keys[i]] == 5 && needType == 1){
                            //     value[keys[i]] = 'Delivered to the child.';
                            // }


                            // if(needType == 0){
                            //     if(value[keys[i]] == 3){
                            //         value[keys[i]] = 'NGO received the money.';
                            //     }
                            //     if(value[keys[i]] == 4){
                            //         value[keys[i]] = 'Service avalable for the child.';
                            //     }
                            // }
                            // if(needType == 1){
                            //     if(value[keys[i]] == 3){
                            //         value[keys[i]] = 'Need purchased.';
                            //     }
                            //     if(value[keys[i]] == 4){
                            //         value[keys[i]] = 'NGO received the Need.';
                            //     }
                            //     if(value[keys[i]] == 5){
                            //         value[keys[i]] = 'Delivered to the child.';
                            //     }
                            // }
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

                        query += '<td>' + value[keys[i]] + '</td>';
                    }
                    query += '</tr>';
                    $('#needList').append(query);
                    hasPrivilege();

                    // disable confirm button if the need has confirmed already!
                    if(confirmStatus == 1){
                        $('#' + needId).find('.confirmBtn').prop("disabled", true);
                    }
                })
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
        $('#needList').empty();
    })


    // get Pre-defined needs of children in need forms drop down

    $.ajax({
        url: SAYApiUrl + '/child/need/childId=104&confirm=2',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Athorization': $.cookie('access_token')    // check if authorize for this action
        },
        success: function(data) {
            // console.log("predefined needs", data);

            $.each(data, function(key, value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[3]] + '</option>';
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
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
            success: function(data) {
                // console.log(data);

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
                // $('#need_icon').val(need_icon);

                // need_icon.addEventListener('loadImage', function() {
                //     $('#need_icon').val(need_icon);
                // }, false)
                
                // console.log("icon: ", $('#need_icon').val());

            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
    })


    // Add new Need

    $('#sendNeedData').on('click' , function(e){
        e.preventDefault();

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
        // if($('#is_urgent').is(":checked")){
        //     isUrgent = true;
        // }else{
        //     isUrgent = false;
        // }

        var affiliateLinkUrl = $('#affiliate_link').val();
        var link = $('#link').val();
        var receipts = $('#need_receipts')[0].files[0];

        var form_data = new FormData();
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
        console.log(form_data);
        
        $.ajax({
            url: SAYApiUrl + '/need/add/childId=' + childId,
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            beforeSend: function() {
                return confirm("You are about to add new need.\nAre you sure?");                
            },
            success: function(data)  {
                // console.log(data);
                // alert("Success\n" + JSON.stringify(data));
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
    })

    // Confirm a need

    $('#needList').on('click' , '.confirmBtn' , function(e){
        e.preventDefault();
        var needId = $(this).parent().attr('id');
        var childId = $('#child_need_select').val();
        console.log(needId);

        $.ajax({
            url: SAYApiUrl + '/need/confirm/needId=' + needId + '&socialWorkerId=10&childId=' + childId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
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
            headers: {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
            success: function(data) {
                // console.log(data);

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
        // if($('#is_urgent').is(":checked")){
        //     isUrgent = true;
        // }else{
        //     isUrgent = false;
        // }
        var affiliateLinkUrl = $('#affiliate_link').val();
        var link = $('#link').val();
        var receipts = $('#need_receipts')[0].files[0];

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
        console.log(form_data);

        // update the need with new data in the form
        $.ajax({
            url: SAYApiUrl + '/need/update/needId=' + edit_needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl
            },
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

    })  //end of 'confirm edit' function


    // Delete a need

    $('#needList').on('click', '.deleteBtn' , function(e){
        e.preventDefault();
        var needId = $(this).parent().attr('id');
        console.log(needId);

        $.ajax({
            url: SAYApiUrl + '/need/delete/needId=' + needId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
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
