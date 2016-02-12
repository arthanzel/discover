var R = {
		cursorTexture: "r/tex/cursor.png",
		earthRotationSpeed: 15, // Lower is faster
		earthStartDelay: 1000,
		earthScreenDuration: 13000,
		earthScreenTexture: "r/tex/earth.jpg",
		earthStartDelay: 1000,
		earthZoomDelay: 2500,
		earthZoomEnd: 4500,
		easing: "linear",
		exploreTextScreenDuration: 6000,
		fadeTime: 2000,
		gl: "#gl-container",
		mk: "#mk-container",
		overlay: "#overlay",
		teaserScreenDuration: 14500,
		teaserStartDelay: 500,
		teaserStartLocation: .7,
		teaserTextDelay: 2000,
		
		markers: [
			{
				content: "waste",
				description: "Energy from Waste",
				image: "waste1.jpg",
				lat: 70,
				lng: 1.73,
				name: "Ottawa"
			},
			{
				content: "solar",
				description: "Here Comes the Sun",
				image: "solar1.jpg",
				lat: 65,
				lng: 3.05,
				name: "Spain"
			},
			{
				content: "wind",
				description: "Adjusting Your Sails",
				image: "windfarm1.jpg",
				lat: 76,
				lng: 3.45,
				name: "Austria"
			},
			{
				content: "africa",
				description: "On Pennies a Day",
				image: "africa2.jpg",
				lat: 30,
				lng: 3.63,
				name: "Africa"
			},
			{
				content: "oil",
				description: "Breaking Tradition",
				image: "oil3.jpg",
				lat: 50,
				lng: 1.35,
				name: "Russia"
			},
			{
				content: "geo",
				description: "Depths of the Earth",
				image: "geo2.jpg",
				lat: 85,
				lng: 2.8,
				name: "Iceland"
			},
			{
				content: "hydro",
				description: "What the Water Gave",
				image: "hydro2.jpg",
				lat: 75,
				lng: 1.7,
				name: "Quebec"
			}
		]
};