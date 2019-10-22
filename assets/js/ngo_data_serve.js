
// serving data on NGO page

$(document).ready(function(){
    var keys = ['name' , 'country' , 'city' , 'coordinatorId' , 'postalAddress' , 'phoneNumber' , 'emailAddress' , 'website' , 'logoUrl' , 'currentSocialWorkerCount' , 'currentChildrenCount' , 'registerDate' , 'lastUpdateDate']

    // getting all NGO data from DB

    $.ajax({
        url: SAYApiUrl + '/ngo/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl
        },
        success: function(data) {

            $.each(data , function(key ,value){
                var query = '<tr>';
                for(var i = 0 ; i < keys.length ; i++){
                    
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

                    if (value[keys[i]] == null) {
                        value[keys[i]] = 'No entered';
                    }

                    if (keys[i] == 'logoUrl'){
                        value[keys[i]] = getImgFile(value[keys[i]]);
                    }

                    if (keys[i] == 'coordinatorId') {
                        value[keys[i]] = 'Sara Mousavi';
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

                    }

                    query += '<td>' + value[keys[i]] + '</td>';
                }
                query+= '</tr>';
                $('#ngoList').append(query);
            })
        },
        error: function(data) {
            console.log(data);
        }
    })


    // Add new NGO

    $('#sendNgoData').on('click' , function(e){
        e.preventDefault();

        // recieving data from html form
        var name = $('#ngo_name').val();
        var country = $('#ngo_country').val();
        var city = $('#ngo_city').val();
        var coordinatorId = '10';
        var postalAddress = $('#ngo_address').val();
        var phoneNumber = $('#ngo_phone_number').val();
        var emailAddress = $('#ngo_email').val();
        var website = $('#ngo_website').val();

        var form_data = new FormData();
        form_data.append('logoUrl', $('#ngo_logo')[0].files[0]);
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
                'Access-Control-Allow-Origin'  : baseUrl
            },
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            success: function(data)  {
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
})



//NGO drop down field in forms

$(document).ready(function(){
    var keys = ['id', 'name']

    // getting NGO's id and name from DB
    
    $.ajax({
        url: SAYApiUrl + '/ngo/all',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : baseUrl
        },
        success: function(data) {
            console.log(data);
            $.each(data , function(key ,value){
                var query = '';
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]] + '</option>';
                $('#ngo_id').append(query);
                $('#social_worker_ngo').append(query);
                // console.log("NGO field query:" + query);
            })
        },
        error: function(data) {
            console.log(data);
        }
    })

})