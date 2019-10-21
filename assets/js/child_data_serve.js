$(document).ready(function(){

    var keys = ['id' , 'generatedCode' , 'avatarUrl' , 'sleptAvatarUrl' , 'voiceUrl' , 'firstName' , 'lastName' , 'birthDate' , 'sayName' , 'country' , 'city' , 'gender' , 'bio' , 'bioSummary' , 'birthPlace' , 'nationality' , 'familyCount' , 'sayFamilyCount' , 'education' , 'housingStatus' , 'id_ngo' , 'id_social_worker' , 'phoneNumber' , 'address' , 'doneNeedCount' , 'spentCredit' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'createdAt' , 'lastUpdate']
    

       // getting all Child data from DB

       $.ajax({
        url: SAYApiUrl + '/child/all/confirm=2',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl
        },
        success: function(data) {
            console.log(data);
            var confirmStatus = '';

            $.each(data , function(key ,value){

                var childId = value[keys[0]];

                var query = '<tr><td id="'+childId+'"><button type="submit" class="btn btn-embossed btn-dark btn-block confirmBtn">Confirm</button><button class="btn btn-embossed btn-dark btn-block editBtn">Edit</button><button class="btn btn-embossed btn-dark btn-block" disabled>Delete</button></td>';

                for(var i = 1 ; i < keys.length ; i++){
                    
                    if(value[keys[i]] == null){
                        value[keys[i]] = 'Not entered';
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
                        console.log("remove first element: " + value[keys[i]].substring(1));

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
                            confirmStatus = 0;
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
                
            })

            // trying to disable confirm button if the child has confirmed already!

            // if(confirmStatus == 1){
            //     // $('#' + childId).attr("disabled" , "disabled");
            //     $('#' + childId).on('click' , function(e){
            //         e.preventDefault();
            //         console.log("confirmStatus:" + confirmStatus);
            //     })
            // }
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
                'Access-Control-Allow-Origin'  : baseUrl
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
        // console.log(childId);

        $.ajax({
            url: SAYApiUrl + '/child/confirm/childId='+childId+'&socialWorkerId=10',
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : baseUrl
            },
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("You are about to confirm the child.\nAre you sure?");
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


    //Edit a child

    $('#childList').on('click' , '.editBtn' , function(e){
        e.preventDefault();
        $('#sendChildData').attr("disabled", true);
        var childId = $(this).parent().attr('id');
        console.log(childId);

        // get the dhild's data to the form
        $.ajax({
            url: SAYApiUrl + '/child/childId=' + childId + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin'  : baseUrl
            },
            success: function (data) {
                console.log(data);

                $('#SAY_name').val(data['sayName']);
                $('#child_first_name').val(data['firstName']);
                $('#child_last_name').val(data['lastName']);
                $('#child_gender').val(data['gender']);
                $('#child_nationality').val(data['nationality']);
                $('#child_country').val(data['country']);
                $('#child_city').val(data['city']);
                $('#child_address').val(data['address']);
                $('#child_birthdate').val(data['birthDate']);
                $('#child_birthplace').val(data['birthPlace']);
                $('#family_count').val(data['familyCount']);
                //education??
                $('#child_phone_number').val(data['phoneNumber']);
                $('#housing_status').val(data['housingStatus']);
                $('#child_story').val(data['bio']);
                $('#child_story_summary').val(data['bioSummary']);

            },
            error: function (data) {
                console.log(data.responseJSON.message);
            }
        })
        $('#editChildData').on('click' , function(e){
            e.preventDefault();

            console.log("edit child " + childId);

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
                form_data.append('education', education == "-2" ? "-" + school_type + "2" : school_type + education);   //because "int-2" cannot be stored. temporarily solution!
            }
            if(housingStatus){
                form_data.append('housingStatus', housingStatus);
            }
            console.log(form_data);

            // update the child with new data in the form
            $.ajax({
                url: SAYApiUrl + '/child/update/childId=' + childId,
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
                    return confirm("You are about to edit the child.\nAre you sure?");
                },
                success: function(data) {
                    alert("Success\nChild updated successfully\n" + JSON.stringify(data.message));
                    location.reload();
                },
                error: function(data) {
                    bootbox.alert({
                        title: "Error!",
                        message: data.responseJSON.message,
                    });
                }
            })  //end of Update ajax

        })  //end of 'get the child's data to the form' function
        
    })

})


//Child drop down field in needs form

$(document).ready(function(){
    var keys = ['id', 'generatedCode' , 'firstName' , 'lastName']

    $.ajax({
        url: SAYApiUrl + '/child/all/confirm=1',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl
        },
        success: function(data) {
            console.log(data);
            $.each(data , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + ' - ' + value[keys[2]] + ' ' + value[keys[3]] + '</option>';
                $('#child_id').append(query);
                $('#child_need_select').append(query);
                // console.log("Child field query:" + query);
            })
        },
        error: function(data) {
            console.log(data.responseJSON.message);
        }
    })

})