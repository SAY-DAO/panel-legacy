$(document).ready(function(){
    var keys = ['id' , 'generatedCode' , 'firstName' , 'lastName' , 'userName' , 'id_type' , 'id_ngo' , 'birthCertificateNumber' , 'city' , 'country' , 'idNumber', 'idCardUrl' , 'passportNumber' , 'passportUrl' , 'gender' , 'birthDate' , 'phoneNumber' , 'emergencyPhoneNumber' , 'emailAddress' , 'telegramId' , 'postalAddress' , 'avatarUrl' , 'currentChildCount', 'currentNeedCount' , 'bankAccountNumber' , 'bankAccountShebaNumber' , 'bankAccountCardNumber' , 'registerDate' , 'lastLoginDate' , 'lastUpdateDate']
    $.ajax({
        url: SAYApiUrl + '/socialWorker/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl
        },
        success: function(data) {
            console.log(data);

            $.each(data , function(key , value){
                var socialworkerId = value[keys[0]];

                var query = '<tr><td id="' + socialworkerId + '"><button type="submit" class="btn btn-embossed btn-dark btn-block btn-sm confirmBtn">Confirm</button><button class="btn btn-embossed btn-dark btn-block btn-sm editBtn" onclick="editScroll()">Edit</button><button class="btn btn-embossed btn-dark btn-block btn-sm" disabled>Delete</button></td>';
                for(var i = 1 ; i < keys.length ; i++){

                    if (value[keys[i]] == null) {
                        value[keys[i]] = 'Not entered';
                    }

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

                    if (keys[i] == 'gender') {
                        if (value[keys[i]] == false) {
                            value[keys[i]] = 'Female';
                        }
                        if (value[keys[i]] == true) {
                            value[keys[i]] = 'Male';
                        }
                    }

                    if (keys[i] == 'idCardUrl' || keys[i] == 'passportUrl' || keys[i] == 'avatarUrl'){
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    if (keys[i] == 'id_type') {
                        if(value[keys[i]] == 1){
                            value[keys[i]] = 'Super admin';
                        }
                        if(value[keys[i]] == 2){
                            value[keys[i]] = 'Social worker';
                        }
                        if(value[keys[i]] == 3){
                            value[keys[i]] = 'Coordinator';
                        }
                        if(value[keys[i]] == 4){
                            value[keys[i]] = 'NGO supervisor';
                        }
                        if(value[keys[i]] == 5){
                            value[keys[i]] = 'SAY supervisor';
                        }
                        if(value[keys[i]] == 6){
                            value[keys[i]] = 'admin';
                        }
                    }

                    if (keys[i] == 'id_ngo') {
                        if(value[keys[i]] == 1){
                            value[keys[i]] = 'Noora';
                        }
                        if(value[keys[i]] == 2){
                            value[keys[i]] = 'Mehr-o-Mah';
                        }
                        if(value[keys[i]] == 3){
                            value[keys[i]] = 'SAY';
                        }
                    }

                    query += '<td>' + value[keys[i]] + '</td>';
                }
                query+= '</tr>';
                $('#socialWorkerList').append(query);
            })
            
        },
        error: function(data) {
            console.log(data);
        }
})



    // Adding new Social worker

    $('#sendSocialWorkerData').on('click' , function(e){
        e.preventDefault();

        // recieving data from html form
        var firstName = $('#social_worker_first_name').val();
        var lastName = $('#social_worker_last_name').val();
        var id_type = $('#social_worker_type').val();
        var id_ngo = $('#social_worker_ngo').val();
        var birthCertificateNumber = $('#social_worker_certificate_number').val();
        var country = $('#social_worker_country').val();
        var city = $('#social_worker_city').val();
        var idNumber = $('#social_worker_id_number').val();
        var passportNumber = $('#social_worker_passport_number').val();
        var gender = $('#social_worker_gender').val();
        var birthDate = $('#social_worker_birth_date').val();
        var phoneNumber = $('#social_worker_phone_number').val();
        var emergencyPhoneNumber = $('#social_worker_emergency_phone_number').val();
        var emailAddress = $('#social_worker_email_address').val();
        var telegramId = $('#social_worker_telegram_id').val();
        var postalAddress = $('#social_worker_postal_address').val();
        var bankAccountNumber = $('#social_worker_bank_account_number').val();
        var bankAccountShebaNumber = $('#social_worker_bank_account_sheba_number').val();
        var bankAccountCardNumber = $('#social_worker_bank_account_card_number').val();

        var form_data = new FormData();
        if($('#social_worker_id_card')[0].files[0]){        
            form_data.append('idCardUrl', $('#social_worker_id_card')[0].files[0]);
        }

        if($('#social_worker_passport')[0].files[0]){
            form_data.append('passportUrl', $('#social_worker_passport')[0].files[0]);
        }

        form_data.append('avatarUrl', $('#social_worker_avatar')[0].files[0]);

        if(firstName){
            form_data.append('firstName', firstName);
        }

        form_data.append('lastName', lastName);
        form_data.append('id_type', id_type);
        form_data.append('id_ngo', id_ngo);

        if(birthCertificateNumber){        
            form_data.append('birthCertificateNumber', birthCertificateNumber);
        }

        if(country){        
            form_data.append('country', country);
        }

        if(city){        
            form_data.append('city', city);
        }

        form_data.append('idNumber', idNumber);

        if(passportNumber){        
            form_data.append('passportNumber', passportNumber);
        }

        form_data.append('gender', gender);

        if(birthDate){        
            form_data.append('birthDate', birthDate);
        }

        form_data.append('phoneNumber', phoneNumber);
        form_data.append('emergencyPhoneNumber', emergencyPhoneNumber);
        form_data.append('emailAddress', emailAddress);
        form_data.append('telegramId', telegramId);

        if(postalAddress){        
            form_data.append('postalAddress', postalAddress);
        }

        if(bankAccountNumber){        
            form_data.append('bankAccountNumber', bankAccountNumber);
        }

        if(bankAccountShebaNumber){        
            form_data.append('bankAccountShebaNumber', bankAccountShebaNumber);
        }

        if(bankAccountCardNumber){        
            form_data.append('bankAccountCardNumber', bankAccountCardNumber);
        }

        console.log(form_data);

        $.ajax({
            url: SAYApiUrl + '/socialWorker/add',
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl
            },
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            success: function(data) {
                console.log(data);
                alert('Success');
                location.reload();
            },
            error: function(data) {
                console.log(data);
                alert('Error!');
            }
        })
        
    })



    // Edit a social worker

    $('#socialWorkerList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendSocialWorkerData').attr("disabled" , true);
        var socialworkerId = $(this).parent().attr('id');
        console.log(socialworkerId);

        // get the need's data to the form
        $.ajax({
            url: SAYApiUrl + '/socialWorker/socialWorkerId=' + socialworkerId,
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin'  : baseUrl
            },
            success: function(data) {
                console.log(data);
                $('#social_worker_first_name').val(data['firstName']);
                $('#social_worker_last_name').val(data['lastName']);
                $('#social_worker_type').val(data['id_type']);
                $('#social_worker_ngo').val(data['id_ngo']);
                $('#social_worker_certificate_number').val(data['birthCertificateNumber']);
                $('#social_worker_country').val(data['country']);
                $('#social_worker_city').val(data['city']);
                $('#social_worker_id_number').val(data['idNumber']);
                $('#social_worker_passport_number').val(data['passportNumber']);
                $('#social_worker_gender').val(data['gender']);
                $('#social_worker_birth_date').val(data['birthDate']);
                $('#social_worker_phone_number').val(data['phoneNumber']);
                $('#social_worker_emergency_phone_number').val(data['emergencyPhoneNumber']);
                $('#social_worker_email_address').val(data['emailAddress']);
                $('#social_worker_telegram_id').val(data['telegramId']);
                $('#social_worker_bank_account_number').val(data['bankAccountNumber']);
                $('#social_worker_bank_account_sheba_number').val(data['bankAccountShebaNumber']);
                $('#social_worker_bank_account_card_number').val(data['bankAccountCardNumber']);
                $('#social_worker_current_username').val(data['userName']);
                $('#social_worker_current_child_count').val(data['currentChildCount']);
                $('#social_worker_current_need_count').val(data['currentNeedCount']);

            },
            error: function() {
                console.log(data.responseJSON.message);
            }
        })

        // $('#editNeedData').on('click' , function(e) {
        //     e.preventDefault();

        //     // getting data from html form

        //     var name = $('#need_name').val();
        //     var imageUrl = $('#need_icon')[0].files[0];
        //     var category = $('#need_category').val();
        //     var cost = $('#need_cost').val();
        //     var description = $('#need_description').val();
        //     var descriptionSummary = $('#need_description_summary').val();
        //     var type = $('#need_type').val();
        //     var doing_duration = $('#need_doing_duration').val();
        //     var isUrgent = '';
        //     if($('#is_urgent').is(":checked")){
        //         isUrgent = true;
        //     }else{
        //         isUrgent = false;
        //     }
        //     var affiliateLinkUrl = $('#affiliate_link').val();
        //     var receipts = $('#need_receipts')[0].files[0];

        //     // append datas to a Form Data
        //     var form_data = new FormData();
        //     if(imageUrl) {
        //         form_data.append('imageUrl', imageUrl);
        //     }
        //     if(name) {
        //         form_data.append('name', name);
        //     }
        //     if(category) {
        //         form_data.append('category', category);
        //     }
        //     if(cost) {
        //         form_data.append('cost', cost);
        //     }
        //     if(description) {
        //         form_data.append('description', description);
        //     }
        //     if(descriptionSummary) {
        //         form_data.append('descriptionSummary', descriptionSummary);
        //     }
        //     if(type) {
        //         form_data.append('type', type);
        //     }
        //     if(isUrgent) {
        //         form_data.append('isUrgent', isUrgent);
        //     }
        //     if(affiliateLinkUrl){
        //         form_data.append('affiliateLinkUrl', affiliateLinkUrl);
        //     }
        //     if(receipts){
        //         form_data.append('receipts', receipts);
        //     }
        //     if(doing_duration){
        //         form_data.append('doing_duration', doing_duration);
        //     }
        //     console.log(form_data);

        //     // update the need with new data in the form
        //     $.ajax({
        //         url: SAYApiUrl + '/update/socialWorkerId=' + socialworkerId,
        //         method: 'PATCH',
        //         headers : {
        //             'Access-Control-Allow-Origin'  : baseUrl
        //         },
        //         cache: false,
        //         processData: false,
        //         contentType: false,
        //         dataType: 'json',
        //         data: form_data,
        //         beforeSend: function(){
        //             return confirm("You are about to edit the need.\nAre you sure?");
        //         },
        //         success: function(data) {
        //             alert("Success\nNeed updated successfully\n" + JSON.stringify(data.message));
        //             location.reload();
        //         },
        //         error: function(data) {
        //             bootbox.alert({
        //                 title: "Error!",
        //                 message: data.responseJSON.message,
        //             });
        //         }

        //     })  //end of Update ajax

        // })  //end of 'get the need's data to the form' function

    })


})


//Social worker drop down field in forms

$(document).ready(function(){
    var keys = ['id' , 'userName' , 'firstName' , 'lastName']

    // getting Social workesr's id and name from DB
    
    $.ajax({
        url: SAYApiUrl + '/socialWorker/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl
        },
        success: function(data) {
            console.log(data);
            $.each(data , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + ' | ' + value[keys[2]] + ' ' + value[keys[3]] + '</option>';
                $('#social_worker_id').append(query);
                // console.log("Social worker field query:" + query);
            })
        },
        error: function(data) {
            console.log(data);
        }
    })

})
