var isOpen = false;
var width , height;

$(".menuButton").click(function(){

  toggleMenu();

});

$(".centerContainer").click(function(){

  if (isOpen == true) {
    toggleMenu();
  }

});
function toggleMenu() {
  var windowWidth = $( window ).width();
  var margin = 20;
  var mobileWidth = "15%";
  var mobileHeight = "50%";

  if (windowWidth < 600) {
    if (isOpen == false) {
      margin = "0px 0px 20% 0px";
    } else {
      margin = 0;
    }
    mobileWidth = "200px";
    mobileHeight = "78%";
  } else {
    margin = "20px 20px 20px 30px";
  }

  if (isOpen == true) {
    isOpen = !isOpen;

    $('.menuButton').fadeOut('fast', function () {
        $('.menuButton').attr('src', 'assets/menublack.png');
        $('.menuButton').fadeIn('fast');
        $('.navigationMenu').fadeOut('fast');

    });


    $(".navButton").animate({
        height: height,
        width: width,
        margin: margin
    }, (200));

    setTimeout(function () {
      $( ".navButton" ).addClass( "hover" );
      $( ".menuButton" ).removeClass( "hover" );

    }, 250)

  } else {
    isOpen = !isOpen;
    $( ".navButton" ).removeClass( "hover" );
    $( ".menuButton" ).addClass( "hover" );

    width = $( '.navButton' ).css( "width" );
    height = $( '.navButton' ).css( "height" );

    $('.menuButton').fadeOut('fast', function () {
        $('.menuButton').attr('src', 'assets/closeblack.png');
        $('.menuButton').fadeIn('fast');
        $('.navigationMenu').fadeIn('fast');
    });
    console.log(mobileHeight);
    console.log(mobileWidth);

    $(".navButton").animate({
        height: mobileHeight,
        width: mobileWidth,
        margin: margin
      }, (200));

  }
}
