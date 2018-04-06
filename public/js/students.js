/*
* Globale variablen
*/
var currentView;
var data;
var user;
var allowed;
var dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [], dbNegativePoints = [];
var totalStudents, totalPoints;
var negativePointsChart, positivePointsChart;


$( document ).ready(function() {

  setTimeout(function() {
    user = firebase.auth().currentUser;
    checkIfSignedIn();
  },600)

  switchPage('dashboard');

  setTimeout(function() {
  if (user.uid == "uFabLVpyEHSCsiUHm9bPmEvHsKi2") {
      allowed = true;
    } else {
      allowed = false;
    }
  },600);
  setTimeout(function() {
  if (user == undefined) {
    window.location.reload();
  }
},1000);


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

    setTimeout(function () {
      $('.splashscreenDiv').fadeOut(200);
      $('.wrapper').fadeIn(800);
    },1000)


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
    student: 0,
    id: -1,
    addingPoints: false
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
  $('.summaryDiv').hide(200);
  $('.supportDiv').hide(200);
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
  switchPage('profile');

  $('.loader').hide(100);
  document.getElementById('teacherName').value = data.name;
  $('.headerText').text('Profiel');
  $('#description').text('Hier kunt u uw profiel bekijken en aanpassen');
  $('.profileCardDiv').css('display', 'flex');
  $('.profileCardDiv').show(400);

}

function showDashboard() {

  switchPage('dashboard');

  $('.headerText').text('Dashboard');
  $('#description').text('Wat wilt u doen?');
  $('.dashboardCardDiv').show(200);
  $('.dashboardCardDiv').css('display', 'flex');
}

function loadClasses() {

  switchPage('classes');

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

  switchPage('students');

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
              dbNegativePoints = doc.data().negativePoints;
              dbAvatars = doc.data().avatars;

              //Het overzicht schermpje instellen
              totalStudents = dbFNames.length;
              //De totale punten stellen we in de loop in
              totalPoints = 0;
              negativePointsChart = 0;
              positivePointsChart = 0;

              if (dbFNames == "" && allStudents == false) {
                showPopup(pText = 'Deze klas heeft geen leerlingen');
                $('.loader').hide(0);
              }

              for (var i = 0; i < dbFNames.length; i++) {

                totalPoints = totalPoints + dbPoints[i];
                negativePointsChart = negativePointsChart + dbNegativePoints[i];
                positivePointsChart = positivePointsChart + dbPoints[i];

                var firstNamesHTML = '<a class="studentName">'+dbFNames[i]+'</a>';
                var lastNamesHTML = '<a class="studentName">'+dbLNames[i].substring(0,1)+'.'+'</a>';
                var pointsHTML = '<a class="studentPoints">'+dbPoints[i]+'</a>';
                var avatarsHTML = '<img class="studentAvatar" src="'+dbAvatars[i]+'"/>';

                var leftSideHTML = '<div class="leftSide">'+avatarsHTML+'</div>';
                var rightSideHTML = '<div class="rightSide">'+firstNamesHTML+lastNamesHTML+'</div>';
                var studentCardHTML = '<div class="studentCard" onclick="openEditStudent(this.id)" id="'+i+'">'+leftSideHTML+rightSideHTML+pointsHTML+'</div>';

                $('#allStudents').append(studentCardHTML);

              }

              $('.loader').hide(0);
              $('.studentCardDiv').css('display', 'flex');
              $('.studentCard').css('margin', '10px');
              $('.studentCardDiv').show(400);
          }
})
}

function clearArrays () {
  dbFNames = [], dbLNames = [], dbPoints = [], dbAvatars = [], dbNegativePoints = [];
}

function clearCards() {
  $('.classCard').remove('.classCard');
  $('.studentCard').remove('.studentCard');
  $('.addStudentBtn').remove('.addStudentBtn');
  $('.negativePoint').remove('.negativePoint');
  $('.positivePoint').remove('.positivePoint');
}

function getAllStudents () {

    clearArrays();
    clearCards();
    switchPage('allStudents');

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
                }
            }
  })

}

