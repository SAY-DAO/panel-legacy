$(document).ready(function(){
    // // This part feeded in child_dataServe.js

    // var keys = ['id' , 'name' , 'category' , 'imageUrl' , 'description' , 'type' , 'cost' , 'affiliateLinkUrl' , 'isUrgent']

    // // getting all Need data from DB

    // $.ajax({
    //     url: 'http://api.sayapp.company/api/v2/need/all/confirm=2',
    //     method: 'GET',
    //     dataType: 'json',
    //     headers : {
    //         'Access-Control-Allow-Origin'  : '*'
    //     },
    //     success: function(data) {
    //         console.log(data);
    //         $.each(data , function(key ,value){
    //             var query = '<tr>';
    //             for(var i = 0 ; i < keys.length ; i++){
    //                 query += '<td>' + value[keys[i]] + '</td>';
    //             }
    //             query+= '</tr>';
    //             $('#needList').append(query);
    //         })
    //     },
    //     error: function(data) {
    //         console.log(data);
    //     }
    // })


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
            url: 'http://api.sayapp.company/api/v2/need/add/childId=' + childId,
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : 'http://www.sayapp.company'
            },
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            success: function(data)  {
                console.log(data);
                alert("Success\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                console.log(data);
                alert('Error!\n' + data);
            }
        })
    })

})
