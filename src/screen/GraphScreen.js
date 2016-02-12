function GraphScreen() {
	var container = null;
	var N_GRAPHS = 7;
	
	this.init = function() {
		// Create the container
		container = $("<div>")
			.css({
				"left": "50px",
				"position": "relative",
				"top": Display.height / 2 - 300 + "px"
			})
			.html("&nbsp;");
		
		for (var i = 1; i <= N_GRAPHS; i++) {
			window.temp["graph" + i] = $("<img>")
				.attr("src", "r/graphs/graph" + i + ".png")
				.css({
					"display": "none",
					"position": "absolute",
				})
				.appendTo(container);
			setTimeout("window.temp.graph" + i + ".fadeIn(" + R.fadeTime + ");", i * 1500);
		}
		
		var text = $("<div>")
			.html(S.graphText)
			.addClass("graphText")
			.appendTo(container);
		var text2 = $("<div>")
			.html(S.graphText2)
			.addClass("graphText")
			.appendTo(container);
		window.temp.gtxt = text;
		window.temp.gtxt2 = text2;
		
		setTimeout("window.temp.gtxt.fadeIn(" + R.fadeTime + ");", (N_GRAPHS + 2) * 1500);
		setTimeout("$(window.temp.graph1)" +
				".add(window.temp.graph2)" +
				".add(window.temp.graph4)" +
				".add(window.temp.graph5)" +
				".fadeOut(" + R.fadeTime + ");", (N_GRAPHS + 4) * 1500);
		
		setTimeout("window.temp.gtxt2.fadeIn(" + R.fadeTime + ");", (N_GRAPHS + 4) * 1500);
		
		setTimeout("currentScreen.fadeOut();", (N_GRAPHS + 7) * 1500);
		
		$(R.mk).append(container);
	};
	
	this.dispose = function() {
		window.temp = {};
		container.remove();
		container = null;
	};
	
	this.fadeOut = function() {
		container.fadeOut(R.fadeTime, function() {
			$(document).trigger('sceneChange', new ExploreTextScreen());
		});
	};
}
GraphScreen.prototype = new Screen();
