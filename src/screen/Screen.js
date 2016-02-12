function Screen() {
	this.scene = null;
	this.camera = null;
	this.state = 0;
	
	/**
	 * Handles initialization logic.
	 */
	this.init = function() {};
	
	/**
	 * Handles dispose logic.
	 */
	this.dispose = function() {};
	
	/**
	 * Handles update logic.
	 * @param elapsed Elapsed time since the clock was created.
	 * @param delta Elapsed time since last frame.
	 */
	this.update = function(elapsed, delta) {};
}

function TestScreen() {
	this.init = function() {
		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera(45,
				metrics.aspect,
				1,
				1000);
		this.camera.position.set(200, 200, 200);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera);
		
		var cube = new THREE.Mesh(
				new THREE.CubeGeometry(50, 50, 50),
				new THREE.MeshBasicMaterial({ color: 0xff0000 })
		);
		this.scene.add(cube);
	};
}
TestScreen.prototype = new Screen();