$(document).ready(function(){
    var keys = ['name' , 'country_id' , 'city_id' , 'coordinator_id' , 'postalAddress' , 'phoneNumber' , 'emailAddress' , 'logoUrl' , 'balance' , 'socialWorkerCount' , 'childrenCount' , 'registerDate' , 'lastUpdateDate' , 'isActive']

    $.ajax({
        url: 'http://localhost:5000/api/v1/ngo',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : '*'
        },
        success: function(data) {
            console.log(data);
            $.each(data , function(key ,value){
                var query = '<tr>';
                for(var i = 0 ; i < keys.length ; i++){
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


    $('#sendNgoData').on('click' , function(e){
        e.preventDefault();
        
        $.ajax({
            url: 'http://localhost:5000/api/v1/ngo',
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : '*'
            },
            data: {
                name: $('#ngoName').val(),
                country_id: $('#ngoCountry').val(),
                city_id: $('#ngoCity').val(),
                coordinator_id: $('#ngoCordinator').val(),
                postalAddress: $('#ngoAddress').val(),
                phoneNumber: $('#ngoPhoneNumber').val(),
                emailAddress: $('#ngoEmailAddress').val(),
                logoUrl: $('#ngoLogoUrl').val(),
                balance: $('#ngoBalance').val(),
                isActive: $("input[id='ngoActive']:checked").val()
            },
            success: function(data)  {
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        })
    })
})