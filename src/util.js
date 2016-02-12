function fadeIn(callback) {
	$(R.overlay).fadeOut(R.fadeTime, R.easing, callback);
}

function fadeOut(callback) {
	$(R.overlay).fadeIn(R.fadeTime, R.easing, callback);
}