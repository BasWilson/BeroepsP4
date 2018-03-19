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
  $('#points'+data.id).html("Punten: <strong>"+ data.newPoints+"</strong>");

  if (data.addingPoints == true) {
    $('#points'+data.id).css('color', 'green');
    setTimeout(function() {
      $('#points'+data.id).css('color', 'black');
    },2000);
  } else {
    $('#points'+data.id).css('color', 'red');
    setTimeout(function() {
      $('#points'+data.id).css('color', 'black');
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
