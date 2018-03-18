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


function socketCreateNewClass(name) {

  hideAllViews();
  socket.emit('createNewClass', name);

}

function socketCreateNewStudent(studentData) {

  hideAllViews();
  socket.emit('createNewStudent', studentData);

}
