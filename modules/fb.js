module.exports = {

  addStudentToDB: function (data) {

    var dbNames = [], dbPoints = [], dbAvatars = [];

    var titleRef = db.collection('teachers').doc(data.uid);
    var getDoc = titleRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('Leraar bestaat niet');
            } else {

                dbNames = doc.data().names;
                dbPoints = doc.data().points;
                dbAvatars = doc.data().avatars;

                console.log(dbNames);
                console.log(dbPoints);
                console.log(dbAvatars);

                dbNames.push(data.name);
                dbPoints.push(data.points);
                dbAvatars.push(data.avatar);


                var studentsRef = db.collection('students').doc(data.uid).collection(data.class);

                var setWithOptions = studentsRef.set({
                  names: dbNames,
                  points: dbPoints,
                  avatars: dbAvatars
                }, { merge: true });
                data.confirmed = true;

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

                console.log(data.cardNumber);
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

  createNewAccount: function (data) {

    var dbTitles = ["Voorbeeld kaartje"], dbReasons = ["Als je er voor kiest er een reden bij te zetten dan komt die hier"], dbTime = ["No limit"];

    var cardsRef = db.collection('users').doc(data.uid);

    //Create the default intro card
    var setCardData = cardsRef.set({
      titles: dbTitles,
      redenen: dbReasons,
      dateTime: dbTime
    }, { merge: true });

    //Create usefull user information
    var setUserData = cardsRef.set({
      balance: 0,
      subscription: 0
    }, { merge: true });

  },

  createSubscription: function (data) {
    var price = 0;
    var d = new Date();
    var timestamp = d.setTime()	;
    var subtype;
    if (data.subtype == 0) {
      price = 0;
      data.confirmed = true;
    } else if (data.subtype == 1) {
      price = 2.5;
      data.confirmed = true;
    } else if (data.subtype == 2) {
      price = 5.0;
      data.confirmed = true;
    } else {
      data.confirmed = false;
    }

    if (data.confirmed == false) {
      //Stop
    } else {
      var userRef = db.collection('users').doc(data.uid);

      var getDoc = userRef.get()
          .then(doc => {
              if (!doc.exists) {
                  console.log('No such document!');
              } else {
                  oldMoney = doc.data().balance;
                  if (oldMoney < price) {
                    data.confirmed = false;
                  } else {
                    var newBalance = oldMoney - price;
                    subtype = parseInt(data.subtype);
                    //Create usefull user information
                    var setUserData = userRef.set({
                      balance: newBalance,
                      subscription: subtype,
                      dateOfPay: "timestamp"
                    }, { merge: true });
                    data.confirmed = true;
                  }

              }
    })
    }
}
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
