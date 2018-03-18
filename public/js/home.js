var welcomeMessage;
var d = new Date();
var n = d.getHours();
console.log(n);

$( document ).ready(function() {
  welkomsBericht();
  $('.wrapper').fadeIn(500);

});

function welkomsBericht() {
  var src;
  if (n >= 0 && n <= 5) {
    welcomeMessage = "Goede <b>nacht</b>, welkom bij het beoordelings systeem.";
  }
  if (n >= 7 && n <= 12) {
    welcomeMessage = "Goede <b>morgen</b>, welkom bij het beoordelings systeem.";
  }
  if (n >= 13 && n <= 18) {
    welcomeMessage = "Goede <b>middag</b>, welkom bij het beoordelings systeem.";
  }
  if (n >= 19 && n <= 23) {
    welcomeMessage = "Goede <b>avond</b>, welkom bij het beoordelings systeem.";
  }
  document.getElementById('welcomeMessage').innerHTML = welcomeMessage;
}

function showPopup(pText) {
  $('.loader').hide(0);
  $('#popupText').html(pText);
  $('.popupDiv').css('display', 'flex');
  $('.popupDiv').show(200);
}

function closePopup(pText) {
  $('.popupDiv').hide(200);
  showDashboard();
}
$('#closePopupBtn').click(function () {
  closePopup();
});

$('.backBtn').click(function () {
  hideAllViews();
  $('.dashboardCardDiv').show(200);
});
$('#profileBtn').click(function () {
  hideAllViews();
  showProfile();
});

$('#classesBtn').click(function () {
  hideAllViews();
  clearArrays();
  clearCards();
  loadClasses();
});

$('#studentsBtn').click(function () {
  hideAllViews();
  getAllStudents();
});

$('#logoutBtn').click(function () {
  logout();
});

$('#extraBtn').click(function () {
  hideAllViews();
  openExtra();
});
$('#newClassBtn').click(function () {
  hideAllViews();
  openNewClass();
});
$('#createNewClassBtn').click(function () {
  hideAllViews();
  createNewClass();
});

$('#addStudentBtn').click(function () {
  hideAllViews();
  openNewStudent();
});

$('#createNewStudentBtn').click(function () {
  hideAllViews();
  createNewStudent();
});
