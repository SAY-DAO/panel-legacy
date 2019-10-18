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


// get the file url and return the tag to show it on html

function getImgFile(fileUrl){
    var show_file = '<a target="_blank" href="http://sayapp.company/'+ fileUrl +'"><img class="tableImg" src="http://sayapp.company/'+ fileUrl +'" /></a>';
    return show_file;
}


// test


