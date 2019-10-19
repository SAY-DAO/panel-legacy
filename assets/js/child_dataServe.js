$(document).ready(function(){

    var keys = ['id' , 'generatedCode' , 'avatarUrl' , 'voiceUrl' , 'firstName' , 'lastName' , 'birthDate' , 'sayName' , 'country' , 'city' , 'gender' , 'bio' , 'bioSummary' , 'birthPlace' , 'nationality' , 'familyCount' , 'sayFamilyCount' , 'education' , 'housingStatus' , 'id_ngo' , 'id_social_worker' , 'phoneNumber' , 'address' , 'doneNeedCount' , 'spentCredit' , 'isConfirmed' , 'confirmUser' , 'confirmDate' , 'createdAt']
    

       // getting all Child data from DB

       $.ajax({
        url: 'http://api.sayapp.company/api/v2/child/all/confirm=2',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : '*'
        },
        success: function(data) {
            console.log(data);
            var confirmStatus = '';

            $.each(data , function(key ,value){

                var childId = value[keys[0]];

                var query = '<tr><td><button type="submit" class="btn btn-embossed btn-dark btn-block confirmBtn" id="'+childId+'">Confirm</button><button class="btn btn-embossed btn-dark btn-block" disabled>Edit</button><button class="btn btn-embossed btn-dark btn-block" disabled>Delete</button></td>';

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

                    if (keys[i] == 'voiceUrl'){
                        value[keys[i]] = '<audio src="http://sayapp.company/'+ value[keys[i]]+'" controls></audio>';
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

        // recieving data from html form
        var id_ngo = $('#ngo_id').val();
        var id_social_worker = $('#social_worker_id').val();
        var sayName = $('#SAY_name').val();
        var gender = $('#child_gender').val();
        var country = $('#child_country').val();
        var city = $('#child_city').val();
        var phoneNumber = $('#child_phone_number').val();
        var bio = $('#child_story').val();
        var bioSummary = $('#child_story_summary').val();

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

        
        var form_data = new FormData();
        form_data.append('avatarUrl', $('#child_avatar')[0].files[0]);
        form_data.append('voiceUrl', $('#child_voice')[0].files[0]);
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
            form_data.append('education', school_type+education);
        }

        if(housingStatus){
            form_data.append('housingStatus', housingStatus);
        }

        console.log(form_data);

        
        $.ajax({
            url: 'http://api.sayapp.company/api/v2/child/add/socialWorkerId=' + id_social_worker + '&ngoId=' + id_ngo,
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : 'http://www.sayapp.company'
            },
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: form_data,
            success: function(data)  {
                alert(data);
                location.reload();
            },
            error: function(data) {
                alert(data);
            }
        })
    })

    // Confirm a child

    $('#childList').on('click' , '.confirmBtn' , function(e){
        e.preventDefault();
        var childId = $(this).attr('id');
        console.log(childId);
        $.ajax({
            url: 'http://api.sayapp.company/api/v2/child/confirm/childId='+childId+'&socialWorkerId=10',
            method: 'PATCH',
            headers : {
                'Access-Control-Allow-Origin'  : 'http://www.sayapp.company'
            },
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                return confirm("Are you sure?");
            },
            success: function(data) {
                alert("Success\n" + JSON.stringify(data.message));
                location.reload();
            },
            error: function(data) {
                alert("Error\n" + data.responseJSON.message);
            }
        })

    })

})

//Child drop down field in needs form

$(document).ready(function(){
    var keys = ['id', 'generatedCode' , 'firstName' , 'lastName']

    $.ajax({
        url: 'http://api.sayapp.company/api/v2/child/all/confirm=1',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : '*'
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

//Get child need by child id >> in need page

$(document).ready(function(){
    var keys = ['id' , 'child_id' , 'ChildName' , 'name' , 'cost' , 'paid' , 'progress' , 'imageUrl' , 'isUrgent' , 'category' , 'type' , 'affiliateLinkUrl' , 'description' , 'descriptionSummary' , 'receipts' , 'createdAt' , 'isConfirmed' , 'confirmDate']

    $('#child_need_select').change(function() {
        var selected_child = $(this).val();
        $.ajax({
            url: 'http://api.sayapp.company/api/v2/child/need/childId=' + selected_child + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin' : 'http://www.sayapp.company'
            },
            success: function(data) {
                console.log('option:' + selected_child);
                console.log(data);
                $.each(data, function(key, value){
                    var query = '<tr><td><button type="submit" class="btn btn-embossed btn-dark btn-block confirmBtn" id="'+value[keys[0]]+'">Confirm</button><button class="btn btn-embossed btn-dark btn-block" disabled>Edit</button><button class="btn btn-embossed btn-dark btn-block" disabled>Delete</button></td>';
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

    

})
