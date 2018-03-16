// Initialize Firebase
var config = {
  apiKey: "AIzaSyBTrKr00o2PjpV2ZcCAzaCuxWiab72QGGc",
  authDomain: "beoordelings-systeem.firebaseapp.com",
  databaseURL: "https://beoordelings-systeem.firebaseio.com",
  projectId: "beoordelings-systeem",
  storageBucket: "beoordelings-systeem.appspot.com",
  messagingSenderId: "493573103241"
};
firebase.initializeApp(config);


$( document ).ready(function() {
  getStudents();


});


function getStudents (user) {

  var dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [];

  var teachers = firebase.collection('teachers').doc("crwDpW5Yaqb2SHZv1Aaf6kqmbNv1").collection("q95r2DJH2STnDzew77sE");
  var getDoc = titleRef.get()
      .then(doc => {
          if (!doc.exists) {
              console.log('Leraar bestaat niet');
          } else {

              dbFNames = doc.data().firstname;
              dbLNames = doc.data().lastname;
              dbPoints = doc.data().points;
              dbAvatars = doc.data().avatars;

              console.log(dbFNames);
              console.log(dbLNames);
              console.log(dbPoints);
              console.log(dbAvatars);


          }

})
}
