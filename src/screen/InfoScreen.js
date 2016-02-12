/**
 * Shows information about a topic using a fullscreen background image and a sidebar.
 */
function InfoScreen(imageUrl, contentFile) {
	var image = {};
	var container = {};
	var me = this;

	/**
	 * Handles initialization logic.
	 */
	this.init = function() {
		$(R.gl).hide();
		$(R.mk).hide();
		
		image = $("<img>")
			.attr("src", "r/tex/" + imageUrl)
			.addClass("infoImage")
			.appendTo($(R.mk));
		
		container = $("<div>")
			.appendTo($(R.mk));
		container.load("r/content/" + contentFile + ".html", function() { me.start() });		
	};
	
	this.start = function() {
		$(R.mk).fadeIn(R.fadeTime);
		setTimeout(function() { container.children(".sidebar").fadeIn(R.fadeTime); }, R.fadeTime / 2);
		
		container.find(".link").click(function() {
			$(R.mk).fadeOut(R.fadeTime, function() {
				earthFade = 500;
				$(document).trigger('sceneChange', new EarthZoomScreen);
			});
		});
	};
	
	/**
	 * Handles dispose logic.
	 */
	this.dispose = function() {
		image.remove(); image = null;
		container.remove(); container = null;
		$(R.mk).empty();
	};
	
	/**
	 * Handles update logic.
	 * @param elapsed Elapsed time since the clock was created.
	 * @param delta Elapsed time since last frame.
	 */
	this.update = function(elapsed, delta) {};
}
InfoScreen.prototype = new Screen();