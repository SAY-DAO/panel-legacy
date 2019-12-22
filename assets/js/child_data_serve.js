$(document).ready(function(){
    isAthorized();
    hasPrivilege();
     // live age field
     $('#child_birthdate').change(function() {
        $('#child_age').val( getAge( $(this).val() ) );
    })
    // children form validation
    $('#children_form').validate({
        ignore: [], // To validate hidden input
        rules: {
            ngo_id: {
                required: true
            },
            social_worker_id: {
                required: true
            },
            SAY_name: {
                required:true
            },
            child_gender: {
                required: true
            },
            child_country: {
                required: true
            },
            child_city: {
                required: true
            },
            child_phone_number: {
                required: true,
                digits: true,
                minlength: 8
            },
            "child_avatar[]": {
                required: true,
                extension: "jpg,png,jpeg",
                filesize: 0.5    // MB
            },
            "child_slept_avatar[]": {
                required: true,
                extension: "jpg,png,jpeg",
                filesize: 0.5    // MB
            },
            "child_voice[]": {
                required: true,
                extension: "mp3,wav,m4a,wma,aac,ogg",
                filesize: 3   // MB
            },
            child_story: {
                required: true,
            },
            child_story_summary: {
                required: true,
            }
        },
        messages: {
            ngo_id: {
                required: "انتخاب انجمن ضروری است."
            },
            social_worker_id: {
                required: "انتخاب مددکار ضروری است."
            },
            SAY_name: {
              required: "وارد کردن SAY name ضروری است."
            },
            child_gender: {
                required: "انتخاب جنسیت ضروری است."
            },
            child_country: {
                required: "انتخاب کشور ضروری است."
            },
            child_city: {
                required: "انتخاب شهر ضروری است."
            },
            child_phone_number: {
                required: "وارد کردن شماره تماس ضروری است.",
                digits: "شماره تماس تنها می‌تواند شامل اعداد باشد.",
                minlength: "شماره تماس حداقل باید {0} رقم باشد."
            },
            "child_avatar[]": {
                required: "انتخاب آواتار کودک ضروری است.",
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            "child_slept_avatar[]": {
                required: "انتخاب آواتار خواب کودک ضروری است.",
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            "child_voice[]": {
                required: "انتخاب صدای کودک ضروری است.",
                extension: "فرمت‌های قابل پذیرش: {0}",
                filesize: "بیش‌ترین حجم قابل پذیرش: {0} MB"
            },
            child_story: {
                required: "وارد کردن داستان ضروری است."
            },
            child_story_summary: {
                required: "وارد کردن خلاصه داستان ضروری است."
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

    var edit_childId = -1;
    var child_url = '';
    var child_id_url = '';

    child_url = '/child/all/confirm=2';
    child_id_url = '/child/all/confirm=1';
    // TODO: adding farsi fields

    var keys = ['id' , 'generatedCode' , 'avatarUrl' , 'sleptAvatarUrl' , 'voiceUrl' , 'firstName' , 'lastName' , 'doneNeedCount' , 'spentCredit' , 'birthDate' , 'sayName' , 'country' , 'city' , 'gender' , 'bio' , 'bioSummary' , 'birthPlace' , 'nationality' , 'familyCount' , 'sayFamilyCount' , 'education' , 'housingStatus' , 'id_ngo' , 'id_social_worker' , 'phoneNumber' , 'address' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'createdAt' , 'lastUpdate']
    

    // Get all Children

    $.ajax({
        url: SAYApiUrl + child_url,
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Cache-Control': 'no-cache'
        },
        beforeSend: function() {
            $('#children_preloader').show();
        },
        success: function(data) {
            var childData = data['children'];
            var row_index = 1;

            $.each(childData , function(key ,value){
                var childId = value[keys[0]];
                var confirmStatus = -1;

                // first td for row count numbers, second td for operational buttons
                var query = '<tr>\
                <td>' + row_index + '</td>\
                <td class="operation" id="' + childId + '">\
                <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                </td>';

                for(var i = 1 ; i < keys.length ; i++){
                    
                    if(keys[i] == 'doneNeedCount'){
                        value[keys[i]] = value[keys[i]] + " Done";
                    }

                    if(keys[i] == 'birthDate'){
                        value[keys[i]] = getAge(value[keys[i]]);
                    }

                    if(keys[i] == 'country'){
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
                            value[keys[i]] = 'Girl';
                        }
                        if (value[keys[i]] == true) {
                            value[keys[i]] = 'Boy';
                        }
                    }

                    if (keys[i] == 'birthPlace'){
                        if(value[keys[i]] == '1'){
                            value[keys[i]] = 'Tehran';
                        }
                        if(value[keys[i]] == '2'){
                            value[keys[i]] = 'Karaj';
                        }
                    }

                    if (keys[i] == 'nationality'){
                        if(value[keys[i]] == '98'){
                            value[keys[i]] = 'Iranian';
                        }
                        if(value[keys[i]] == '93'){
                            value[keys[i]] = 'Afghan';
                        }
                    }

                    // TODO:
                    // if (keys[i] == 'education'){
                    //     // console.log("first element of string: " + value[keys[i]].charAt(0));
                    //     // console.log("count string length: " + value[keys[i]] + '-' + value[keys[i]].length);
                    //     // console.log("remove first element: " + value[keys[i]].substring(1));

                    //     if(value[keys[i]].length >= 2){
                    //         if(value[keys[i]].charAt(0) == 6 ){
                    //             value[keys[i]] += " - School for the deaf";
                    //         }
                    //         if(value[keys[i]].charAt(0) == 7 ){
                    //             value[keys[i]] += " - School for the blind";
                    //         }
                    //         if(value[keys[i]].charAt(0) == 8 ){
                    //             value[keys[i]] += " - Intellectual disabilities school";
                    //         }
                    //         if(value[keys[i]].charAt(0) == 9 ){
                    //             value[keys[i]] += " - School";
                    //         }
                    //     }

                    //     if(value[keys[i]] == '-3'){
                    //         value[keys[i]] = 'Deprived of education';
                    //     }
                    //     if(value[keys[i]] == '-2'){
                    //         value[keys[i]] = 'Kinder garden';
                    //     }
                    //     if(value[keys[i]] == '-1'){
                    //         value[keys[i]] = 'Not attending';
                    //     }
                    //     if(value[keys[i]] == '0'){
                    //         value[keys[i]] = 'Pre-school';
                    //     }
                    //     if(value[keys[i]] == '1'){
                    //         value[keys[i]] = '1<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '2'){
                    //         value[keys[i]] = '2<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '3'){
                    //         value[keys[i]] = '3<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '4'){
                    //         value[keys[i]] = '4<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '5'){
                    //         value[keys[i]] = '5<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '6'){
                    //         value[keys[i]] = '6<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '7'){
                    //         value[keys[i]] = '7<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '8'){
                    //         value[keys[i]] = '8<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '9'){
                    //         value[keys[i]] = '9<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '10'){
                    //         value[keys[i]] = '10<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '11'){
                    //         value[keys[i]] = '11<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '12'){
                    //         value[keys[i]] = '12<sup>th</sup> grade';
                    //     }
                    //     if(value[keys[i]] == '13'){
                    //         value[keys[i]] = 'University';
                    //     }
                    // }

                    if (keys[i] == 'phoneNumber'){
                        value[keys[i]] = phoneTo(value[keys[i]]);
                    }

                    if(keys[i] == 'housingStatus'){
                        if(value[keys[i]] == '0'){
                            value[keys[i]] = 'Street child';
                        }
                        if(value[keys[i]] == '1'){
                            value[keys[i]] = 'Living at home';
                        }
                        if(value[keys[i]] == '2'){
                            value[keys[i]] = 'Care centers';
                        }
                    }

                    if(keys[i] == 'isConfirmed'){
                        if(value[keys[i]] == true){
                            value[keys[i]] = 'Confirmed';
                            confirmStatus = 1;
                        }
                        if(value[keys[i]] == false){
                            value[keys[i]] = 'Not confirmed';
                        }
                    }

                    if (keys[i] == 'avatarUrl'){
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    if (keys[i] == 'sleptAvatarUrl'){
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    if (keys[i] == 'voiceUrl'){
                        value[keys[i]] = getVoiceFile(value[keys[i]]);
                    }

                    if(keys[i] == 'spentCredit'){
                        value[keys[i]] = cost(value[keys[i]]);
                    }

                    if(keys[i] == 'familyCount' || keys[i] == 'sayFamilyCount'){
                        value[keys[i]] = value[keys[i]] + " Members";
                    }

                    if(keys[i] == 'confirmDate' || keys[i] == 'createdAt' || keys[i] == 'lastUpdate') {
                        value[keys[i]] = localDate(value[keys[i]]);
                    }
                    
                    if(value[keys[i]] == null){
                        value[keys[i]] = nullValues();
                    }

                    query += '<td>' + value[keys[i]] + '</td>';
                }
                
                query+= '</tr>';
                $('#childList').append(query);
                hasPrivilege();

                // disable confirm button if the child has confirmed already!
                if(confirmStatus == 1){
                        $('#' + childId).find('.confirmBtn').prop("disabled", true);
                }
                row_index += 1;
            })
            $('#children_preloader').hide();

        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    //Child drop down field in needs form
    $.ajax({
        url: SAYApiUrl + child_id_url,
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Cache-Control': 'no-cache'

        },
        success: function(data) {
            var childData = data['children']
            $.each(childData , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + ' - ' + value[keys[5]] + ' ' + value[keys[6]] + '</option>';
                $('#child_id').append(query);
                $('#child_need_select').append(query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

    // Add new child
    $('#sendChildData').on('click' , function(e){
        e.preventDefault();

        // getting data from html form
        // nullable
        var id_ngo = $('#ngo_id').val();
        var id_social_worker = $('#social_worker_id').val();
        var sayName = $('#SAY_name').val();
        var gender = $('#child_gender').val();
        var country = $('#child_country').val();
        var city = $('#child_city').val();
        var phoneNumber = $('#child_phone_number').val();
        var bio = $('#child_story').val();
        var bioSummary = $('#child_story_summary').val();
        var avatarUrl = $('#child_avatar')[0].files[0];
        var sleptAvatarUrl = $('#child_slept_avatar')[0].files[0];
        var voiceUrl = $('#child_voice')[0].files[0];
        //not nullable
        var firstName = $('#child_first_name').val();
        var lastName = $('#child_last_name').val();
        var nationality = $('#child_nationality').val();
        var address = $('#child_address').val();
        var birthDate = $('#child_birthdate').val();
        var birthPlace = $('#child_birthplace').val();
        var familyCount = $('#family_count').val();
        var education = $('#education').val();
        var school_type = $('#school_type').val();
        var housingStatus = $('#housing_status').val();
        // var  = $('#SAY_name_fa').val();  // TODO: waiting for backend to add this feild
        // var  = $('#child_story_fa').val();  // TODO: waiting for backend to add this feild
        // var  = $('#child_story_summary_fa').val();  // TODO: waiting for backend to add this feild

        //append datas to a Form Data
        var form_data = new FormData();
        form_data.append('avatarUrl', avatarUrl);
        form_data.append('sleptAvatarUrl', sleptAvatarUrl);
        form_data.append('voiceUrl', voiceUrl);
        form_data.append('sayName', sayName);
        form_data.append('gender', gender);
        form_data.append('country', country);
        form_data.append('city', city);
        form_data.append('phoneNumber', phoneNumber);
        form_data.append('bio', bio);
        form_data.append('bioSummary', bioSummary);
        
        if(firstName){
            form_data.append('firstName', firstName);
        }
        if(lastName){
            form_data.append('lastName', lastName);
        }
        if(nationality){
            form_data.append('nationality', nationality);
        }
        if(address){
            form_data.append('address', address);
        }
        if(birthDate){
            form_data.append('birthDate', birthDate);
        }
        if(birthPlace){
            form_data.append('birthPlace', birthPlace);
        }
        if(familyCount){
            form_data.append('familyCount', familyCount);
        }
        if(education || school_type){
            form_data.append('education', education == "-2" ? "-" + school_type + "2" : school_type + education);   //because "int-2" cannot be stored. temporarily solution!
        }
        if(housingStatus){
            form_data.append('housingStatus', housingStatus);
        }
        // if() {
        //     form_data.append('', ); // TODO: SAY_name_fa
        // }
        // if() {
        //     form_data.append('', ); // TODO: child_story_fa
        // }
        // if() {
        //     form_data.append('', ); // TODO: child_story_summary_fa
        // }

        if($('#children_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/child/add/socialWorkerId=' + id_social_worker + '&ngoId=' + id_ngo,
                method: 'POST',
                headers : {
                    'Access-Control-Allow-Origin'  : baseUrl,
                    'Cache-Control': 'no-cache'
                },
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                        return confirm("You are about to add a new child.\nAre you sure?");
                            
                },
                success: function(data)  {
                    alert("Success\nChild added successfully\n" + JSON.stringify(data.message));
                    location.reload(true);
                },
                error: function(data) {
                    bootbox.alert({
                        title: "Error!",
                        message: data.responseJSON.message,
                    });
                }
            })
        }
    })

    // Confirm a child
    $('#childList').on('click' , '.confirmBtn' , function(e){
        e.preventDefault();
        var childId = $(this).parent().attr('id');
        console.log("confirm child: ", childId);

        $.ajax({
            url: SAYApiUrl + '/child/confirm/childId=' + childId + '&socialWorkerId=' + global_user_id,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("You are about to confirm the child.\nAre you sure?");
            },
            success: function(data) {
                alert("Success\n" + JSON.stringify(data.message));
                // TODO: only the table should be reload, so I commented it temporarily
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


    // Edit a child
    $('#childList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendChildData').prop("disabled", true);
        $('#ngo_id').prop("disabled", true);
        $('#social_worker_id').prop("disabled", true);
        edit_childId = $(this).parent().attr('id');
        console.log("child id get value: " + edit_childId);

        // get the dhild's data to the form
        $.ajax({
            url: SAYApiUrl + '/child/childId=' + edit_childId + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Cache-Control': 'no-cache'

            },
            beforeSend: function() {
                $('#children_form_preloader').show();
            },
            success: function (data) {

                $('#ngo_id').val(data['id_ngo']).change();
                $('#social_worker_id').val(data['id_social_worker']).change();
                $('#SAY_name').val(data['sayName']);
                $('#child_first_name').val(data['firstName']);
                $('#child_last_name').val(data['lastName']);
                $('#child_gender').val(data['gender']).change();
                $('#child_nationality').val(data['nationality']).change();
                $('#child_country').val(data['country']).change();
                $('#child_city').val(data['city']).change();
                $('#child_address').val(data['address']);
                $('#child_age').val(getAge(data['birthDate']));
                $('#child_birthplace').val(data['birthPlace']);
                $('#family_count').val(data['familyCount']);
                //TODO: education??
                $('#child_phone_number').val(data['phoneNumber']);
                $('#housing_status').val(data['housingStatus']).change();
                $('#child_story').val(data['bio']);
                $('#child_story_summary').val(data['bioSummary']);
                // $('#SAY_name_fa').val(data['']);    // TODO: waiting for backend to add this feild
                // $('#child_story_fa').val(data['']); // TODO: waiting for backend to add this feild
                // $('#child_story_summary_fa').val(data['']); // TODO: waiting for backend to add this feild

                $('#children_form_preloader').hide();
            },
            error: function (data) {
                console.log(data.responseJSON.message);
            }
        })
    })

    // confirm Edit child
    $('#editChildData').on('click' , function(e){
        e.preventDefault();

        console.log("edit child " + edit_childId);

        // getting data from html form

        var sayName = $('#SAY_name').val();
        var gender = $('#child_gender').val();
        var country = $('#child_country').val();
        var city = $('#child_city').val();
        var phoneNumber = $('#child_phone_number').val();
        var bio = $('#child_story').val();
        var bioSummary = $('#child_story_summary').val();
        var avatarUrl = $('#child_avatar')[0].files[0];
        var sleptAvatarUrl = $('#child_slept_avatar')[0].files[0];
        var voiceUrl = $('#child_voice')[0].files[0];

        var firstName = $('#child_first_name').val();
        var lastName = $('#child_last_name').val();
        var nationality = $('#child_nationality').val();
        var address = $('#child_address').val();
        var birthDate = $('#child_birthdate').val();
        var birthPlace = $('#child_birthplace').val();
        var familyCount = $('#family_count').val();
        var education = $('#education').val();
        var school_type = $('#school_type').val();
        var housingStatus = $('#housing_status').val();
        // var  = $('#SAY_name_fa').val();  // TODO: waiting for backend to add this feild
        // var  = $('#child_story_fa').val();  // TODO: waiting for backend to add this feild
        // var  = $('#child_story_summary_fa').val();  // TODO: waiting for backend to add this feild

        // append datas to a Form Data
        var form_data = new FormData();
        if(avatarUrl){
            form_data.append('avatarUrl', avatarUrl);
        }
        if(sleptAvatarUrl){
            form_data.append('sleptAvatarUrl', sleptAvatarUrl);
        }
        if(voiceUrl){
            form_data.append('voiceUrl', voiceUrl);
        }
        if(sayName){
            form_data.append('sayName', sayName);
        }
        if(gender){
            form_data.append('gender', gender);
        }
        if(country){
            form_data.append('country', country);
        }
        if(city){
            form_data.append('city', city);
        }
        if(phoneNumber){
            form_data.append('phoneNumber', phoneNumber);
        }
        if(bio){
            form_data.append('bio', bio);
        }
        if(bioSummary){
            form_data.append('bioSummary', bioSummary);
        }
        if(firstName){
            form_data.append('firstName', firstName);
        }
        if(lastName){
            form_data.append('lastName', lastName);
        }
        if(nationality){
            form_data.append('nationality', nationality);
        }
        if(address){
            form_data.append('address', address);
        }
        if(birthDate){
            form_data.append('birthDate', birthDate);
        }
        if(birthPlace){
            form_data.append('birthPlace', birthPlace);
        }
        if(familyCount){
            form_data.append('familyCount', familyCount);
        }
        if(education || school_type){
            form_data.append('education', education == "-2" ? "-" + school_type + "2" : school_type + education);   // TODO: because "int(-2)" cannot be stored. temporarily solution!
        }
        if(housingStatus){
            form_data.append('housingStatus', housingStatus);
        }
        // if() {
        //     form_data.append('', ); // TODO: SAY_name_fa
        // }
        // if() {
        //     form_data.append('', ); // TODO: child_story_fa
        // }
        // if() {
        //     form_data.append('', ); // TODO: child_story_summary_fa
        // }

        console.log(form_data);

        //remove required rules of all fields
        $('#children_form select').each(function() {
            $(this).rules('remove', 'required');
        })
        $('#children_form input, textarea').each(function() {
            $(this).rules('remove', 'required');
        })

        // update the child with new data in the form
        if($('#children_form').valid()) {
            $.ajax({
            url: SAYApiUrl + '/child/update/childId=' + edit_childId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Cache-Control': 'no-cache'

                },
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                data: form_data,
                beforeSend: function(){
                    return confirm("You are about to edit the child.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nChild " + edit_childId + " updated successfully\n" + JSON.stringify(data.message));
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

    // Delete a child
    $('#childList').on('click' , '.deleteBtn' , function(e){
        e.preventDefault();
        var childId = $(this).parent().attr('id');
        console.log(childId);

        $.ajax({
            url: SAYApiUrl + '/child/delete/childId=' + childId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Cache-Control': 'no-cache'

            },
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("You are about to DELETE the child.\nAre you sure?");
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