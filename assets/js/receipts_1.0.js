
const getReceiptsByNeedId = (id, handleData) => {
  $.ajax({
      url: `${SAYApiUrl}/needs/${id}/receipts`,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          handleData(data)
      },
      error: function(data) {
          console.log(data.responseJSON.message);
      }
  })
}

const getReceiptById = (id, handleData) => {
  $.ajax({
      url: `${SAYApiUrl}/receipts/${id}`,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          handleData(data)
      },
      error: function(data) {
          console.log(data.responseJSON.message);
      }
  })
}

const delNeedReceiptById = (needId, receiptId) => {
  $.ajax({
      url: `${SAYApiUrl}/needs/${needId}/receipts/${receiptId}`,
      method: 'DELETE',
      beforeSend: function () {
          return confirm('Are you sure?');
      },
      success: function(data) {
          alert(`Success\n${data.title} deleted from this need successfully.`);
          showNeedReceipt(needId);
      },
      error: function(data) {
          console.log(data.responseJSON.message);
      }
  })
}

const showNeedReceipt = (id) => {
  $('#need_receipts').empty();

  getReceiptsByNeedId(id, function(output) {
      if (Boolean(output.length)) {
          $.each(output, (key, receipt) => {
              var query = '';
              var accessibility = receipt['isPublic'] ? 'Public' : 'Private';
              
              query += `<tr>\
                          <td id=${receipt['id']}>\
                              <button class="btn btn-rounded btn-transparent btn-danger btn-sm btn-block delReceipt">Delete</button>\
                              <button class="btn btn-rounded btn-transparent btn-primary btn-sm btn-block editReceipt">Edit</button>\
                          </td>\
                          <td>${linkTo(receipt['attachment'])}</td>\
                          <td>${receipt['code'] || nullValues()}</td>\
                          <td>${accessibility}</td>\
                          <td>${receipt['title'] || nullValues()}</td>\
                          <td>${receipt['description'] || nullValues()}</td>\
                      </tr>`
              $('#need_receipts').append(query);
          })
      } else {
          var query = '';
          query += `<h5>رسیدی ثبت نشده</h5>`
          $('#need_receipts').append(query);
        }
  })
}