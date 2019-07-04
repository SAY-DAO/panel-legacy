$(document).ready(function(){
    var keys = ['generatedCode' , 'firstName' , 'lastName' , 'userName' , 'type_id' , 'ngo_id' , 'birthCertificateNumber' , 'city_id' , 'country_id' , 'idNumber', 'idCardUrl' , 'passportNumber' , 'passportUrl' , 'gender' , 'birthDate' , 'phoneNumber' , 'emergencyPhoneNumber' , 'emailAddress' , 'telegramId' , 'postalAddress' , 'avatarUrl' , 'childrenCount', 'needCcount' , 'bankAccountNumber' , 'bankAccountShebaNumber' , 'bankAccountCardNumber' , 'registerDate' , 'lastLoginDate' , 'lastUpdateDate']
    $.ajax({
        url: 'http://127.0.0.1:5000/api/v1/socialworker',
        method: 'GET',
        dataType: 'json',
        headers : {
            'Access-Control-Allow-Origin'  : '*'
        },
        success: function(data) {
            console.log(data);
            // $.each(data , function(key , value){
            //     query = '<tr>' ;
            //     $.each(value , function(key , value){
            //         // console.log('key: ' , key);
            //         // console.log('value: ' , value);
            //         query += '<th>' + value + '</th>';                
            //     })
            //     query += '</tr>';
            //     $('#socialWorkerList').append(query);
            // })

            $.each(data , function(key , value){
                var query = '<tr>';
                for(var i = 0 ; i < keys.length ; i++){
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


    $('#sendSocialWorkerData').on('click' , function(e){
        e.preventDefault();

        $.ajax({
            url: 'http://localhost:5000/api/v1/socialworker',
            method: 'POST',
            headers : {
                'Access-Control-Allow-Origin'  : '*'
            },
            data: {
                firstName: $('#socialWorkerFirstName').val(),
                lastName: $('#socialWorkerLastName').val(),
                userName: $('#socialWorkerUserName').val(),
                typeId: $('#socialWorkerType').val(),
                ngoId: $('#socialWorkerNGO').val(),
                birthCertificateNumber: $('#socialWorkerBirthCertificateNumber').val(),
                country: $('#socialWorkerCountry').val(),
                city: $('#socialWorkerCity').val(),
                idNumber: $('#socialWorkerIdNumber').val(),
                idCardUrl: $('#socialWorkerIdCardUrl').val(),
                passportNumber: $('#socialWorkerPassportNumber').val(),
                passportUrl: $('#socialWorkerPassportUrl').val(),
                gender: $('#socialWorkerGender').val(),
                birthDate: $('#socialWorkerBirthDate').val(),
                phoneNumber: $('#socialWorkerPhoneNumber').val(),
                emergencyPhoneNumber: $('#socialWorkerEmergencyPhoneNumber').val(),
                emailAddress: $('#socialWorkerEmailAddress').val(),
                telegramId: $('#socialWorkerTelegramId').val(),
                postalAddress: $('#socialWorkerPostalAddress').val(),
                avatarUrl: $('#socialWorkerAvatarUrl').val(),
                bankAccountNumber: $('#socialWorkerBankAccountNumber').val(),
                bankAccountShebaNumber: $('#socialWorkerBankAccountShebaNumber').val(),
                bankAccountCardNumber: $('#socialWorkerBankAccountCardNumber').val()
                
            },
            success: function(data) {
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        })
        
    })
})
