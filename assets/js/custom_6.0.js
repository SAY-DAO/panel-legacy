//****************** YOUR CUSTOMIZED JAVASCRIPT **********************//
var date_format = 'yyyy-MM-dd HH:mm:ss';

// calculate age from birth date
function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age + " Years old";
}


// null values in tables
function nullValues() {
    var value = '<span class="null">وارد نشده</span>';
    return value;
}

// Error custom dialogue box
function errorTitle() {
    var value = '<span class="errorTitle">خطا رخ داده است</span>';
    return value;
}
function errorContent(val) {
    var value = '<span class="errorContent">' + val + '</span>';
    return value;
}

//needs status in report and need page
function fullPayment() {
    var value = '<img src="assets/images/icons/1.svg" alt="Money transfered" title="Money transfered" />';
    return value;
}

function purchased() {
    var value = '<img src="assets/images/icons/2.svg" alt="Product purchased" title="Product purchased" />';
    return value;
}

function ngoDelivery() {
    var value = '<img src="assets/images/icons/3.svg" alt="Delivered to the NGO" title="Delivered to the NGO" />';
    return value;
}

function childDelivery() {
    var value = '<img src="assets/images/icons/4.svg" alt="Delivered to the child" title="Delivered to the child" />';
    return value;
}

// get the file url and return the tag to show it on html
function getImgFile(fileUrl) {
    var show_file = '<a target="_blank" href="' + baseUrl + fileUrl +'"><img class="tableImg" src="' + baseUrl + fileUrl +'" /></a>';
    return show_file;
}

function getVoiceFile(fileUrl) {
    var show_file = '<audio src="' + baseUrl + fileUrl +'" controls preload="none"></audio>';
    return show_file;
}

function getFile(fileUrl) {
    var files = fileUrl.split(',');
    var result = [];
    var index = 1;
    $.each(files, function(key, value) {
        result.push('<a target="_blank" href="' + baseUrl + value +'">Receipt' + index + '</a>');
        index += 1;
    })    
    return result.join("<br /><br />");
}

// link values
function phoneTo(value) {
    var phone_to = '<a href="tel:' + value + '">' + value + '</a>';
    return phone_to;
}

function mailTo(value) {
    var mail_to = '<a href="mailto:' + value + '" target="_top">' + value + '</a>';
    return mail_to;
}

function linkTo(value) {
    var link_to = '<a href="' + value + '" target="_blank">Click here!</a>';
    return link_to;
}

// Jalali Date Time values
function jalaliDate(value) {
    var jalali_date = -1;
    if (value != null) {
        var that_date = new Date(value);
        jalali_date = (new JDate(that_date).format("dddd D MMMM YYYY")) + "<br />" + that_date.toLocaleTimeString('en-GB');
        // local_date = that_date.toLocaleTimeString();
    } else {
        jalali_date = null;
    }
    
    return jalali_date;
}

// locale Date Time values
function localeDate(value) {
    var locale_date = -1;
    if (value != null) {
        var that_date = new Date(value);
        locale_date = that_date.toLocaleString();
    } else {
        locale_date = null;
    }
    
    return locale_date;
}

//UTC date time
function UTCDate(value) {
    var utc_date_string = new Date(value).toUTCString();
    var utc_date = DateFormat.format.date(utc_date_string, date_format); // u cannot use $.format(...) because it cannot use with jquery validation library, so we use DateFormat.format(...)
    return utc_date;
}

// Cost values
function cost(value) {
    beauty_cost = value.toLocaleString() + ' Toman';
    return beauty_cost;
}

// Custom methods for form validation
$.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size/1024/1024 <= param)
}, 'File size must be less than {0}');

jQuery.validator.addMethod('notEqual', function(value, element, param) {
    return this.optional(element) || value != param;
  }, "Please specify a different (non-default) value");

// Cost field comma and number
$('.cost').on('keyup', function() {
    var n = parseInt($(this).val().replace(/\D/g,''),10);
    $(this).val(n.toLocaleString());
})

// JQuery datetime picker customize
$('.date_time').datetimepicker({
    dateFormat: 'yy-m-d',
    timeFormat: 'H:0:0',
    prevText: '<i class="fa fa-chevron-circle-left custom"></i>',
    nextText: '<i class="fa fa-chevron-circle-right custom"></i>',
    currentText: 'امروز',
    closeText: 'بستن',
    dayNamesMin: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
    firstDay: 6,
});

// Make the text rtl
function rtl(value) {
    return '<span dir="rtl">' + value + '</span>';
}

if (ENVIRONMENT !== 'local') {
    $(document).ready(function(){
        Sentry.init({
            dsn: "https://fe5dce9cacab4187adaa33eec223ef27@sentry.say.company/7",
            integrations: [new Sentry.Integrations.BrowserTracing()],
            tracesSampleRate: 1.0, // Be sure to lower this in production
            environment: ENVIRONMENT,
        });
    });
}
