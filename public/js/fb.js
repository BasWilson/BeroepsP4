
firebase.initializeApp({
  apiKey: 'AIzaSyBTrKr00o2PjpV2ZcCAzaCuxWiab72QGGc',
  authDomain: 'beoordelings-systeem.firebaseapp.com',
  projectId: 'beoordelings-systeem'
});

var db = firebase.firestore();

$( document ).ready(function() {

  $(document).keypress(function(e) {

    if(e.which == 13) {
      if (window.location.href == "/login") {
        login();
      } 
    }


});

  $('#loginBtn').click(function() {
    login();
  });
});
function login(user, pass) {
  $('.wrapper').fadeOut(300);

  user = $('#userField').val();
  pass = $('#passwordField').val();
  user = user + "@glr.nl";

  firebase.auth().signInWithEmailAndPassword(user, pass).then(function(user) {
     // user signed in
     window.location.href = "/dashboard";
  }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      $('.wrapper').fadeIn(300);
      if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
      } else {
          alert(errorMessage);
      }
      console.log(error);
  });
}


function logout() {
  firebase.auth().signOut();
}
