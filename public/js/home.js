var welcomeMessage;
var d = new Date();
var n = d.getHours();
console.log(n);

$( document ).ready(function() {
  welkomsBericht();
  $('.wrapper').fadeIn(500);
});


$(".studentCard").on('hover', function() {
        var $txt = $("#txt");
        var caretPos = $txt[0].selectionStart;
        var textAreaTxt = $txt.val();
        var txtToAdd = "Edit";
        $txt.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
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
