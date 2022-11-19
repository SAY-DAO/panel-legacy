$(document).ready(function () {
  // fetch countries
  $.ajax({
    url: `${SAYApiUrl}/countries`,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      $.each(data , function(key ,value){
        var query = '';
            query += '<option value="' + value['id'] + '">' + value['name'] + '</option>';
        $('#social_worker_country').append(query);
      })
    },
    error: function(data) {
      console.log(data.responseJSON.message);
    }
  })

  // fetch states
  $('.country').change(function() {
    $('#social_worker_city').empty();
    var selected_country = $(this).val();
    $.ajax({
      url: `${SAYApiUrl}/countries/${selected_country}/states`,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        $.each(data , function(key ,value){
          var query = '';
              query += '<option value="' + value['id'] + '">' + value['name'] + '</option>';
          $('#social_worker_city').append(query);
        })
      },
      error: function(data) {
        console.log(data.responseJSON.message);
      }
    })
  }) 
})