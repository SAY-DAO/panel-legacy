$(document).ready(function(){
    isAuthorized();

    // social worker form validation
    $('#socialworker_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            social_worker_last_name: {
                required: true
            },
            social_worker_type: {
                required: true
            },
            social_worker_ngo: {
                required:true
            },
            social_worker_id_number: {
                required: true
            },
            "social_worker_id_card[]": {
                filesize: 1    // MB
            },
            "social_worker_passport[]": {
                filesize: 1    // MB
            },
            social_worker_gender: {
                required: true
            },
            social_worker_phone_number: {
                required: true,
                digits: true,
                minlength: 8
            },
            social_worker_emergency_phone_number: {
                required: true,
                digits: true,
                minlength: 8
            },
            social_worker_email_address: {
                required: true,
                email: true,
            },            
            "social_worker_avatar[]": {
                required: true,
                extension: "jpg,png,jpeg",
                filesize: 1   // MB
            }
        },
        messages: {
            social_worker_last_name: {
                required: "وارد کردن نام خانوادگی مددکار ضروری است."
            },
            social_worker_type: {
                required: "انتخاب نوع مددکار ضروری است."
            },
            social_worker_ngo: {
              required: "انتخاب انجمن ضروری است."
            },
            social_worker_id_number: {
                required: "وارد کردن کد ملی ضروری است."
            },
            "social_worker_id_card[]": {
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            "social_worker_passport[]": {
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            social_worker_gender: {
                required: "انتخاب جنسیت ضروری است."
            },
            social_worker_phone_number: {
                required: "وارد کردن شماره تماس ضروری است.",
                digits: "شماره تماس تنها می‌تواند شامل اعداد باشد.",
                minlength: "شماره تماس حداقل باید {0} رقم باشد."
            },
            social_worker_emergency_phone_number: {
                required: "وارد کردن شماره تماس ضروری است.",
                digits: "شماره تماس تنها می‌تواند شامل اعداد باشد.",
                minlength: "شماره تماس حداقل باید {0} رقم باشد."
            },
            social_worker_email_address: {
                required: "وارد کردن ایمیل ضروری است.",
                email: "آدرس ایمیل اشتباه است.",
            },
            "social_worker_avatar[]": {
                required: "انتخاب تصویر مددکار ضروری است.",
                extension: "فرمت‌های قابل پذیرش: {0}",
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

    var edit_socialworkerId = -1;

    var keys = ['id' , 'generatedCode' , 'firstName' , 'lastName' , 'userName' , 'avatarUrl' , 'id_type' , 'id_ngo' , 'birthCertificateNumber' , 'city' , 'country' , 'idNumber', 'idCardUrl' , 'passportNumber' , 'passportUrl' , 'gender' , 'birthDate' , 'phoneNumber' , 'emergencyPhoneNumber' , 'emailAddress' , 'telegramId' , 'postalAddress' , 'currentChildCount', 'currentNeedCount' , 'bankAccountNumber' , 'bankAccountShebaNumber' , 'bankAccountCardNumber' , 'registerDate' , 'lastLoginDate' , 'lastUpdateDate']

    // Get all Social workers
    $.ajax({
        url: SAYApiUrl + '/socialWorker/all',
        method: 'GET',
        dataType: 'json',

        beforeSend: function() {
            $('#socialworker_preloader').show();
        },
        success: function(data) {
            // console.log(data);
            var row_index = 1;

            $.each(data , function(key , value){
                var socialworkerId = value[keys[0]];
                var deactivateStatus = !(value['isActive']);

                // first td for row count numbers, second td for operational buttons
                var query = '<tr>\
                <td>' + row_index + '</td>\
                <td id="' + socialworkerId + '">\
                <button type="submit" class="btn btn-embossed btn-inverse btn-block btn-sm deactivateBtn">Deactivate</button>\
                <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                </td>';
                
                for(var i = 1 ; i < keys.length ; i++){

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

                    if (keys[i] == 'phoneNumber') {
                        value[keys[i]] = phoneTo(value[keys[i]]);
                    }

                    if (keys[i] == 'emergencyPhoneNumber') {
                        value[keys[i]] = phoneTo(value[keys[i]]);
                    }

                    if (keys[i] == 'emailAddress') {
                        value[keys[i]] = mailTo(value[keys[i]]);
                    }
                    
                    if (value[keys[i]] == null) {
                        value[keys[i]] = nullValues();
                    }

                    query += '<td>' + value[keys[i]] + '</td>';
                }
                query+= '</tr>';
                $('#socialWorkerList').append(query);

                // Disable deactivation btn if social worker is deactivated
                if (deactivateStatus) {
                    $('#' + socialworkerId).find('.deactivateBtn').prop("disabled", true);
                    $('#' + socialworkerId).find('.deactivateBtn').text("Deactivated");
                }

                row_index += 1;
                
            })

            $('#socialworker_preloader').hide();
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    // Get social workers list for drop down menue in forms
    $.ajax({
        url: SAYApiUrl + '/socialWorker/all',
        method: 'GET',
        dataType: 'json',

        success: function(data) {
            // console.log(data);
            $.each(data , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[4]] + ' | ' + value[keys[2]] + ' ' + value[keys[3]] + '</option>';
                $('#social_worker_id').append(query);
                $('#coordinator_id').append(query);
                // console.log("Social worker field query:" + query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
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
        var idCardUrl = $('#social_worker_id_card')[0].files[0];
        var passportUrl = $('#social_worker_passport')[0].files[0];
        var avatarUrl = $('#social_worker_avatar')[0].files[0];

        var form_data = new FormData();
        if(idCardUrl){        
            form_data.append('idCardUrl', idCardUrl);
        }
        if(passportUrl){
            form_data.append('passportUrl', passportUrl);
        }
        if(firstName){
            form_data.append('firstName', firstName);
        }
        if(birthCertificateNumber){        
            form_data.append('birthCertificateNumber', birthCertificateNumber);
        }
        if(country){        
            form_data.append('country', country);
        }
        if(city){        
            form_data.append('city', city);
        }
        if(passportNumber){        
            form_data.append('passportNumber', passportNumber);
        }
        if(birthDate){        
            form_data.append('birthDate', birthDate);
        }
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
        form_data.append('avatarUrl', avatarUrl);
        form_data.append('lastName', lastName);
        form_data.append('id_type', id_type);
        form_data.append('id_ngo', id_ngo);
        form_data.append('idNumber', idNumber);
        form_data.append('gender', gender);
        form_data.append('phoneNumber', phoneNumber);
        form_data.append('emergencyPhoneNumber', emergencyPhoneNumber);
        form_data.append('emailAddress', emailAddress);
        form_data.append('telegramId', telegramId);

        console.log(form_data);

        if($('#socialworker_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/socialWorker/add',
                method: 'POST',
                cache: false,
                processData: false,
                contentType: false,
                data: form_data,
                beforeSend: function(){
                    return confirm("You are about to add new user.\nAre you sure?");
                },
                success: function(data) {
                    console.log(data);
                    alert("Success\n" + JSON.stringify(data['message']));
                    // alert("Success\n" + data.responseJSON.message);                
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

    // Edit a social worker
    $('#socialWorkerList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendSocialWorkerData').attr("disabled" , true);
        $('#social_worker_current_password').attr("disabled", false);
        $('#social_worker_current_username').attr("disabled", false);
        edit_socialworkerId = $(this).parent().attr('id');
        console.log(edit_socialworkerId);

        // get the need's data to the form
        $.ajax({
            url: SAYApiUrl + '/socialWorker/socialWorkerId=' + edit_socialworkerId,
            method: 'GET',
            dataType: 'json',
 
            beforeSend: function() {
              $('#socialworker_form_preloader').show();  
            },
            success: function(data) {
                // console.log(data);
                $('#social_worker_first_name').val(data['firstName']);
                $('#social_worker_last_name').val(data['lastName']);
                $('#social_worker_type').val(data['id_type']).change();
                $('#social_worker_ngo').val(data['id_ngo']).change();
                $('#social_worker_certificate_number').val(data['birthCertificateNumber']);
                $('#social_worker_country').val(data['country']).change();
                $('#social_worker_city').val(data['city']).change();
                $('#social_worker_id_number').val(data['idNumber']);
                $('#social_worker_passport_number').val(data['passportNumber']);
                $('#social_worker_gender').val(data['gender']).change();
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

                $('#socialworker_form_preloader').hide();
            },
            error: function() {
                console.log(data.responseJSON.message);
            }
        })
    })

    // confirm Edit social worker
    $('#editSocialWorkerData').on('click' , function(e) {
        e.preventDefault();
        
        console.log("edit user " + edit_socialworkerId);

        // getting data from html form

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
        var userName = $('#social_worker_current_username').val();
        var password = $('#social_worker_current_password').val();
        var bankAccountNumber = $('#social_worker_bank_account_number').val();
        var bankAccountShebaNumber = $('#social_worker_bank_account_sheba_number').val();
        var bankAccountCardNumber = $('#social_worker_bank_account_card_number').val();
        var idCardUrl = $('#social_worker_id_card')[0].files[0];
        var passportUrl = $('#social_worker_passport')[0].files[0];
        var avatarUrl = $('#social_worker_avatar')[0].files[0];

        // append datas to a Form Data
        var form_data = new FormData();
        if(firstName) {
            form_data.append('firstName', firstName);
        }
        if(lastName) {
            form_data.append('lastName', lastName);
        }
        if(id_type) {
            form_data.append('id_type', id_type);
        }
        if(id_ngo) {
            form_data.append('id_ngo', id_ngo);
        }
        if(birthCertificateNumber) {
            form_data.append('birthCertificateNumber', birthCertificateNumber);
        }
        if(country) {
            form_data.append('country', country);
        }
        if(city) {
            form_data.append('city', city);
        }
        if(idNumber) {
            form_data.append('idNumber', idNumber);
        }
        if(passportNumber){
            form_data.append('passportNumber', passportNumber);
        }
        if(gender){
            form_data.append('gender', gender);
        }
        if(birthDate){
            form_data.append('birthDate', birthDate);
        }
        if(phoneNumber){
            form_data.append('phoneNumber', phoneNumber);
        }
        if(emergencyPhoneNumber){
            form_data.append('emergencyPhoneNumber', emergencyPhoneNumber);
        }
        if(emailAddress){
            form_data.append('emailAddress', emailAddress);
        }
        if(telegramId){
            form_data.append('telegramId', telegramId);
        }
        if(postalAddress){
            form_data.append('postalAddress', postalAddress);
        }
        if(userName){
            form_data.append('userName', userName);
        }
        if(password){
            form_data.append('password', password);
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
        if(idCardUrl){
            form_data.append('idCardUrl', idCardUrl);
        }
        if(passportUrl){
            form_data.append('passportUrl', passportUrl);
        }
        if(avatarUrl){
            form_data.append('avatarUrl', avatarUrl);
        }
        console.log(form_data);

        //remove required rules of all fields
        $('#socialworker_form select').each(function() {
            $(this).rules('remove', 'required');
        })
        $('#socialworker_form input, textarea').each(function() {
            $(this).rules('remove', 'required');
        })

        // update the need with new data in the form
        if($('#socialworker_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/socialWorker/update/socialWorkerId=' + edit_socialworkerId,
                method: 'PATCH',
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                    return confirm("You are about to edit the user.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nThe user " + edit_socialworkerId + " updated successfully\n" + JSON.stringify(data.message));
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

    // Deactivate a social worker
    $('#socialWorkerList').on('click', '.deactivateBtn', function(e) {
        e.preventDefault();

        var socialworkerId = $(this).parent().attr('id');
        deactivateSW(socialworkerId);
    })

    function deactivateSW(id) {
        console.log(id);

        $.ajax({
            url: SAYApiUrl + '/socialWorker/deactivate/socialWorkerId=' + id,
            method: 'PATCH',
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                var confirmDeactivate = confirm("You are about to DEACTIVATE the penel user #" + id + ".\nAre you sure?");
                if (confirmDeactivate) {
                    $('#content_preloader').show();
                    return confirmDeactivate;
                } else {
                    console.log ("canceled");
                    return confirmDeactivate;
                }
            },
            success: function(data) {
                $('#content_preloader').hide();
                alert("Success\nThe user " + id + " deactivated successfully\n" + JSON.stringify(data.message));
                location.reload(true);
            },
            error: function(data) {
                $('#content_preloader').hide();
                console.log(data.responseJSON.message);
            },
            statusCode: {
                400: function() {
                    $('#content_preloader').hide();
                    var valid = /^[0-9]*$/;
                    var newSwId = prompt("مددکار دارای کودک می‌باشد، ابتدا باید کودکان او به مددکاری دیگر انتقال یابند.\nلطفا آی دی مددکار جدید را وارد نمایید:");
                    if (newSwId) {
                        if (!newSwId.match(valid)) {
                            alert("آی دی تنها می‌تواند شامل اعداد باشد.\n مقدار وارد شده: (" + newSwId + ")");
                        } else {
                            migrateSwChildren(id, newSwId);
                        }
                    } else {
                        console.log ("canceled");
                        return newSwId;
                    }
                },
                404: function() {
                    $('#content_preloader').hide();
                    console.log("not found");
                }
            }
        })
    }

    // Migrate prev social worker to a new one
    function migrateSwChildren(prevSwId, newSwId) {
        var formData = new FormData();
        formData.append('destinationSocialWorkerId', newSwId);
        $.ajax({
            url: SAYApiUrl + '/socialWorker/' + prevSwId + '/children/migrate',
            method: 'POST',
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: formData,
            beforeSend: function() {
                $('#content_preloader').show();
            },
            success: function(data) {
                $('#content_preloader').hide();
                alert("Success\nکودکان مددکار " + prevSwId + " با موفقیت به مددکار " + newSwId + " انتقال یافتند.");
                deactivateSW(prevSwId);
            },
            error: function(data) {
                $('#content_preloader').hide();
                bootbox.alert({
                    title: errorTitle(),
                    message: errorContent(data.responseJSON.message),
                });
            }
        })
    }

    // Delete a social worker
    $('#socialWorkerList').on('click' , '.deleteBtn' , function(e) {
        e.preventDefault();

        var socialworkerId = $(this).parent().attr('id');
        console.log(socialworkerId);

        $.ajax({
            url: SAYApiUrl + '/socialWorker/delete/socialWorkerId=' + socialworkerId,
            method: 'PATCH',

            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("You are about to DELETE the penel user.\nAre you sure?");
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