/*
* Globale variablen
*/
var currentView;
var data;
var user;

$( document ).ready(function() {

  setTimeout(function() {
    user = firebase.auth().currentUser;
    checkIfSignedIn();
  },600)


  /*
  * Handle clicks
  */

});

function getClassName (id) {

  data.className = id;

  //Ga naar de view met studenten van deze klas
  hideAllViews();
  getStudents();

}
function checkIfSignedIn() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Leraar is ingelogd
    loadProfile(user);
  } else {
    // Er is niemand ingelogd
    window.location.href = "/login";
  }
});
}

function loadProfile() {

  data = {
    name: user.displayName,
    photoUrl: user.photoUrl,
    uid: user.uid,
    className: 0,
    student: 0
  };

  $('#teacherNameSide').html('<strong>'+data.name+'</strong>');
  $('#logoutBtn').show(200);
  $('.profileCardDivSide').show(200);
  $('.profileCardDivSide').css('display', 'flex');

}

function hideAllViews() {
  $('.profileCardDiv').hide(200);
  $('.studentCardDiv').hide(200);
  $('.dashboardCardDiv').hide(200);
  $('.classCardDiv').hide(200);
  $('.classCard').remove('.classCard');
  $('.studentCard').remove('.studentCard');
}

function showProfile() {

  loadProfile();

  $('#teacherName').html('<strong>'+data.name+'</strong>');
  $('.profileCardDiv').show(200);
  $('.headerText').text('Profiel');
  $('#description').text('Hier kunt u uw profiel bekijken en aanpassen');
  $('.profileCardDiv').css('display', 'flex');
  $('.loader').hide(100);

}
function loadClasses() {

  $('.loader').show(100);
  $('.headerText').text('Uw klassen');
  $('#description').text('Kies een klas om te bekijken');

  var dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [];

  var classesRef = db.collection('teachers').doc(data.uid);
  var getDoc = classesRef.get()
      .then(doc => {
          if (!doc.exists) {
              Alert('Deze leraar heeft geen klassen neem contact op met uw adminstrator');
          } else {

              dbClass = doc.data().classes;

              console.log(dbClass);

              //Eerst de oude kaartjes verwijderen voordat we ze opnieuw laden
              $('.classCard').remove('.classCard');


              for (var i = 0; i < dbClass.length; i++) {

                var firstNamesHTML = '<a class="className"><strong>'+dbClass[i]+'</strong></a>';
                var lastNamesHTML = '<a class="className">20 leerlingen</a>';
                //var pointsHTML = '<a class="classPoints">'+dbPoints[i]+'</a>';
                var avatarsHTML = '<img class="classAvatar" src="assets/class.png"/>';

                var leftSideHTML = '<div class="leftSide">'+avatarsHTML+'</div>';
                var rightSideHTML = '<div class="rightSide">'+firstNamesHTML+lastNamesHTML+'</div>';
                var studentCardHTML = '<div class="invisiblePadding"><div onclick="getClassName(this.id)" id="'+dbClass[i]+'" class="classCard" >'+leftSideHTML+rightSideHTML+'</div></div>';

                $('.classCardDiv').append(studentCardHTML);
                $('.loader').hide(100);
                $('.classCardDiv').show(200);
                $('.classCardDiv').css('display', 'flex');

              }
          }
})

}

function getStudents () {


  $('.loader').show(100);
  $('.headerText').html('Leerlingen uit klas <strong>'+data.className+'</strong>');
  $('#description').text('Klik op een leerling voor meer informatie');

  var dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [];

  var teachersRef = db.collection('teachers').doc(data.uid).collection("classes").doc(data.className);
  var getDoc = teachersRef.get()
      .then(doc => {
          if (!doc.exists) {
              Alert('Deze leraar bestaat niet, neem contact op met uw adminstrator');
          } else {

              dbFNames = doc.data().firstnames;
              dbLNames = doc.data().lastnames;
              dbPoints = doc.data().points;
              dbAvatars = doc.data().avatars;

              console.log(dbFNames);
              console.log(dbLNames);
              console.log(dbPoints);
              console.log(dbAvatars);

              //Eerst de oude kaartjes verwijderen voordat we ze opnieuw laden
              $('.classCard').remove('.classCard');
              $('.studentCard').remove('.studentCard');


              for (var i = 0; i < dbFNames.length; i++) {

                var firstNamesHTML = '<a class="studentName">'+dbFNames[i]+'</a>';
                var lastNamesHTML = '<a class="studentName">'+dbLNames[i]+'</a>';
                var pointsHTML = '<a class="studentPoints">'+dbPoints[i]+'</a>';
                var avatarsHTML = '<img class="studentAvatar" src="'+dbAvatars[i]+'"/>';

                var leftSideHTML = '<div class="leftSide">'+avatarsHTML+'</div>';
                var rightSideHTML = '<div class="rightSide">'+firstNamesHTML+lastNamesHTML+'</div>';
                var studentCardHTML = '<div class="invisiblePadding"><div class="studentCard" id="'+i+'">'+leftSideHTML+rightSideHTML+pointsHTML+'</div></div>';

                $('.studentCardDiv').append(studentCardHTML);
                $('.loader').hide(100);
                $('.studentCardDiv').show(200);
                $('.studentCardDiv').css('display', 'flex');

              }
          }
})
}
