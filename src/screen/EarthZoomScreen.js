var earthFade = R.fadeTime;
var helpShown = false;

function EarthZoomScreen() {
	this.texture = R.earthScreenTexture;
	this.earth = {};
	this.light = {};
	this.markers = [];
	this.cp = {x: Display.width / 2, y: Display.height / 2};
	this.mx = {x: 0, y: 0};
	this.time = 0;
	var projector = {};
	var rotationInhibitor = 1;
	var tooltip = {};
	var tooltipShown = false;
	var click = false;
	var fadingOut = true;
	var me = this;
	
	this.init = function() {
		// Hide the canvas to prepare for drawing
		//$(R.gl).hide();
		$("body").css("cursor", "default");
		
		projector = new THREE.Projector();
		
		// Initialize the 3D scene
		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera(45,
				Display.aspect,
				1,
				1000);
		this.camera.position.set(0, 150, 340);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera);
		
		// Cast to give the impression of sunlight
		this.light = new THREE.SpotLight();
		this.light.position.set(100, 110, 100);
		this.light.castShadow = true;
		this.scene.add(this.light);
		
		// Textured sphere
		this.earth = new THREE.Mesh(
				new THREE.SphereGeometry(100, 35, 35),
				new THREE.MeshLambertMaterial({
					map: THREE.ImageUtils.loadTexture(me.texture),
					overdraw: true
				})
		);
		if (window.previousRotation)
			this.earth.rotation.y = 6.28-window.previousRotation+1.6; // The longitudes don't map exactly to rotation radians...
		else
			this.earth.rotation.y = 4.5;
		console.log("cp" + window.previousRotation + " " + this.earth.rotation.y);
		this.scene.add(this.earth);
		
		// Markers
		this.initMarkers();
		
		// Generate a tooltip element
		tooltip = $("<div>")
			.addClass("tooltip")
			.html("&nbsp;")
			.appendTo($(R.mk));
		$(R.mk).show();
		
		// Capture mouse events
		$(document).mousemove(function(event) {
			me.cp.x = event.pageX;
			me.cp.y = event.pageY;
			me.mx.x = ( event.clientX / Display.width ) * 2 - 1;
			me.mx.y = - ( event.clientY / Display.height ) * 2 + 1;
		});
		$(document).mousedown(function() { click = true; });
		$(document).mouseup(function() { click = false; });
		
		// Timeout to fade in
		$(R.gl).hide();
		setTimeout(function() {
				$(R.gl).fadeIn(earthFade, function() { fadingOut = false; });
				$('#audio-earth')[0].play();
			}, R.earthStartDelay);
		
		if (!helpShown) {
			helpShown = true;
			var helpDiv = $("<div>")
				.css ({
					position: "absolute",
					left: (Display.width / 2 - 60) + "px",
					bottom: "100px",
					display: "none",
					width: "100%",
					"text-align": "center"
				});
				
			helpElement = $("<img>")
				.attr("src", "r/mouse.png")	
				.css ({
					position: "absolute",
					left: (Display.width / 2 - 60) + "px",
					bottom: "50px",
					display: "none"
				})
				.appendTo($(R.mk));
			//helpDiv.appendTo($(R.mk));
				
			setTimeout(function() { helpElement.fadeIn(2500) }, 2500);
		}
	};
	
	this.initMarkers = function() {
		for (var i in R.markers) {
			var item = R.markers[i];
		
			this.markers[i] = new THREE.Mesh(
				new THREE.SphereGeometry(2, 25, 25),
				new THREE.MeshLambertMaterial({
					color: 0xff0000,
					overdraw: true
				})
			);
			this.markers[i].position.y = item.lat;
			this.markers[i] = $.extend(this.markers[i], item);
		}
		
		for (var i in this.markers) {
			this.markers[i].orbitRadius = Math.sqrt(1 - Math.pow(this.markers[i].position.y / 100, 2));
			this.scene.add(this.markers[i]);
		}
	}
	
	this.dispose = function() {
		this.scene = null;
		this.camera = null;
		this.light = null;
		this.earth = null;
		$(R.mk).empty();
	};
	
	this.update = function(elapsed, delta) {
		// Move the tooltip to the cursor
		tooltip.css({ left: this.cp.x + 5, top: this.cp.y - tooltip.outerHeight() - 5 });
	
		// Rotate the earth based on the mouse position
		var dRotation = Display.width / 2 - this.cp.x;
		this.earth.rotation.y += dRotation * (delta / 1000) * rotationInhibitor;
		
		// Update marker locations and simulate shadows
		for (var i in this.markers) {
			var marker = this.markers[i];
		
			// Update marker locations using some trig to make them orbit the earth.
			var radius = Math.sqrt(1 - Math.pow(this.markers[i].position.y / 100, 2));
			marker.position.x = -Math.cos(this.earth.rotation.y + this.markers[i].lng) * 107 *  marker.orbitRadius;
			marker.position.z = Math.sin(this.earth.rotation.y + this.markers[i].lng) * 107 *  marker.orbitRadius;
		
			// Simulate marker shadows by darkening it based on its Z position
			// The color will fluctuate over 0-1, so clamp it to those values
			var redValue = marker.position.z / (marker.orbitRadius * 75 + 6);
			if (redValue < 0) redValue = 0;
			else if (redValue > 1) redValue = 1;
			marker.material.color.setRGB(redValue, 0, 0);
			
			marker.scale.set(1, 1, 1);
		}
		
		// Ray logic
		var vector = new THREE.Vector3( this.mx.x, this.mx.y, 1 );
		vector = projector.unprojectVector( vector, this.camera );

		var ray = projector.pickingRay(new THREE.Vector3(me.mx.x, me.mx.y, 1), me.camera);
		var intersects = ray.intersectObjects(this.markers);
		if (intersects.length > 0) {
			// Switch to an info screen on click
			// Pass the rotation parameter here to return the the rotation
			// at the click (not at the end of fade out) and to avoid scope
			// and dispose issues.
			if (click && !fadingOut) {
				tooltip.fadeOut(300);
			
				fadingOut = true;
				window.previousRotation = intersects[0].object.lng;
				this.fadeOut(intersects[0].object.image, intersects[0].object.content);
			}
		
			// Highlight the intersected object
			intersects[0].object.scale.set(1.25, 1.25, 1.25);
			
			// Change the cursor to a hand, like a link
			$("body").css("cursor", "pointer");
			
			// Slow the Earth's rotation (this also controls the fridge)
			rotationInhibitor = 0.30;
			
			// Create and fade in the tooltip
			tooltip.html(intersects[0].object.description);
			if (!tooltipShown && !fadingOut) {
				tooltip.fadeIn(300, function() {
					tooltipShown = true;
				});
			}
		}
		else {
			// Reset the cursor to an arrow
			$("body").css("cursor", "default");
			
			// Resume the Earth's rotation to normal speed
			rotationInhibitor = 1;
			
			// Fade the tooltip
			if (tooltipShown) {
				tooltip.fadeOut(300, function() {
					tooltipShown = false;
				});
			}
		}
	};
	
	this.fadeOut = function(imageUrl, contentFile) {
		$(R.gl).add(R.mk).fadeOut(R.fadeTime, function() {
			$(document).trigger('sceneChange', new InfoScreen(imageUrl, contentFile));
		});
	};
	
	this.scale = function(x) {
		var scale = 0.1 * Math.pow(x, 3) + 1 ;
		this.earth.scale.x = scale;
		this.earth.scale.y = scale;
		this.earth.scale.z = scale;
	};
	
	this.showTip = function(tip) {
		
	}
}
EarthZoomScreen.prototype = new Screen();
