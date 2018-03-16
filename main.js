var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

//Modules
var students = require('./modules/students');
var fb = require('./modules/fb');


//HANDLE PAGES HERE
app.use(express.static(path.join(__dirname, 'public')));


app.get('/requestcard', function(req, res){
  var data = { //paramaters
    name: req.query.reason,
    points: req.query.dateTime,
    uid: req.query.uid,
    avatar: ,
    class: ,
    confirmed: false
  };
  cards.createCard(data);
  setTimeout(function() {
    var confirmed = data.confirmed;
    res.send(confirmed);
  },3000)
  console.log("user: "+data.uid+", requested a card, with data: " + data.reason );
});

//SOCKET CONNECTIONS
io.on('connection', function(socket){

//Handle sockets from here
    console.log('Leraar aangemeld');

  socket.on('disconnect', function(){

    console.log('Leraar afgemeld');

  });

  /*
   * De leraar wil een student toevoegen aan zijn/haar klas
  */
  socket.on('addStudent', function(data){
    students.addStudentToDB(data);
  });

  /*
   * De leraar wil een student verwijderen uit zijn/haar klas
  */
  socket.on('removeStudent', function(data){
    students.removeStudentFromDB(data);
  });

  /*
   * De leraar geeft een punt aan een student uit zijn/haar klas
  */
  socket.on('setStudentPoints', function(data){
    students.setStudentPointsInDB(data);
  });

  /*
   * De leraar wijzigd een student uit zijn/haar klas
  */
  socket.on('editStudent', function(data){
    students.editStudentInDb(data);
  });


});
http.listen(8080, function(){
  console.log('Beoordelings Systeem server opgestart');
})
