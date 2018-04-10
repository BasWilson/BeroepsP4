var user, amountOfTickets;
var socket = io();
var responseData, tickets;

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
    socket.emit('getTickets');
  } else {
    // Er is niemand ingelogd
    window.location.href = "/login";
  }
});
}

socket.on('tickets', function (ticketData) {
  handleTickets(ticketData)
});

function handleTickets(ticketData) {
  $( "#ticketTable" ).empty();
  var ticket = '<tr><th>Ticket ID</th><th>Email</th><th>Naam</th><th>Datum</th></tr>';
  $('#ticketTable').append(ticket);
  tickets = ticketData;

  amountOfTickets = 0;
  for (var i = 0; i < ticketData.ticketName.length; i++) {
    amountOfTickets++;
    var ticket = '<tr><td>#'+i+'</td><td>'+ticketData.ticketEmail[i]+'</td><td>'+ticketData.ticketName[i]+'</td><td>'+ticketData.ticketDate[i]+'</td><td id="delete'+i+'" style="color: red"onclick="deleteTicket(this.id)">Verwijder</td><td onclick="viewTicket(this.id)" id="'+i+'">Bekijk</td></tr>';
    $('#ticketTable').append(ticket);
  }
  document.getElementById('amountOfTickets').innerHTML = amountOfTickets

}

function viewTicket(id) {
  $('.viewContainer').show();
  document.getElementById('ticketId').innerHTML = "Ticket ID: "+ id;
  document.getElementById('ticketTitle').innerHTML = "Naam: "+ tickets.ticketName[id];
  document.getElementById('ticketEmail').innerHTML = "Email: "+ tickets.ticketEmail[id];
  document.getElementById('ticketMessage').innerHTML = "Bericht: "+tickets.ticketMessage[id];
  responseData = {
    id: id,
    name: tickets.ticketName[id],
    email: tickets.ticketEmail[id],
    message: tickets.ticketMessage[id],
    response: 0
  };
}
function closePopup() {
  $('.viewContainer').hide();
}

function sendTicket() {
  if (document.getElementById('response').value == "") {
    alert('Voer tekst in');
  } else {
    responseData.response = document.getElementById('response').value;
    closePopup();
    socket.emit('ticketResponse', responseData);
  }
}

function deleteTicket(id) {
  if (id != null || id != undefined) {
    socket.emit('deleteTicket', id);
    closePopup();
    $('#ticketTable').empty();

    socket.emit('getTickets');

  }
}