function openEditStudent(id) {

  switchPage('editStudents');

  $('.headerText').html();
  $('#description').html('Bekijk hier de gegevens van <strong>'+dbFNames[id] + ' ' +dbLNames[id]+'</strong>');
  hideAllViewsWithoutClearingCache();

  var nameHTML = '<p class="cardText marginBottom textBig"><strong>'+dbFNames[id] + ' ' +dbLNames[id]+'</strong></p>';
  var pointsHTML = '<p class="cardText marginBottom textBig" id="points'+id+'">Positiviteit: <strong>'+dbPoints[id] +'</strong></p>';
  var negativePointsHTML = '<p class="cardText marginBottom textBig" id="negativePoints'+id+'">Negativiteit: <strong>'+dbNegativePoints[id] +'</strong></p>';
  var avatarHTML = '<img class="studentAvatarBig" src="'+dbAvatars[id]+'"/>';
  var plusBtnHTML = '<a class="navCard positivePoint" onclick="addPoint(this.id)" id="'+id+'">Geef positief punt</a>';
  var minusBtnHTML = '<a class="navCard negativePoint" onclick="negativePoint(this.id)" id="'+id+'">Geef negatief punt</a>';

  var singleStudentDivHTML = '<div class="singleStudentCard">'+nameHTML+avatarHTML+pointsHTML+negativePointsHTML+'</div>';
  $('#studentData').append(singleStudentDivHTML);
  $('.navigationBar').append(plusBtnHTML+minusBtnHTML);

  $('.positivePoint').show();
  $('.negativePoint').show();
  $('.singleStudentDiv').css('display', 'flex');
  $('.singleStudentDiv').show(400);
}

function openNewClass() {

  switchPage('newClass');

  $('.headerText').html('Nieuwe klas');
  $('#description').text('Maak hier een nieuwe klas aan');

  $('.newClassDiv').css('display', 'flex');
  $('.newClassDiv').show(400);
}

function showSummary() {


  switchPage('summary');

  $('#description').text('Bekijk hier een simpel overzicht van uw klas');
  $('.summaryDiv').css('display', 'flex');
  $('.summaryDiv').show(400);

  createChart();
}
function createChart () {
  var ctx = document.getElementById("myChart");
  var data = {
        labels: ["Positieve punten", "Negatieve punten"],
        datasets: [{
            label: '# of Votes',
            data: [positivePointsChart, negativePointsChart],
            backgroundColor: [
                'rgba(36, 232, 111, 0.5)',
                'rgba(255, 99, 132, 0.5)'
            ],
            borderColor: [
                'rgba(36, 232, 111, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 2
        }]
    };
  // For a pie chart
  var myPieChart = new Chart(ctx,{
      type: 'doughnut',
      data: data
  });
}

function addPoint(id) {

  data.id = id;
  data.addingPoints = true;
  socketEditPoint(data);
}

function negativePoint(id) {

  data.id = id;
  data.addingPoints = false;
  socketEditPoint(data);
}
function openNewStudent() {

  clearArrays();
  switchPage('newStudent');

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

  switchPage('extra');

  $('.headerText').html('Extra');
  $('#description').text('Extra opties voor het beoordelings systeem');

  $('.extraCardDiv').css('display', 'flex');
  $('.extraCardDiv').show(400);
}

function showSupport() {

  switchPage('support');

  $('.headerText').html('Ondersteuning');
  $('#description').text('Hier kunt u vragen stellen aan de techinische staff');

  $('.supportDiv').css('display', 'flex');
  $('.supportDiv').show(400);
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
    avatar: $('#avatarSelect').val(),
    class: $('#classSelect').val(),
    points: 0,
    negativePoints: 0
  };

  if (studentData.firstname == "" || studentData.lastname == "" ) {
    alert("Vul alle velden in");
  } else {
    $('.loader').show(100);
    socketCreateNewStudent(studentData);
  }
}


function createTicket(ticketData) {

  if (document.getElementById('ticketField').value == "") {
    alert('Vul eerst wat in');
  } else {
    ticketData = {
      id: user.uid,
      name: user.displayName,
      message: document.getElementById('ticketField').value
    };
    socketEmitTicket(ticketData);
  }
}

function saveName(name) {
  name = $('#teacherName').val();

    user.updateProfile({
    displayName: name
  }).then(function() {
    // Update successful.
    fadeColor('teacherName','backgroundColor', 'rgb(66, 244, 125)');
    checkIfSignedIn();
  }).catch(function(error) {
    // An error happened.
    fadeColor('teacherName','backgroundColor', 'red');
  });
}

function fadeColor(id, property, color) {
    var oProperty = $('#'+id+'').css(property);

    $('#'+id+'').css(property, color);
    setTimeout(function() {
      $('#'+id+'').css(property, oProperty);
    },1000);
}
