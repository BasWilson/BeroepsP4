var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

//Modules
var students = require('./modules/students');
var classes = require('./modules/classes');
var fb = require('./modules/fb');


//HANDLE PAGES HERE
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/dashboard.htm');
});
app.get('/dashboard', function(req, res){
res.sendFile(__dirname + '/views/dashboard.htm');
});

app.get('/login', function(req, res){
res.sendFile(__dirname + '/views/login.htm');
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
  socket.on('createNewStudent', function(studentData){
    //Student wordt aangemaakt
    fb.addStudentToDB(studentData, socket);
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
  socket.on('editPoints', function(data){
    fb.editPointsInDB(data, socket);
  });

  /*
   * De leraar wijzigd een student uit zijn/haar klas
  */
  socket.on('editStudent', function(data){
    students.editStudentInDb(data);
  });

  /*
   * De leraar voegt een klas toe
  */
  socket.on('createNewClass', function(name){
    fb.addClassToDB(name, socket);
  });
});
http.listen(8080, function(){
  console.log('Beoordelings Systeem server opgestart');
})
