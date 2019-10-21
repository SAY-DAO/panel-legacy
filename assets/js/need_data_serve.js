$(document).ready(function(){

    // Get Children Needs by child id

    var keys = ['id' , 'child_id' , 'ChildName' , 'name' , 'cost' , 'paid' , 'progress' , 'imageUrl' , 'isUrgent' , 'category' , 'type' , 'affiliateLinkUrl' , 'description' , 'descriptionSummary' , 'receipts' , 'createdAt' , 'isConfirmed' , 'confirmDate']

    $('#child_need_select').change(function() {
        var selected_child = $(this).val();
        $.ajax({
            url: SAYApiUrl + '/child/need/childId=' + selected_child + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin' : baseUrl
            },
            success: function(data) {
                console.log('option:' + selected_child);
                console.log(data);
                $.each(data, function(key, value){
                    var needId = value[keys[0]];

                    var query = '<tr><td id="' + needId + '"><button type="submit" class="btn btn-embossed btn-dark btn-block confirmBtn">Confirm</button><button class="btn btn-embossed btn-dark btn-block editBtn">Edit</button><button class="btn btn-embossed btn-dark btn-block" disabled>Delete</button></td>';
                    for(var i=2 ; i < keys.length ; i++){
                        
                        if (keys[i] == 'imageUrl') {
                            value[keys[i]] = getImgFile(value[keys[i]]);
                        }

                        if (keys[i] == 'cost' || keys[i] == 'paid') {
                            value[keys[i]] = value[keys[i]] + ' Toman'
                        }

                        if (keys[i] == 'progress') {
                            value[keys[i]] = value[keys[i]] + '%'
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

                        if (keys[i] == 'type') {
                            if(value[keys[i]] == 0){
                                value[keys[i]] = 'Donate';
                            }
                            if(value[keys[i]] == 1){
                                value[keys[i]] = 'Affiliate';
                            }
                        }

                        if (value[keys[i]] == null) {
                            value[keys[i]] = 'Not entered';
                        }

                        if (keys[i] == 'isConfirmed') {
                            if(value[keys[i]] == false){
                                value[keys[i]] = 'Not confirmed';
                            }
                            if(value[keys[i]] == true){
                                value[keys[i]] = 'Confirmed';
                            }
                        }

                        query += '<td>' + value[keys[i]] + '</td>';
                    }
                    query += '</tr>';
                    $('#needList').append(query);
                })
            },
            error: function(data) {
                console.log(data);
            }
        })
        $('#needList').empty();
    })




    // Add new Need

    $('#sendNeedData').on('click' , function(e){
        e.preventDefault();

        // recieving data from html form
        var childId = $('#child_id').val();
        var name = $('#need_name').val();
        var category = $('#need_category').val();
        var cost = $('#need_cost').val();
        var description = $('#need_description').val();
        var descriptionSummary = $('#need_description_summary').val();
        var type = $('#need_type').val();
        var isUrgent = '';
        if($('#is_urgent').is(":checked")){
            isUrgent = true;
        }else{
            isUrgent = false;
        }

        var affiliateLinkUrl = $('#digikala_affiliate_link').val();

        var form_data = new FormData();
        form_data.append('imageUrl', $('#need_icon')[0].files[0]);
        
        if($('#need_receipts')[0].files[0]){
            form_data.append('receipts', $('#need_receipts')[0].files[0]);
        }

        form_data.append('name', name);
        form_data.append('category', category);
        form_data.append('cost', cost);
        form_data.append('description', description);
        form_data.append('descriptionSummary', descriptionSummary);
        form_data.append('type', type);
        form_data.append('isUrgent', isUrgent);

        if(affiliateLinkUrl){
            form_data.append('affiliateLinkUrl', affiliateLinkUrl);
        }

        console.log(form_data);

        
        $.ajax({
            url: SAYApiUrl + '/need/add/childId=' + childId,
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl
            },
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            success: function(data)  {
                console.log(data);
                alert("Success\n" + JSON.stringify(data));
                location.reload();
            },
            error: function(data) {
                console.log(data);
                alert('Error!\n' + data.responseJSON.message);
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
                'Access-Control-Allow-Origin'  : baseUrl
            },
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("Are you sure?");
            },
            success: function(data) {
                bootbox.alert("Success\n" + JSON.stringify(data.message));
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


    // Edit a need

    $('#needList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendNeedData').attr("disabled" , true);
        var needId = $(this).parent().attr('id');
        console.log(needId);

    })

})
