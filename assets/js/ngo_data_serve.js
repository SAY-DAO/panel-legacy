
// serving data on NGO page

$(document).ready(function(){
    isAthorized();

    var edit_ngoId = -1;

    var keys = ['id' , 'name' , 'country' , 'city' , 'coordinatorId' , 'postalAddress' , 'phoneNumber' , 'emailAddress' , 'website' , 'logoUrl' , 'currentSocialWorkerCount' , 'currentChildrenCount' , 'registerDate' , 'lastUpdateDate']

    // Get all NGO

    $.ajax({
        url: SAYApiUrl + '/ngo/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Athorization': $.cookie('access_token'),    // check if authorize for this action
            'Cache-Control': 'no-cache'
        },
        beforeSend: function() {
            $('#ngo_preloader').show();
        },
        success: function(data) {
            var row_index = 1;

            $.each(data , function(key ,value){
                var ngoId = value[keys[0]];

                // first td for row count numbers, second td for operational buttons
                var query = '<tr>\
                <td>' + row_index + '</td>\
                <td id="' + ngoId + '">\
                <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                <button class="btn btn-embossed btn-danger btn-block btn-sm" disabled>Delete</button>\
                </td>';

                for(var i = 1 ; i < keys.length ; i++){
                    
                    // console.log("ngoSeccess:" + keys[i]);
                   
                    if (keys[i] == 'country'){
                        if(value[keys[i]] == '98'){
                            value[keys[i]] = 'Iran';
                        }
                    }

                    if (keys[i] == 'city'){
                        if(value[keys[i]] == '1'){
                            value[keys[i]] = 'Tehran';
                        }
                        if(value[keys[i]] == '2'){
                            value[keys[i]] = 'Karaj';
                        }
                    }

                    if (keys[i] == 'logoUrl'){
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    // if (keys[i] == 'coordinatorId') {
                    //     value[keys[i]] = 'Sara Mousavi';
                    //     var coordinatorId = value[keys[i]];
                    //     var newValue = [];

                    //     $(document).ready(function(){
                    //         var keys = ['id' , 'firstName' , 'lastName']

                    //         $.ajax({
                    //             url: SAYApiUrl + '/socialWorker/all',
                    //             method: 'GET',
                    //             dataType: 'json',
                    //             headers: {
                    //                 'Access-Control-Allow-Origin'  : baseUrl
                    //             },
                    //             success: function(data) {
                    //                 console.log(data);

                    //                 $.each(data, function(keys, value){

                    //                     for(var j = 0 ; j < keys.length ; j++){

                    //                         if(keys[j] == 'id'){
                    //                             console.log("keys[j]:" + keys[j]);
                    //                             if(value[keys[j]] == coordinatorId){

                    //                                 newValue = value[keys[1]] + ' ' + value[keys[2]];
                    //                                 console.log("new value1:" + newValue);
                    //                             }
                    //                         }
                    //                     }
                    //                 })
                    //             },
                    //             error: function(data) {
                    //                 console.log("error:" + data);
                    //             }
                    //         })
                    //     })

                    //     value[keys[i]] = newValue;
                    //     console.log("new value:" + newValue);

                    // }

                    if (keys[i] == 'phoneNumber') {
                        value[keys[i]] = phoneTo(value[keys[i]]);                       
                    }

                    if (keys[i] == 'emailAddress') {
                        value[keys[i]] = mailTo(value[keys[i]]);                       
                    }

                    // if (keys[i] == 'website') {
                    //     value[keys[i]] = linkTo(value[keys[i]]);                       
                    // }

                    if (value[keys[i]] == null) {
                        value[keys[i]] = nullValues();
                    }
                    
                    query += '<td>' + value[keys[i]] + '</td>';
                }
                query+= '</tr>';
                $('#ngoList').append(query);
                row_index += 1;
            })
            $('#ngo_preloader').hide();
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })


    // Add new NGO

    $('#sendNgoData').on('click' , function(e){
        e.preventDefault();

        // recieving data from html form
        var name = $('#ngo_name').val();
        var country = $('#ngo_country').val();
        var city = $('#ngo_city').val();
        var coordinatorId = $('#coordinator_id').val();
        var postalAddress = $('#ngo_address').val();
        var phoneNumber = $('#ngo_phone_number').val();
        var emailAddress = $('#ngo_email').val();
        var website = $('#ngo_website').val();
        var logoUrl = $('#ngo_logo')[0].files[0];

        var form_data = new FormData();
        form_data.append('logoUrl', logoUrl);
        form_data.append('name', name);
        form_data.append('country', country);
        form_data.append('city', city);
        form_data.append('coordinatorId', coordinatorId);
        form_data.append('postalAddress', postalAddress);
        form_data.append('phoneNumber', phoneNumber);
        form_data.append('emailAddress', emailAddress);
        if(website){
            form_data.append('website', website);
        }

        console.log(form_data);

        
        $.ajax({
            url: SAYApiUrl + '/ngo/add',
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            beforeSend: function(){
                return confirm("You are about to add new NGO.\nAre you sure?");
            },
            success: function(data)  {
                // console.log(data);
                alert('Success');
                location.reload(true);
            },
            error: function(data) {
                console.log(data);
                alert('Error!');
            }
        })
    })


    // Edit a NGO

    $('#ngoList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendNgoData').attr("disabled" , true);

        edit_ngoId = $(this).parent().attr('id');
        console.log(edit_ngoId);

        // get the need's data to the form
        $.ajax({
            url: SAYApiUrl + '/ngo/ngoId=' + edit_ngoId,
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token')    // check if authorize for this action
            },
            beforeSend: function() {
                $('#ngo_form_preloader').show();
            },
            success: function(data) {
                // console.log(data);
                $('#ngo_name').val(data['name']);
                $('#ngo_country').val(data['country']).change();
                $('#ngo_city').val(data['city']).change();
                $('#ngo_address').val(data['postalAddress']);
                $('#ngo_phone_number').val(data['phoneNumber']);
                $('#ngo_email').val(data['emailAddress']);
                $('#ngo_website').val(data['website']);
                $('#coordinator_id').val(data['coordinatorId']).change();
                $('#ngo_current_social_worker_count').val(data['currentSocialWorkerCount']);
                $('#ngo_current_child_count').val(data['currentChildrenCount']);

                $('#ngo_form_preloader').hide();
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
    })

    // confirm Edit NGO
    $('#editNgoData').on('click' , function(e) {
        e.preventDefault();

        console.log("Edit ngo: ", edit_ngoId);

        // getting data from html form
        var name = $('#ngo_name').val();
        var country = $('#ngo_country').val();
        var city = $('#ngo_city').val();
        var postalAddress = $('#ngo_address').val();
        var phoneNumber = $('#ngo_phone_number').val();
        var emailAddress = $('#ngo_email').val();
        var website = $('#ngo_website').val();
        var logoUrl = $('#ngo_logo')[0].files[0];
        var coordinatorId = $('#coordinator_id').val();
        
        // append datas to a Form Data
        var form_data = new FormData();
        if(name){
            form_data.append('name', name);
        }
        if(country){
            form_data.append('country', country);
        }
        if(city){
            form_data.append('city', city);
        }
        if(postalAddress){
            form_data.append('postalAddress', postalAddress);
        }
        if(phoneNumber){
            form_data.append('phoneNumber', phoneNumber);
        }
        if(emailAddress){
            form_data.append('emailAddress', emailAddress);
        }
        if(website){
            form_data.append('website', website);
        }
        if(logoUrl){
            form_data.append('logoUrl', logoUrl);
        }
        if(coordinatorId){
            form_data.append('coordinatorId', coordinatorId);
        }

        console.log(form_data);

        $.ajax({
            url: SAYApiUrl + '/ngo/update/ngoId=' + edit_ngoId,
            method: 'PATCH',
            headers: {
                'Access-Control-Allow-Origin' : baseUrl
            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            beforeSend: function(){
                return confirm("You are about to edit the NGO.\nAre you sure?");
            },
            success: function(data){
                alert("Success\nThe NGO " + edit_ngoId + " updated successfully\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data){
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }
        })  //end of Update ajax
    })  //end of 'confirm edit' function
})



//NGO drop down field in forms

$(document).ready(function(){
    isAthorized();
    
    var keys = ['id', 'name']

    // getting NGO's id and name from DB
    
    $.ajax({
        url: SAYApiUrl + '/ngo/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Athorization': $.cookie('access_token')    // check if authorize for this action
        },
        success: function(data) {
            // console.log(data);
            $.each(data , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + '</option>';
                $('#ngo_id').append(query);
                $('#social_worker_ngo').append(query);
                $('#need_ngo').append(query);
                // console.log("NGO field query:" + query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

})
