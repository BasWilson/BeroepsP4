/*
* Globale variablen
*/
var currentView;
var data;
var user;
var dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [];
var totalStudents, totalPoints;

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
  allStudents = false;
  getStudents(allStudents);

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
  $('.profileCardDivSide').css('display', 'flex');
  $('.profileCardDivSide').show(200);

}

function hideAllViews() {

  $('.profileCardDiv').hide(200);
  $('.studentCardDiv').hide(200);
  $('.dashboardCardDiv').hide(200);
  $('.classCardDiv').hide(200);
  $('.extraCardDiv').hide(200);
  $('.newClassCardDiv').hide(200);
  $('.newClassDiv').hide(200);
  $('.newStudentDiv').hide(200);
  $('.singleStudentDiv').hide(200);
  $('.classCard').remove('.classCard');
  $('.studentCard').remove('.studentCard');
  $('.singleStudentCard').remove('.singleStudentCard');
  clearArrays();
  clearCards();
}

function hideAllViewsWithoutClearingCache() {

  $('.profileCardDiv').hide(200);
  $('.studentCardDiv').hide(200);
  $('.dashboardCardDiv').hide(200);
  $('.classCardDiv').hide(200);
  $('.extraCardDiv').hide(200);
  $('.newClassCardDiv').hide(200);
  $('.newClassDiv').hide(200);
  $('.newStudentDiv').hide(200);
  $('.classCard').remove('.classCard');
  $('.studentCard').remove('.studentCard');
  $('.singleStudentCard').remove('.singleStudentCard');

}
function showProfile() {

  loadProfile();

  $('.loader').hide(100);
  $('#teacherName').html('<strong>'+data.name+'</strong>');
  $('.headerText').text('Profiel');
  $('#description').text('Hier kunt u uw profiel bekijken en aanpassen');
  $('.profileCardDiv').css('display', 'flex');
  $('.profileCardDiv').show(400);

}

function showDashboard() {
  $('.headerText').text('Dashboard');
  $('#description').text('Wat wilt u doen?');
  $('.dashboardCardDiv').show(200);
  $('.dashboardCardDiv').css('display', 'flex');
}

function loadClasses() {

  $('.loader').show(100);
  $('.headerText').text('Uw klassen');
  $('#description').text('Kies een klas om te bekijken');

  var classesRef = db.collection('teachers').doc(data.uid);
  var getDoc = classesRef.get()
      .then(doc => {
          if (!doc.exists) {
            showPopup(pText = 'Deze leraar heeft geen klassen neem contact op met uw adminstrator');
          } else {

              dbClass = doc.data().classes;

              console.log(dbClass);

              //Eerst de oude kaartjes verwijderen voordat we ze opnieuw laden
              $('.classCard').remove('.classCard');


              for (var i = 0; i < dbClass.length; i++) {

                var firstNamesHTML = '<a class="className"><strong>'+dbClass[i]+'</strong></a>';
                //var pointsHTML = '<a class="classPoints">'+dbPoints[i]+'</a>';
                var avatarsHTML = '<img class="classAvatar" src="assets/class.png"/>';

                var leftSideHTML = '<div class="leftSide">'+avatarsHTML+'</div>';
                var rightSideHTML = '<div class="rightSide">'+firstNamesHTML+'</div>';
                var studentCardHTML = '<div onclick="getClassName(this.id)" id="'+dbClass[i]+'" class="classCard" >'+leftSideHTML+rightSideHTML+'</div>';

                $('.classCardDiv').append(studentCardHTML);
                $('.loader').hide(0);
                $('.classCardDiv').css('display', 'flex');
                $('.classCardDiv').show(400);

              }
          }
})

}

function getStudents (allStudents) {


  $('.loader').show(100);
  $('.headerText').html('Leerlingen uit klas <strong>'+data.className+'</strong>');
  $('#description').text('Klik op een leerling voor meer informatie');

  if (allStudents == true) {
    $('.headerText').html('Al uw leerlingen');
  }
  var studentsRef = db.collection('classes').doc(data.className);
  var getDoc = studentsRef.get()
      .then(doc => {
          if (!doc.exists) {
            showPopup(pText = 'Deze klas bestaat niet, neem contact op met uw adminstrator');
          } else {

              dbFNames = doc.data().firstnames;
              dbLNames = doc.data().lastnames;
              dbPoints = doc.data().points;
              dbAvatars = doc.data().avatars;

              //Het overzicht schermpje instellen
              totalStudents = dbFNames.length;
              //De totale punten stellen we in de loop in
              totalPoints = 0;

              if (dbFNames == "" && allStudents == false) {
                showPopup(pText = 'Deze klas heeft geen leerlingen');
                $('.loader').hide(0);
              }

              console.log(dbFNames);
              console.log(dbLNames);
              console.log(dbPoints);
              console.log(dbAvatars);


              for (var i = 0; i < dbFNames.length; i++) {

                totalPoints = totalPoints + dbPoints[i];

                var firstNamesHTML = '<a class="studentName">'+dbFNames[i]+'</a>';
                var lastNamesHTML = '<a class="studentName">'+dbLNames[i].substring(0,1)+'.'+'</a>';
                var pointsHTML = '<a class="studentPoints">'+dbPoints[i]+'</a>';
                var avatarsHTML = '<img class="studentAvatar" src="'+dbAvatars[i]+'"/>';

                var leftSideHTML = '<div class="leftSide">'+avatarsHTML+'</div>';
                var rightSideHTML = '<div class="rightSide">'+firstNamesHTML+lastNamesHTML+'</div>';
                var studentCardHTML = '<div class="studentCard" onclick="openEditStudent(this.id)" id="'+i+'">'+leftSideHTML+rightSideHTML+pointsHTML+'</div>';

                $('.studentCardDiv').append(studentCardHTML);

              }

              $('.loader').hide(0);
              $('.studentCardDiv').css('display', 'flex');
              $('.studentCard').css('margin', 'auto');
              $('.studentCard').css('marginBottom', '10px');
              $('.studentCard').css('marginTop', '10px');
              $('.studentCardDiv').show(400);
              console.log(totalPoints);
              console.log(totalStudents);
          }
})
}

