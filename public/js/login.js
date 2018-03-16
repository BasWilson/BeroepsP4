$( document ).ready(function() {

  $(document).keypress(function(e) {
    if(e.which == 13) {
        login();
    }
});

  $('#loginBtn').click(function() {
    login();
  });
});
function login(user, pass) {
  user = $('#userField').val();
  pass = $('#passwordField').val();
  user = user + "@glr.nl";

  firebase.auth().signInWithEmailAndPassword(user, pass).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });
          window.location.href = "/dashboard";
}

        // [END authwithemail]
