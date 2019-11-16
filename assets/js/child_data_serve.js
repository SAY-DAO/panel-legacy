$(document).ready(function(){
    isAthorized();
    hasPrivilege();

    var edit_childId = -1;
    var child_url = '';
    var child_id_url = '';

    if(global_user_role != 1){
        child_url = '/child/all/confirm=2?ngo_id=' + global_user_ngo;
        child_id_url = '/child/all/confirm=1?ngo_id=' + global_user_ngo;
    }else{
        child_url = '/child/all/confirm=2';
        child_id_url = '/child/all/confirm=1';
    }
    
    var keys = ['id' , 'generatedCode' , 'avatarUrl' , 'sleptAvatarUrl' , 'voiceUrl' , 'firstName' , 'lastName' , 'doneNeedCount' , 'spentCredit' , 'birthDate' , 'sayName' , 'country' , 'city' , 'gender' , 'bio' , 'bioSummary' , 'birthPlace' , 'nationality' , 'familyCount' , 'sayFamilyCount' , 'education' , 'housingStatus' , 'id_ngo' , 'id_social_worker' , 'phoneNumber' , 'address' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'createdAt' , 'lastUpdate']
    

    // Get all Children

    $.ajax({
        url: SAYApiUrl + child_url,
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl,
            'Athorization': $.cookie('access_token'),    // check if authorize for this action
            'Cache-Control': 'no-cache'
        },
        success: function(data) {

            // console.log(data);
            var childData = data['children'];
            
            // console.log("child data: ", childData[0]['id_social_worker']);

            $.each(childData , function(key ,value){
                var childId = value[keys[0]];
                var confirmStatus = -1;

                // first td for row count numbers, second td for operational buttons
                var query = '<tr>\
                <td>' + $('tr').length + '</td>\
                <td class="operation" id="' + childId + '">\
                <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                </td>';

                for(var i = 1 ; i < keys.length ; i++){
                    
                    if(value[keys[i]] == null){
                        value[keys[i]] = nullValues();
                    }
                    
                    if(keys[i] == 'doneNeedCount'){
                        value[keys[i]] = value[keys[i]] + " Done";
                    }

                    if(keys[i] == 'birthDate'){
                        value[keys[i]] = getAge(value[keys[i]]) + " Years old";
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

                    if (keys[i] == 'education'){
                        // console.log("first element of string: " + value[keys[i]].charAt(0));
                        // console.log("count string length: " + value[keys[i]] + '-' + value[keys[i]].length);
                        // console.log("remove first element: " + value[keys[i]].substring(1));

                        if(value[keys[i]].length >= 2){
                            if(value[keys[i]].charAt(0) == 6 ){
                                value[keys[i]] += " - School for the deaf";
                            }
                            if(value[keys[i]].charAt(0) == 7 ){
                                value[keys[i]] += " - School for the blind";
                            }
                            if(value[keys[i]].charAt(0) == 8 ){
                                value[keys[i]] += " - Intellectual disabilities school";
                            }
                            if(value[keys[i]].charAt(0) == 9 ){
                                value[keys[i]] += " - School";
                            }
                        }

                        if(value[keys[i]] == '-3'){
                            value[keys[i]] = 'Deprived of education';
                        }
                        if(value[keys[i]] == '-2'){
                            value[keys[i]] = 'Kinder garden';
                        }
                        if(value[keys[i]] == '-1'){
                            value[keys[i]] = 'Not attending';
                        }
                        if(value[keys[i]] == '0'){
                            value[keys[i]] = 'Pre-school';
                        }
                        if(value[keys[i]] == '1'){
                            value[keys[i]] = '1<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '2'){
                            value[keys[i]] = '2<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '3'){
                            value[keys[i]] = '3<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '4'){
                            value[keys[i]] = '4<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '5'){
                            value[keys[i]] = '5<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '6'){
                            value[keys[i]] = '6<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '7'){
                            value[keys[i]] = '7<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '8'){
                            value[keys[i]] = '8<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '9'){
                            value[keys[i]] = '9<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '10'){
                            value[keys[i]] = '10<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '11'){
                            value[keys[i]] = '11<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '12'){
                            value[keys[i]] = '12<sup>th</sup> grade';
                        }
                        if(value[keys[i]] == '13'){
                            value[keys[i]] = 'University';
                        }
                    }

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
                        value[keys[i]] = value[keys[i]] + " Toman";
                    }

                    if(keys[i] == 'familyCount' || keys[i] == 'sayFamilyCount'){
                        value[keys[i]] = value[keys[i]] + " Members";
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
                
            })

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
            'Athorization': $.cookie('access_token'),    // check if authorize for this action
            'Cache-Control': 'no-cache'

        },
        success: function(data) {
            var childData = data['children']
            $.each(childData , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + ' - ' + value[keys[5]] + ' ' + value[keys[6]] + '</option>';
                $('#child_id').append(query);
                $('#child_need_select').append(query);
                // console.log("Child field query:" + query);
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

        //nullable
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

        console.log(form_data);

        
        $.ajax({
            url: SAYApiUrl + '/child/add/socialWorkerId=' + id_social_worker + '&ngoId=' + id_ngo,
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
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
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
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
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
                'Cache-Control': 'no-cache'

            },
            success: function (data) {
                // console.log(data);

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
                $('#child_birthdate').val(data['birthDate']);
                $('#child_birthplace').val(data['birthPlace']);
                $('#family_count').val(data['familyCount']);
                //education??
                $('#child_phone_number').val(data['phoneNumber']);
                $('#housing_status').val(data['housingStatus']).change();
                $('#child_story').val(data['bio']);
                $('#child_story_summary').val(data['bioSummary']);

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
            form_data.append('education', education == "-2" ? "-" + school_type + "2" : school_type + education);   //because "int(-2)" cannot be stored. temporarily solution!
        }
        if(housingStatus){
            form_data.append('housingStatus', housingStatus);
        }
        console.log(form_data);

        // update the child with new data in the form
        $.ajax({
            url: SAYApiUrl + '/child/update/childId=' + edit_childId,
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl,
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
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
                location.reload();
            },
            error: function(data) {
                bootbox.alert({
                    title: "Error!",
                    message: data.responseJSON.message,
                });
            }
        })  //end of Update ajax

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
                'Athorization': $.cookie('access_token'),    // check if authorize for this action
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