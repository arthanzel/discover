var Display = {};
window.temp = {};

// Global scope to allow screens to access themselves through timeouts
var currentScreen = {};

function main() {
	console.log("discover");
	/*$("#audio")[0].addEventListener("onloadeddata", function() {
		console.log("audio ready");
	});*/
	start();
}

function start() {
	/**
	 * Provides timing values.
	 */
	var clock = initClock();
	
	Display = initDisplay();
	
	/**
	 * Provides tools for rendering graphics.
	 */
	var renderer = initRenderer();
	renderer.shadowMapEnabled = true;
	
	/**
	 * Current scene attached to the renderer
	 */
	currentScreen = new TestScreen();
	
	// Set IoC handler to change scenes on-the-go.
	$(document).bind("sceneChange", function(event, data) {
		currentScreen.dispose();
		currentScreen = data;
		currentScreen.init();
	});
	
	// Start discover.
	if (window.location.href.indexOf("#") > 0)
		$(document).trigger("sceneChange", new EarthZoomScreen());
	else
		$(document).trigger("sceneChange", new EarthScreen());
	
	animate(new Date().getTime());

	/**
	 * Performs update and animation logic not directly related to drawing.
	 * @param t Snapshot of timing values.
	 */
	function animate(t) {
		currentScreen.update(clock.getElapsedTime(), clock.getElapsedTime() - clock.lastTime);
		render();
		clock.lastTime = clock.getElapsedTime();
		window.requestAnimationFrame(animate);
	}
	
	/**
	 * Draws graphics to the renderer.
	 */
	function render() {
		renderer.clear();
		if (currentScreen.scene && currentScreen.camera)
			renderer.render(currentScreen.scene, currentScreen.camera);
	}
	
	/**
	 * Initializes display-related constants such as dimensions and aspect ratio.
	 * @return Object containing property fields.
	 */
	function initDisplay() {
		return {
			aspect: document.body.clientWidth / document.body.clientHeight,
			height: document.body.clientHeight,
			width: document.body.clientWidth
		};
	}
	
	/**
	 * Initializes a renderer object responsible for drawing to the screen.
	 * @returns Three.js renderer object
	 */
	function initRenderer() {
		var renderer = new THREE.WebGLRenderer({ antialias: true });

		//renderer.shadowCameraNear = .05;
		//renderer.shadowCameraFar = 10000;
		renderer.shadowMapEnabled = true;
		
		renderer.setSize(Display.width, Display.height);
		renderer.setClearColorHex(0x000000, 1.0);
		$(R.gl).append(renderer.domElement);
		
		return renderer;
	}
	
	/**
	 * Initializes a clock used for timing events.
	 * @returns Three.js clock object.
	 */
	function initClock() {
		var _clock = new THREE.Clock();
		_clock.lastTime = 0;
		return _clock;
	}
}
