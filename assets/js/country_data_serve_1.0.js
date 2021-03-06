//Country field in forms

$(document).ready(function(){
    isAuthorized();

    var keys = ['alpha2Code', 'translations']

    // getting Country's calling id and name
    
    $.ajax({
        url: 'https://restcountries.eu/rest/v2/all',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $.each(data , function(key ,value){
                var query = '';
                for(var i = 0 ; i < keys.length/2 ; i++){
                    query += '<option value="' + value[keys[0]] + '">' + value[keys[1]].fa + '</option>';
                }
                $('#ngo_country').append(query);
                console.log(query);
            })
        },
        error: function(data) {
            console.log(data);
        }
    })

})