$(document).ready(function(){
    isAuthorized();
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
            },
            child_birthdate: {
                required:true,
            },
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
            },
            child_birthdate: {
                required: "وارد کردن تاریخ تولد ضروری است."
            },
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent('div'));
        },
        submitHandler: function (form) { // for demo
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
    getAllChildren();

    $('#myonoffswitch1').prop('checked', false);
    $('#myonoffswitch1').change(function() {
        if(this.checked) {
            child_url = '/child/all/confirm=2?existence_status=!1';
        } else {
            child_url = '/child/all/confirm=2';
        }
        getAllChildren();
    })
    
    // TODO: adding farsi fields

    var keys = ['id' , 'generatedCode' , 'awakeAvatarUrl' , 'sleptAvatarUrl' , 'voiceUrl' , 'firstName' , 
                'lastName' , 'firstName_fa', 'lastName_fa', 'done_needs_count' , 'spent_credit' , 'birthDate' , 'sayName' , 'sayName_fa' ,
                'country' , 'city' , 'gender' , 'bio' , 'bioSummary' , 'bio_fa' , 'bioSummary_fa' , 
                'birthPlace' , 'nationality' , 'familyCount' , 'sayFamilyCount' , 'education' , 
                'housingStatus' , 'id_ngo' , 'id_social_worker' , 'phoneNumber' , 'address' , 
                'isConfirmed' , 'confirmUser' , 'confirmDate' , 'created' , 'updated',
    ]    

    // Get all Children

    function getAllChildren() {
        $.ajax({
            url: SAYApiUrl + child_url,
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#children_preloader').show();
            },
            success: function(data) {
                var childData = data['children'];
                
                var row_index = 1;
    
                $.each(childData , function(key ,value){
                    var childId = value['id'];
                    // Start translation fields
                    var bio_translations = value['bio_translations'];
                    var bio_summary_translations = value['bio_summary_translations'];
                    var sayname_translations = value['sayname_translations'];
                    var firstName_translations = value['firstName_translations'];
                    var lastName_translations = value['lastName_translations'];
                    // End translation fields
    
                    var confirmStatus = -1;
    
                    // first td for row count numbers, second td for operational buttons
                    var query = '<tr>\
                    <td>' + row_index + '</td>\
                    <td class="operation" id="' + childId + '">\
                    <button type="submit" class="btn btn-embossed btn-success btn-block btn-sm confirmBtn">Confirm</button>\
                    <button class="btn btn-embossed btn-primary btn-block btn-sm editBtn" onclick="editScroll()">Edit</button>\
                    <button class="btn btn-embossed btn-default btn-block btn-sm existenceBtn">Deactivate</button>\
                    <button class="btn btn-embossed btn-danger btn-block btn-sm deleteBtn">Delete</button>\
                    </td>';
    
                    for(var i = 1 ; i < keys.length ; i++){
                        
                        // Start translation fields
                        if (keys[i] == 'sayName') {
                            value[keys[i]] = sayname_translations.en;
                        }
    
                        if (keys[i] == 'sayName_fa') {
                            value[keys[i]] = rtl(sayname_translations.fa);
                        }
                        
                        if (keys[i] == 'bio') {
                            value[keys[i]] = bio_translations.en;
                        }
    
                        if (keys[i] == 'bio_fa') {
                            value[keys[i]] = rtl(bio_translations.fa);
                        }
    
                        if (keys[i] == 'bioSummary') {
                            value[keys[i]] = bio_summary_translations.en;
                        }
    
                        if (keys[i] == 'bioSummary_fa') {
                            value[keys[i]] = rtl(bio_summary_translations.fa);
                        }
    
                        if (keys[i] == 'firstName') {
                            value[keys[i]] = firstName_translations.en;
                        }
    
                        if (keys[i] == 'firstName_fa') {
                            value[keys[i]] = rtl(firstName_translations.fa);
                        }
    
                        if (keys[i] == 'lastName') {
                            value[keys[i]] = lastName_translations.en;
                        }
    
                        if (keys[i] == 'lastName_fa') {
                            value[keys[i]] = rtl(lastName_translations.fa);
                        }
                        // End translation fields
    
                        if(keys[i] == 'doneNeedCount'){
                            value[keys[i]] = value[keys[i]] + " Done";
                        }
    
                        if(keys[i] == 'spent_credit'){
                            value[keys[i]] = cost(value[keys[i]]);
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
    
                        if (keys[i] == 'awakeAvatarUrl'){
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
    
                        if(keys[i] == 'confirmDate' || keys[i] == 'created' || keys[i] == 'updated') {
                            value[keys[i]] = jalaliDate(value[keys[i]]);
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
                            $('#' + childId).find('.confirmBtn').text("Confirmed");
                    }
    
                    // Handle existence status
                    if (value['existence_status'] != 1) {
                        $(`#${childId}`).find('.existenceBtn').text('Activate');
                        if (value['existence_status'] == 0) {
                            $(`#${childId}`).find('.existenceBtn').text('Asleep :(');
                            $(`#${childId}`).find('.existenceBtn').prop("disabled", true);
                        } else if (value['existence_status'] == 2) {
                            $(`#${childId}`).find('.existenceBtn').text('Gone');
                            $(`#${childId}`).find('.existenceBtn').prop("disabled", true);
                        }
                    }
                    row_index += 1;
                })
                $('#children_preloader').hide();
    
            },
            error: function(data) {
                console.log(data.responseJSON.message);
            }
        })
        $('#childList').empty();
    }

    //Child drop down field in needs form
    $.ajax({
        url: SAYApiUrl + child_id_url,
        method: 'GET',
        dataType: 'json',
        beforeSend: function () {
            $('#child_dropdown_preloader').show();
        },
        success: function(data) {
            $('#child_dropdown_preloader').hide();
            var childData = data['children'];
            $.each(childData , function(key ,value){
                var query = '';
                    query += `<option value=${value['id']}>${value['generatedCode']} - ${value['firstName']} ${value['lastName']} - ${getAge(value['birthDate'])}</option>`;
                $('#child_id').append(query);
                $('#r_child_id').append(query);
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

        $('#editChildData').attr("disabled" , true);
        // getting data from html form
        // Not nullable
        var id_ngo = $('#ngo_id').val();
        var id_social_worker = $('#social_worker_id').val();

        // Start translation fields
        var sayname_translations = JSON.stringify({
            en: $('#SAY_name').val(),
            fa: $('#SAY_name_fa').val(),
        });
        var bio_translations = JSON.stringify({
            en: $('#child_story').val(),
            fa: $('#child_story_fa').val()
        });
        var bio_summary_translations = JSON.stringify({
            en: $('#child_story_summary').val(),
            fa: $('#child_story_summary_fa').val(),
        });
        // End translation fields
        var gender = $('#child_gender').val();
        var country = $('#child_country').val();
        var city = $('#child_city').val();
        var phoneNumber = $('#child_phone_number').val();
        var birthDate = $('#child_birthdate').val();
        var awakeAvatarUrl = $('#child_avatar')[0].files[0];
        var sleptAvatarUrl = $('#child_slept_avatar')[0].files[0];
        var voiceUrl = $('#child_voice')[0].files[0];
        // Nullable
        var nationality = $('#child_nationality').val();
        var address = $('#child_address').val();
        var birthPlace = $('#child_birthplace').val();
        var familyCount = $('#family_count').val();
        var education = $('#education').val();
        var school_type = $('#school_type').val();
        var housingStatus = $('#housing_status').val();
        // Start translation fields
        var firstName_translations = JSON.stringify({
            en: $('#child_first_name').val(),
            fa: $('#child_first_name_fa').val(),
        });
        var lastName_translations = JSON.stringify({
            en: $('#child_last_name').val(),
            fa: $('#child_last_name_fa').val(),
        });
        // End translation fields

        //append datas to a Form Data
        var form_data = new FormData();
        form_data.append('ngo_id', id_ngo);
        form_data.append('sw_id', id_social_worker);
        form_data.append('awakeAvatarUrl', awakeAvatarUrl);
        form_data.append('sleptAvatarUrl', sleptAvatarUrl);
        form_data.append('voiceUrl', voiceUrl);
        form_data.append('gender', gender);
        form_data.append('country', country);
        form_data.append('city', city);
        form_data.append('phoneNumber', phoneNumber);
        form_data.append('birthDate', birthDate);
        // Start translation fields
        form_data.append('sayname_translations', sayname_translations);
        form_data.append('bio_translations', bio_translations);
        form_data.append('bio_summary_translations', bio_summary_translations);
        form_data.append('firstName_translations', firstName_translations);
        form_data.append('lastName_translations', lastName_translations);
        // End translation fields
        
        if(nationality){
            form_data.append('nationality', nationality);
        }
        if(address){
            form_data.append('address', address);
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

        if($('#children_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/child/add/',
                method: 'POST',
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
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
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
            url: SAYApiUrl + '/child/confirm/childId=' + childId,
            method: 'PATCH',
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
                    title: errorTitle(),
                    message: errorContent(data.responseJSON.message),
                });
            }
        })

    })


    // Edit a child
    $('#childList').on('click' , '.editBtn' , function(e){
        e.preventDefault();

        $('#sendChildData').attr("disabled" , true);
        $('#ngo_id').prop("disabled", true);
        $('#social_worker_id').prop("disabled", true);
        edit_childId = $(this).parent().attr('id');

        // get the child's data to the form
        $.ajax({
            url: SAYApiUrl + '/child/childId=' + edit_childId + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#children_form_preloader').show();
            },
            success: function (data) {
                // Start translation fields
                var bio_translations = data['bio_translations'];
                var bio_summary_translations = data['bio_summary_translations'];
                var sayname_translations = data['sayname_translations'];
                var firstName_translations = data['firstName_translations'];
                var lastName_translations = data['lastName_translations'];
                // End translation fields

                $('#ngo_id').val(data['id_ngo']).change();
                $('#social_worker_id').val(data['id_social_worker']).change();
                $('#child_gender').val(data['gender']).change();
                $('#child_nationality').val(data['nationality']).change();
                $('#child_country').val(data['country']).change();
                $('#child_city').val(data['city']).change();
                $('#child_address').val(data['address']);
                $('#child_birthdate').val(jalaliDate(data['birthDate']));    // not working
                $('#child_age').val(getAge(data['birthDate']));
                $('#child_birthplace').val(data['birthPlace']);
                $('#family_count').val(data['familyCount']);
                //TODO: education??
                $('#child_phone_number').val(data['phoneNumber']);
                $('#housing_status').val(data['housingStatus']).change();
                // Start translation fields
                $('#child_story').val(bio_translations.en);
                $('#child_story_fa').val(bio_translations.fa);
                $('#child_story_summary').val(bio_summary_translations.en);
                $('#child_story_summary_fa').val(bio_summary_translations.fa);
                $('#SAY_name').val(sayname_translations.en);
                $('#SAY_name_fa').val(sayname_translations.fa);
                $('#child_first_name').val(firstName_translations.en);
                $('#child_first_name_fa').val(firstName_translations.fa);
                $('#child_last_name').val(lastName_translations.en);
                $('#child_last_name_fa').val(lastName_translations.fa);
                // End translation fields

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

        // getting data from html form

        // Start translation fields
        var sayname_translations = JSON.stringify({
            en: $('#SAY_name').val(),
            fa: $('#SAY_name_fa').val(),
        });
        var bio_translations = JSON.stringify({
            en: $('#child_story').val(),
            fa: $('#child_story_fa').val()
        });
        var bio_summary_translations = JSON.stringify({
            en: $('#child_story_summary').val(),
            fa: $('#child_story_summary_fa').val(),
        });
        var firstName_translations = JSON.stringify({
            en: $('#child_first_name').val(),
            fa: $('#child_first_name_fa').val(),
        });
        var lastName_translations = JSON.stringify({
            en: $('#child_last_name').val(),
            fa: $('#child_last_name_fa').val(),
        });
        // End translation fields
        var gender = $('#child_gender').val();
        var country = $('#child_country').val();
        var city = $('#child_city').val();
        var phoneNumber = $('#child_phone_number').val();
        var awakeAvatarUrl = $('#child_avatar')[0].files[0];
        var sleptAvatarUrl = $('#child_slept_avatar')[0].files[0];
        var voiceUrl = $('#child_voice')[0].files[0];

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

        // Start translation fields
        form_data.append('sayname_translations', sayname_translations);
        form_data.append('bio_translations', bio_translations);
        form_data.append('bio_summary_translations', bio_summary_translations);
        form_data.append('firstName_translations', firstName_translations);
        form_data.append('lastName_translations', lastName_translations);
        // End translation fields
        if(awakeAvatarUrl){
            form_data.append('awakeAvatarUrl', awakeAvatarUrl);
        }
        if(sleptAvatarUrl){
            form_data.append('sleptAvatarUrl', sleptAvatarUrl);
        }
        if(voiceUrl){
            form_data.append('voiceUrl', voiceUrl);
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
        if(nationality){
            form_data.append('nationality', nationality);
        }
        if(address){
            form_data.append('address', address);
        }
        if(birthDate){
            form_data.append('birthDate', birthDate);   // if the user change the birth date
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

        console.log(form_data);

        //remove required rules of Select and File Type fields
        $('#children_form select, input[type="date"]').each(function() {
            $(this).rules('remove', 'required');
        });
        $('.file_input').each(function() {
            $(this).rules('remove', 'required');
        });

        // update the child with new data in the form
        if($('#children_form').valid()) {
            $.ajax({
                url: SAYApiUrl + '/child/update/childId=' + edit_childId,
                method: 'PATCH',
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
                        title: errorTitle(),
                        message: errorContent(data.responseJSON.message),
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
                    title: errorTitle(),
                    message: errorContent(data.responseJSON.message),
                });
            }
        })
    })

    // Change children existence status
    $('#childList').on('click' , '.existenceBtn' , function(e) {
        $('.static').val(-1).change();
        e.preventDefault();

        edit_childId = $(this).parent().attr('id');
        $('#deactive-modal').modal('show');

        $.ajax({
            url: SAYApiUrl + '/child/childId=' + edit_childId + '&confirm=2',
            method: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $('#children_existence_preloader').show();
                $('#existenceStatus').prop('disabled', 'disabled');
            },
            success: function (data) {
                $('#sayName').text(data['sayname_translations'].fa);
                $('#existenceStatus').val(data['existence_status']).change();

                $('#children_existence_preloader').hide();
                $('#existenceStatus').prop('disabled', false);
            },
            error: function (data) {
                console.log(data.responseJSON.message);
            }
        })
    })

    $('#changeExistence').on('click', function(e) {
        e.preventDefault();

        var existenceStaus = $('#existenceStatus').val();
        var formData = new FormData();
        if (existenceStaus != -1) {
            formData.append('existence_status', existenceStaus);
        } else return;

        $.ajax({
            url: SAYApiUrl + '/child/update/childId=' + edit_childId,
            method: 'PATCH',
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            data: formData,
            beforeSend: function(){
                return confirm("در صورت غیر فعال کردن کودک، نیازهای فعال او غیر فعال شده و نیازهایی که هنوز وضعیت آن به دست کودک نرسیده است مبلغش به کیف پول کاربران برگشت داده شده می‌شود.\nAre you sure?");
            },
            success: function(data) {
                alert("Success\nChild " + edit_childId + " updated successfully\n" + JSON.stringify(data.message));
                location.reload(true);
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

const getChildById = (id, handleData) => {
    $.ajax({
        url: `${SAYApiUrl}/child/childId=${id}&confirm=2`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            handleData(data);
        },
        error: function (data) {
            console.log(data.responseJSON.message);
        }
    })
}
