$(function() {
	// on load
	initPostions();
	events();
	animate();
})

function initPostions() {
	var sideMenuWidth = $(".side-menu").width();
	var headerMenuHeight = $(".header-menu").height();
	$(".header-menu").css({
		marginLeft: sideMenuWidth,
	})
	$(".body-menu").css({
		marginLeft: sideMenuWidth,
		paddingTop: headerMenuHeight + 60 //including the header padding en 20px padding for the body,
	})
}

function events() {
	$(".bell").click(function() {
		$(".dropdown").toggle();
	});
	$(".bell .dropdown").click(function(e) {
		e.stopPropagation();
	});
}

function animate() {
	$("body").css({
		opacity: 1,
	})
}
