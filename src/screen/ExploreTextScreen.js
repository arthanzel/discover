function ExploreTextScreen() {
	var top = Display.height * .4;
	var container = null;
	
	this.init = function() {
		$(R.mk).hide();
		
		// Create the text container
		container = $("<div>").addClass("teaser");
		
		// Populate the container with predefined strings
		container.append($("<div>").html(S.exploreText));

		setTimeout("currentScreen.fadeOut();", R.exploreTextScreenDuration);
		container.css("top", top);
		$(R.mk).append(container);
		
		$(R.mk).fadeIn(R.fadeTime);
	};
	
	this.dispose = function() {
		window.temp = {};
		container.remove();
		container = null;
	};
	
	this.update = function(elapsed, delta) {
		
	};
	
	this.fadeOut = function() {
		container.fadeOut(R.fadeTime, function() {
			$(document).trigger('sceneChange', new EarthZoomScreen());
		});
	};
}
ExploreTextScreen.prototype = new Screen();
