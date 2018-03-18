module.exports = {

  addClassToDB: function (name, socket) {

    var classData = {
      firstnames: [],
      lastnames: [],
      avatars: [],
      points: [],
      class: []
    };

    db.collection("classes").doc(className).set(classData).then(function() {
        console.log("Nieuwe klas toegevoegd");
        socket.emit('classCreated');
    });
},

};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

//Modules
var fb = require('./fb');
