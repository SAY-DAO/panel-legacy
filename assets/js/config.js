
// SAY global URL variables

// var baseUrl = 'http://10.10.10.18:5000';
// var baseUrl = 'http://0.0.0.0:5000';
var baseUrl = 'https://staging.sayapp.company';
// var baseUrl = 'https://sayapp.company';
var apiEndPointUrl = '/api/v2';
var SAYApiUrl = baseUrl + apiEndPointUrl;
// console.log("SAY API url: " + SAYApiUrl);

$.ajaxSetup({         
    headers : {
        'Access-Control-Allow-Origin'  : baseUrl,
        'Cache-Control': 'no-cache',
    }
});
