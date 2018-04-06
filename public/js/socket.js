var socket = io();

/*
 * HANDLE Students
*/
socket.on('classCreated', function (name) {
  $('.loader').hide(100);
  var pText = 'U heeft een nieuwe klas toegevoegd.';
  showPopup(pText);
});

socket.on('studentCreated', function (name) {
  $('.loader').hide(100);
  var pText = 'U heeft '+name+' toegevoegd.';
  showPopup(pText);
});

socket.on('pointsChanged', function (data) {

  if (data.addingPoints == true) {
    $('#points'+data.id).html("Positiviteit: <strong>"+ data.newPoints+"</strong>");
    $('#points'+data.id).css('color', 'green');
    setTimeout(function() {
      $('#points'+data.id).css('color', 'black');
    },2000);
  } else {
    $('#negativePoints'+data.id).html("Negativiteit: <strong>"+ data.newNegativePoints+"</strong>");
    $('#negativePoints'+data.id).css('color', 'red');
    setTimeout(function() {
      $('#negativePoints'+data.id).css('color', 'black');
    },2000);  }

});

function socketCreateNewClass(name) {

  hideAllViews();
  socket.emit('createNewClass', name);

}

function socketCreateNewStudent(studentData) {

  hideAllViews();
  socket.emit('createNewStudent', studentData);

}

function socketEditPoint(data) {
  socket.emit('editPoints', data);

}

function socketEmitTicket(ticketData) {
  socket.emit('supportTicket', ticketData);
}
