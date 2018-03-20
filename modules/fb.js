module.exports = {

  addStudentToDB: function (studentData, socket) {

    var dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [], dbClass = [],  negativePoints = [];

    var titleRef = db.collection('classes').doc(studentData.class);
    var getDoc = titleRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('Klas bestaat niet');
            } else {

                dbFNames = doc.data().firstnames;
                dbLNames = doc.data().lastnames;
                dbPoints = doc.data().points;
                dbNegativePoints = doc.data().negativePoints;
                dbAvatars = doc.data().avatars;
                dbClass = doc.data().class;

                studentPoints = parseInt(studentData.points);

                dbFNames.push(studentData.firstname);
                dbPoints.push(studentPoints);
                dbAvatars.push(studentData.avatar);
                dbLNames.push(studentData.lastname);
                dbClass.push(studentData.class);

                var amountOfStudents = doc.data().totalAmount;
                var newAmountOfStudents = amountOfStudents + 1;

                var studentsRef = db.collection('classes').doc(studentData.class);

                var setWithOptions = studentsRef.set({
                  firstnames: dbFNames,
                  lastnames: dbLNames,
                  avatars: dbAvatars,
                  points: dbPoints,
                  class: dbClass,
                  negativePoints: dbNegativePoints,
                  totalAmount: newAmountOfStudents
                }, { merge: true });
                socket.emit('studentCreated', studentData.firstname);
            }
        })
        .catch(err => {
            console.log('Fout tijdens het ophalen van studenten: ', err);
        });
  },

  removeStudentFromDB: function (data) {

    var dbNames = [], dbPoints = [], dbAvatars = [];

    var titleRef = db.collection('teachers').doc(data.uid).collection(data.class);
    var getDoc = titleRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                dbTitles = doc.data().titles;
                dbReasons = doc.data().redenen;
                dbTime = doc.data().dateTime;

                //reverse the arrays to be in line with fb
                dbTitles.reverse();
                dbReasons.reverse();
                dbTime.reverse();
                //Remove from arrays
                dbTitles.splice(data.cardNumber, 1);
                dbReasons.splice(data.cardNumber, 1);
                dbTime.splice(data.cardNumber, 1);
                //reverse arrays back to be in line with user app
                dbTitles.reverse();
                dbReasons.reverse();
                dbTime.reverse();

                var cardsRef = db.collection('users').doc(data.uid);

                var setWithOptions = cardsRef.set({
                  titles: dbTitles,
                  redenen: dbReasons,
                  dateTime: dbTime
                }, { merge: true });
                data.confirmed = true;

            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
  },

  editPointsInDB: function (data, socket) {

    var dbPoints = [], dbNegativePoints = [];
    var newAmountOfPoints = 0;
    var newAmountOfNegativePoints = 0;

    var titleRef = db.collection('classes').doc(data.className);
    var getDoc = titleRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('Student bestaat niet');
            } else {

                dbPoints = doc.data().points;
                dbNegativePoints = doc.data().negativePoints;

                studentPoints = parseInt(dbPoints[data.id]);
                studentNegativePoints = parseInt(dbNegativePoints[data.id]);
                //kijken of we punten toevoegen of weghalen
                if (data.addingPoints == false) {
                  newAmountOfNegativePoints = studentNegativePoints + 1;
                  data.newNegativePoints = parseInt(newAmountOfNegativePoints);
                  dbNegativePoints[data.id] = newAmountOfNegativePoints;
                  var setWithOptions = titleRef.set({
                    negativePoints: dbNegativePoints
                  }, { merge: true });
                  socket.emit('pointsChanged', data);
                } else {
                  newAmountOfPoints = studentPoints + 1;
                  data.newPoints = parseInt(newAmountOfPoints);
                  dbPoints[data.id] = newAmountOfPoints;
                  var setWithOptions = titleRef.set({
                    points: dbPoints
                  }, { merge: true });
                  socket.emit('pointsChanged', data);
                }



            }
        })
        .catch(err => {
            console.log('Fout tijdens het ophalen van student: ', err);
        });
  },

  addClassToDB: function (name, socket) {

    var classData = {
      firstnames: [],
      lastnames: [],
      avatars: [],
      points: [],
      class: [],
      totalAmount: 0
    };

    db.collection("classes").doc(name).set(classData).then(function() {
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


//ADMIN
var admin = require('firebase-admin');
var serviceAccount = require('../keys/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'beoordelings-systeem',
    clientEmail: 'firebase-adminsdk-r1syi@beoordelings-systeem.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCirMMqpCb9gfSx\nryyORUvY03LL7heTFAGSILMmvuhjVE0qMWGWUAP0l/i67wG+KcKA39pwyb2zgS9+\n2YbGAuI0Ba3gGvf1eoNWCKFTDvBXBUfduQ2e8aq7cdO/ZtwdqB6bCu5lOr8iHV2u\nybSPgvih1RvrKJTEHPqPeHMB+jjrNGNdeo1khfHfIpNS9Ly1wzct5qIhD4zMQkg1\nRVbkGOt4sCZ9njfzZHA6pSkkL+TiyZi8+GJsfT6IhIh/NxWOgPvRH/MMoxeI3wbt\ni+BE10NsF2gDF12PEAI22IIY71SSCKv34CcIp/SuVfKZwp2RmhCgKWvUT0E1ZpU8\nbJqvQLpZAgMBAAECggEAB4xerf7Z9E9wbEJFngBnKZN+MypEG8YE4KP1zCl1nQ5P\nWlLaRWBHHrVijEIE4a8MYHCCsVMbI1YuPwOW9l8x4doVnF2D/fcGWxqhabo6ur76\n+7XXhPWPx4zbl3kNY67mZKlYMIhOUCXur+qaH0KjiNbbqcjDRmpV0gxzwba7p2Y+\n5+Kon+pM00QRMNYr/iuqDlqnT+5ezlA/S5SJTyLb12W31pK7Sokiv7o60bZNdi6K\n0VNExuEmErMm8W2AKt8/x4NxadP36vISPhsgPx6dy4cBQZbiSsxGLU1LUPjBptgL\nVz1lNhzqZIbEC4qhvGMMl8hOouGjQhQdFfmfLChXJQKBgQDeZxGaNLzZzeDf3bt2\nfeYspeIifPnL9cQlaGhv7tRTEEAnhzaFfyUs/L18q6ksvRVXaFP7D/RzjM9L7QbY\nbBBQEOIjhr9EvOHthVO4wrNE6ZQ0yiAbtEXRKtVKzByiWHbZO4kR1PQcR9MoBQ8X\nNri7XC0KNDz/yk6vq6lGrBMwmwKBgQC7P9qjVUDS59kF9xZaTyBz163RgGsNeIpK\njI+3QQSz1HssJOkDalyeVtMr2CXPbNaaEgvbGbMOgrfgV49Qt77SaS18Pk1o/HqZ\nmkbw2mAxLP/koUGvUbFGjJqxbU+9SVZf4usJy2OpIvuhOKHoQhB6Jt30wtDVb4YU\nBuVo6IhuGwKBgDB8qAnGlaWmjPBBly0uJZB2WebK+GrPGgRNzvcYSpIRaOs1P127\nao90SptzkV5/mreDt0t1HwZSHJ+g/W0RojzScXrtVaXWyCrQdoBBcnQDuJwJtRZV\nJyODAx1bgqKiRsb1g9yvYMkJn6+J6tBUzdGLNwaSfPoHUUBbXHxb55MhAoGBAKJP\nL031UEOBBPXOwGl3vUGs6tZ24lTC79y/CrRmf5UB0eLp+7EiOTZnPJT8v4mVZlAW\n5H//Pt6NIKYuP+RP4fCxiuPvfVpLwFn1CRktscPupcGgpjc6MNheeJjjkAMb1us2\n31WWH8U0tbmCRZX17iJ0HmFTnYHlMeuaLrFJHzmRAoGBANSPV3R0Nz6/IlPHGtd8\nn/07rdRmGD+fLq4buZFYgSfVmAKlYW1z0MTG00rNFsX8qDKAA0ZL4G+0T9O+/oZS\nI2t5O2BsY+FY9BsQzYvh2llJvFG6Pj4CUMz/8A9W+sATA8hFiUVcAdRjCLpmeHnC\nAj3E81bsmNYgZGXa4n53W9yQ\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://beoordelings-systeem.firebaseio.com'
});


var refreshToken; // Get refresh token from OAuth2 flow

// Get a reference to the database service
var db = admin.firestore();
