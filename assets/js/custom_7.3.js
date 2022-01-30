//****************** YOUR CUSTOMIZED JAVASCRIPT **********************//
var date_format = "yyyy-MM-dd HH:mm:ss";

// calculate age from birth date
function getAge(DOB) {
  var today = new Date();
  var birthDate = new Date(DOB);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
    age = age - 1;
  }
  return age + " ساله";
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
  var value = '<span class="errorContent">' + val + "</span>";
  return value;
}

//needs status in report and need page
function fullPayment() {
  var value =
    '<img src="assets/images/icons/1.svg" alt="Money transfered" title="Money transfered" />';
  return value;
}

function purchased() {
  var value =
    '<img src="assets/images/icons/2.svg" alt="Product purchased" title="Product purchased" />';
  return value;
}

function ngoDelivery() {
  var value =
    '<img src="assets/images/icons/3.svg" alt="Delivered to the NGO" title="Delivered to the NGO" />';
  return value;
}

function childDelivery() {
  var value =
    '<img src="assets/images/icons/4.svg" alt="Delivered to the child" title="Delivered to the child" />';
  return value;
}

// get the file url and return the tag to show it on html
function getImgFile(fileUrl) {
  if (fileUrl) {
    var show_file =
      '<a target="_blank" href="' +
      fileUrl +
      '"><img class="tableImg" src="' +
      fileUrl +
      '" /></a>';
    return show_file;
  } else {
    return;
  }
}

function getVoiceFile(fileUrl) {
  if (fileUrl) {
    var show_file =
      '<audio src="' + fileUrl + '" controls preload="none"></audio>';
    return show_file;
  } else {
    return;
  }
}

function getFile(fileUrl) {
  if (fileUrl) {
    var files = fileUrl.split(",");
    var result = [];
    var index = 1;
    $.each(files, function (key, value) {
      result.push(
        '<a target="_blank" href="' + value + '">Receipt' + index + "</a>"
      );
      index += 1;
    });
    return result.join("<br /><br />");
  } else {
    return;
  }
}

// link values
function phoneTo(value) {
  var phone_to = '<a href="tel:' + value + '">' + value + "</a>";
  return phone_to;
}

function mailTo(value) {
  var mail_to =
    '<a href="mailto:' + value + '" target="_top">' + value + "</a>";
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
    jalali_date = new JDate(that_date).format("dddd D MMMM YYYY");
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
    locale_date = that_date.toLocaleString().split(",")[0];
  } else {
    locale_date = null;
  }

  return locale_date;
}

//sending date time
function sendingDate(value) {
  // var utc_date_string = new Date(value).toUTCString();
  // var utc_date = DateFormat.format.date(utc_date_string, date_format); // u cannot use $.format(...) because it cannot use with jquery validation library, so we use DateFormat.format(...)

  // cannot change toLocaleString separator format to - like utc, so I use Sweden time format.
  var myDate = new Date(value).toLocaleDateString("sv-SE");
  return myDate;
}

// Cost values
function cost(value) {
  if (value) {
    beauty_cost = value.toLocaleString() + " Toman";
    return beauty_cost;
  } else {
    return;
  }
}

// Custom methods for form validation
$.validator.addMethod(
  "filesize",
  function (value, element, param) {
    return (
      this.optional(element) || element.files[0].size / 1024 / 1024 <= param
    );
  },
  "File size must be less than {0}"
);

jQuery.validator.addMethod(
  "notEqual",
  function (value, element, param) {
    return this.optional(element) || value != param;
  },
  "Please specify a different (non-default) value"
);

// Cost field comma and number
$(".cost").on("keyup", function () {
  var n = toEnglishNumber($(this).val());
  var number = parseInt(n.replace(/\D/g, ""), 10);
  $(this).val(number.toLocaleString());
});

// Make the text rtl
function rtl(value) {
  return '<span dir="rtl">' + value + "</span>";
}

// JQuery datetime picker customize
$(".date_time").datetimepicker({
  showTimepicker: false,
  dateFormat: "yy-m-d",
  timeFormat: "03:30:0",
  prevText: '<i class="fa fa-chevron-circle-left custom"></i>',
  nextText: '<i class="fa fa-chevron-circle-right custom"></i>',
  currentText: "امروز",
  closeText: "بستن",
  dayNamesMin: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
  firstDay: 6,
});

if (ENVIRONMENT !== "local") {
  $(document).ready(function () {
    Sentry.init({
      dsn: "https://fe5dce9cacab4187adaa33eec223ef27@sentry.say.company/7",
      integrations: [new Sentry.Integrations.BrowserTracing()],
      tracesSampleRate: 1.0, // Be sure to lower this in production
      environment: ENVIRONMENT,
    });
  });
}

function SortByDateAsc(a, b) {
  aDate = new Date(a.status_updated_at);
  bDate = new Date(b.status_updated_at);

  return aDate - bDate;
}

function SortByDateDesc(a, b) {
  aDate = new Date(a.status_updated_at);
  bDate = new Date(b.status_updated_at);

  return bDate - aDate;
}

function toEnglishNumber(strNum) {
  var pn = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  var en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var an = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  var cache = strNum;
  for (var i = 0; i < 10; i++) {
      var regex_fa = new RegExp(pn[i], 'g');
      var regex_ar = new RegExp(an[i], 'g');
      cache = cache.replace(regex_fa, en[i]);
      cache = cache.replace(regex_ar, en[i]);
  }
  return cache;
}
