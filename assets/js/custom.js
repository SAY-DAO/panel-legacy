//****************** YOUR CUSTOMIZED JAVASCRIPT **********************//

// calculate age from birth date
function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1 + " Years old";
    }
    return age;
}


// null values in tables
function nullValues() {
    var value = '<span class="null">Not entered</span>';
    return value;
}


//needs status
function fullPayment() {
    var value = '<img src="assets/images/icons/1.svg" alt="Fully paid" title="Fully paid" />';
    return value;
}

function purchased() {
    var value = '<img src="assets/images/icons/2.svg" alt="Purchased" title="Purchased" />';
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

function doneNeed(status) {
    var value = '<span class="doneNeed">' + status + '</span>';
    return value;
}

function needInProgress(status) {
    var value = '<span class="needInProgress">' + status + '</span>';
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
    var show_file = '<a target="_blank" href="' + baseUrl + fileUrl +'">Click here to see the file</a>';
    return show_file;
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

// Date Time values
function localDate(value) {
    var local_date = -1;
    if (value != null) {
        var that_date = new Date(value);
        local_date = that_date.toLocaleString();
    } else {
        local_date = '-';
    }
    
    return local_date;
}

// Cost values
function cost(value) {
    beauty_cost = value.toLocaleString() + ' Toman';
    return beauty_cost;
}