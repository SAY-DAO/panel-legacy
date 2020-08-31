
// SAY global URL variables

// var baseUrl = 'http://192.168.111.2:5001';
// var baseUrl = 'http://0.0.0.0:5000';
// var baseUrl = 'https://master.s.sayapp.company';
var baseUrl = 'https://sayapp.company';
var apiEndPointUrl = '/api/v2';
var SAYApiUrl = baseUrl + apiEndPointUrl;
var ENVIRONMENT = 'local';
// console.log("SAY API url: " + SAYApiUrl);

$.ajaxSetup({         
    headers : {
        'Access-Control-Allow-Origin'  : baseUrl,
        'Cache-Control': 'no-cache',
    }
});