function clearArrays () {
  dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [];
}

function clearCards() {
  $('.classCard').remove('.classCard');
  $('.studentCard').remove('.studentCard');
  $('.addStudentBtn').remove('.addStudentBtn');
}

function getAllStudents () {

    clearArrays();
    clearCards();

    var classesRef = db.collection('teachers').doc(data.uid);
    var getDoc = classesRef.get()
        .then(doc => {
            if (!doc.exists) {
              showPopup(pText = 'Deze leraar heeft geen klassen neem contact op met uw adminstrator');
            } else {

                dbClass = doc.data().classes;


                //Dan door de leraars klassen loopen en alle studenten uit die klassen krijgen
                for (var i = 0; i < dbClass.length; i++) {

                  data.className = dbClass[i];
                  allStudents = true;
                  getStudents(allStudents);
                  console.log(data.className);
                }
            }
  })

}

function openEditStudent(id) {

  $('.headerText').html();
  $('#description').html('Bekijk hier de gegevens van <strong>'+dbFNames[id] + ' ' +dbLNames[id]+'</strong>');
  hideAllViewsWithoutClearingCache();

  var nameHTML = '<p class="cardText marginBottom"><strong>'+dbFNames[id] + ' ' +dbLNames[id]+'</strong></p>';
  var avatarHTML = '<img class="studentAvatarBig" src="'+dbAvatars[id]+'"/>';
  var singleStudentDivHTML = '<div class="singleStudentCard">'+nameHTML+avatarHTML+'</div>';
  $('.singleStudentDiv').append(singleStudentDivHTML);

  $('.singleStudentDiv').css('display', 'flex');
  $('.singleStudentDiv').show(400);
}

function openNewClass() {

  $('.headerText').html('Nieuwe klas');
  $('#description').text('Maak hier een nieuwe klas aan');

  $('.newClassDiv').css('display', 'flex');
  $('.newClassDiv').show(400);
}

function openNewStudent() {

  clearArrays();

    var classesRef = db.collection('teachers').doc(data.uid);
    var getDoc = classesRef.get()
        .then(doc => {
            if (!doc.exists) {
                showPopup(pText = 'Deze leraar heeft geen klassen neem contact op met uw adminstrator');
            } else {

                dbClass = doc.data().classes;


                //Dan door de leraars klassen loopen en alle studenten uit die klassen krijgen
                for (var i = 0; i < dbClass.length; i++) {
                  var classOption = '<option value="'+dbClass[i]+'">'+dbClass[i]+'</option>';

                  $('#classSelect').append(classOption);

                }
            }
  })

  hideAllViews();
  clearCards();
  $('.headerText').html('Nieuwe leerling');
  $('#description').text('Maak hier een nieuwe leerling aan');

  $('.newStudentDiv').css('display', 'flex');
  $('.newStudentDiv').show(400);
}

function openExtra() {
  $('.headerText').html('Extra');
  $('#description').text('Extra opties voor het beoordelings systeem');

  $('.extraCardDiv').css('display', 'flex');
  $('.extraCardDiv').show(400);
}


function createNewClass(className) {

  className = $('#classNameField').val();

  if (className == "" || className.lenght < 5) {
    alert("Vul een naam in die korter is dan 5 letters");


  } else {
    $('.loader').show(100);
    socketCreateNewClass(className);
  }
}

function createNewStudent(studentData) {

  studentData = {
    firstname: $('#firstNameField').val(),
    lastname: $('#lastNameField').val(),
    points: $('#pointsField').val(),
    avatar: $('#avatarSelect').val(),
    class: $('#classSelect').val()
  };

  console.log('ho');
  if (studentData.firstname == "" || studentData.lastname == "" || studentData.points == "" || studentData.points == NaN) {
    alert("Vul alle velden in");
  } else {
    $('.loader').show(100);
    socketCreateNewStudent(studentData);
  }
}
