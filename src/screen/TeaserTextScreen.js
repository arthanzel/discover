function TeaserTextScreen() {
	var top = Display.height * .60;
	var container = null;
	
	this.init = function() {
		// Create the text container
		container = $("<div>").addClass("teaser");
		
		// Populate the container with predefined strings
		for (i in S.teaserText) {
			var child = $("<div>").html(S.teaserText[i]).hide();
			container.append(child);
			
			// Set timeouts for fading in lines
			window.temp["teaser" + i] = child;
			setTimeout("window.temp.teaser" + i + ".fadeIn(R.fadeTime)",
					i * R.teaserTextDelay + R.teaserStartDelay);
		}

		setTimeout("currentScreen.fadeOut();", R.teaserScreenDuration);
		container.css("top", top);
		$(R.mk).append(container);
		
		$(R.overlay).hide();
	};
	
	this.dispose = function() {
		window.temp = {};
		container.remove();
		container = null;
	};
	
	this.update = function(elapsed, delta) {
		// Move the text lines up a bit
		top -= delta * 20;
		container.css("top", top);
	};
	
	this.fadeOut = function() {
		container.fadeOut(R.fadeTime, function() {
			$(document).trigger('sceneChange', new GraphScreen());
		});
	};
}
TeaserTextScreen.prototype = new Screen();
