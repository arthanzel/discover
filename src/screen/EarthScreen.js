function EarthScreen() {
	this.texture = R.earthScreenTexture;
	this.earth = {};
	this.light = {};
	var me = this;
	
	this.init = function() {
		// Hide the canvas to prepare for drawing
		$(R.gl).hide();
		
		// Initialize the 3D scene
		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera(45,
				Display.aspect,
				1,
				1000);
		this.camera.position.set(0, 150, 340);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera);
		
		// Textured sphere
		this.earth = new THREE.Mesh(
				new THREE.SphereGeometry(100, 35, 35),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture(me.texture),
					overdraw: true
				})
		);
		this.earth.rotation.y = 4.0; // Look at Eurasia - Africa
		this.scene.add(this.earth);
		
		// Cast to give the impression of sunlight
		this.light = new THREE.SpotLight();
		this.light.position.set(200, 110, 100);
		this.light.castShadow = true;
		this.scene.add(this.light);
		
		// Timeout to fade in
		setTimeout("$(R.gl).fadeIn(R.fadeTime); $('#audio')[0].play();", R.earthStartDelay);
		
		// Timeout to fade out
		setTimeout("currentScreen.fadeOut();", R.earthScreenDuration);
	};
	
	this.dispose = function() {
		this.scene = null;
		this.camera = null;
		this.light = null;
		this.earth = null;
	};
	
	this.update = function(elapsed, delta) {		
		// Slowly rotate the Earth
		this.earth.rotation.y += delta / R.earthRotationSpeed;
	};
	
	this.fadeOut = function() {
		$(R.gl).fadeOut(R.fadeTime, function() {
			$(document).trigger('sceneChange', new TeaserTextScreen());
		});
	};
}
EarthScreen.prototype = new Screen();
