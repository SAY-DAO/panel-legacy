//****************** YOUR CUSTOMIZED JAVASCRIPT **********************//

// calculate age from birth date

function getAge(DOB){
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())){
        age = age - 1;
    }
    return age;
}


// null values in tables

function nullValues(){
    var value = '<span class="null">Not entered</span>';
    return value;
}


// get the file url and return the tag to show it on html

function getImgFile(fileUrl){
    var show_file = '<a target="_blank" href="' + baseUrl + fileUrl +'"><img class="tableImg" src="' + baseUrl + fileUrl +'" /></a>';
    return show_file;
}

function getVoiceFile(fileUrl){
    var show_file = '<audio src="' + baseUrl + fileUrl +'" controls></audio>';
    return show_file;
}

function getFile(fileUrl){
    var show_file = '<a target="_blank" href="' + baseUrl + fileUrl +'">Click here to see the file</a>';
    return show_file;
}

// link values
function phoneTo(value){
    var phone_to = '<a href="tel:' + value + '">' + value + '</a>';
    return phone_to;
}

function mailTo(value){
    var mail_to = '<a href="mailto:' + value + '" target="_top">' + value + '</a>';
    return mail_to;
}

function linkTo(value){
    var link_to = '<a href="' + value + '" target="_blank">' + value + '</a>';
    return link_to;
}