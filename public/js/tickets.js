var user, amountOfTickets;
var socket = io();

$( document ).ready(function() {

  setTimeout(function() {
    user = firebase.auth().currentUser;
    if (user.uid == "uFabLVpyEHSCsiUHm9bPmEvHsKi2") {
        allowed = true;
        checkIfSignedIn();
      } else {
        window.location.href = "/login";
      }
  },600)

});

function checkIfSignedIn() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById('username').innerHTML = user.displayName;
    getTickets();
  } else {
    // Er is niemand ingelogd
    window.location.href = "/login";
  }
});
}

function getTickets() {
  socket.emit('getTickets');
}

socket.on('tickets', function (ticketData) {
  handleTickets(ticketData)
});
function handleTickets(ticketData) {
  amountOfTickets = 0;
  for (var i = 0; i < ticketData.ticketID.length; i++) {
    amountOfTickets++;
    var ticket = '<tr><td>#'+ticketData.ticketID[i]+'</td><td>'+ticketData.ticketMessage[i]+'</td><td>-</td><td>'+ticketData.ticketName[i]+'</td></tr>';
    $('#ticketTable').append(ticket);
  }
  document.getElementById('amountOfTickets').innerHTML = amountOfTickets

}
