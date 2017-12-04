/*eslint-disable*/



$(function() {

  var $table = $("#transactions");
  $.get("/transaction/1", function(data) {
    for (var i = 0; i < data.length; i++) {
      var t = data[i];
      var $row = $('<tr></tr>');
      $row.append(makeData(t.created_at));
      $row.append(makeData(t.to_currency));
      $row.append(makeData(t.amount_to));
      $row.append(makeData(t.price));
      $row.append(makeData(t.from_currency));
      $row.append(makeData(t.amount_from));
      $row.append(makeData(t.amount_left));
      $table.append($row);
    }
  });


  function makeData(info) {
    return $('<td>' + info + '</td>');
  }



});
