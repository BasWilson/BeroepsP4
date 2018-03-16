module.exports = {

  addStudent: function (data) {


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

var reasonsDokter = [
  "Oorontsteking",
  "Pijn in de buik",
  "Grieperig",
  "Erge misselijkheid",
  "Evenwichteloosheid",
  "Andere redenen"
];

var reasonsOrtho = [
  "Nieuw slotje",
  "Spalkje gebroken",
  "Nieuwe beugel passen"
];

var reasonsTandarts = [
  "Verstandskies getrokken",
  "Controlle afspraak",
  "Tanden bleken"
];

var reasonsRijbewijs = [
  "Theorie examen",
  "Praktijk examen"
]
