/**
 * Keys.js is a library that tracks input devices.
 * 
 * Requires: jQuery
 */

// artinput namespace
var artinput = artinput || {};

/**
 * Aliases common non-character keys to their keycodes.
 */
artinput.ALIASES = {
	"BACKSPACE": 8,
	'TAB': 9,
	"ENTER": 13,
	"SHIFT": 16,
	"CTRL": 17,
	"ALT": 18,
	"PAUSE": 19,
	"CAPSLOCK": 20,
	"ESCAPE": 27,
	'SPACE': 32,
	'PAGEUP': 33,
	'PAGEDOWN': 34,
	'LEFT': 37,
	'UP': 38,
	'RIGHT': 39,
	'DOWN': 40,
	"PRINT": 44,
	"INSERT": 45,
	"DELETE": 46,
	// 48-90: ALPHANUMERIC
	"LWINDOWS": 91,
	"RWINDOWS": 92,
	"NUM0": 96,
	"NUM1": 97,
	"NUM2": 98,
	"NUM3": 99,
	"NUM4": 100,
	"NUM5": 101,
	"NUM6": 102,
	"NUM7": 103,
	"NUM8": 104,
	"NUM9": 105,
	"NUMTIMES": 106,
	"NUMPLUS": 107,
	"NUMMINUS": 109,
	"NUMDECIMAL": 110,
	"NUMDIVIDE": 111,
	"F1": 112,
	"F2": 113,
	"F3": 114,
	"F4": 115,
	"F5": 116,
	"F6": 117,
	"F7": 118,
	"F8": 119,
	"F9": 120,
	"F10": 121,
	"F11": 122,
	"F12": 123,
	"NUMLOCK": 144,
	"SCROLLLOCK": 145,
	"XFBACK": 166,
	"XFFORWARD": 167,
	"XFHOME": 172,
	"MEDIAMUTE": 173,
	"MEDIAVOLDOWN": 174,
	"MEDIAVOLUP": 175,
	"MEDIAPLAY": 179,
	"XFMAIL": 180,
	"SEMICOLON": 186,
	"EQUALS": 187,
	"COMMA": 188,
	"MINUS": 189,
	"PERIOD": 190,
	"SLASH": 191,
	"TILDE": 192,
	"LBRACKET": 219,
	"BACKSLASH": 220,
	"RBRACKET": 221,
	"APOSTROPHE": 222
};

/**
 * Stores the current state of the keyboard - any keys or modifiers pressed or released.
 */
artinput.Keyboard = function () {
	var me = this;
	this.state = {};
	this.oldState = {}; // Used for update
	
	/**
	 * Persists changes in key state.
	 * @param event Event object.
	 * @param pressedState True if down, false otherwise.
	 */
	this.keyChange = function (event, pressedState) {
		this.state[event.keyCode] = pressedState;
	};
	/**
	 * Callback function for the key down event.
	 * @param event Event object.
	 */
	this.keyDown = function (event) { me.keyChange(event, true); };
	
	/**
	 * Callback function for the key up event.
	 * @param event Event object.
	 */
	this.keyUp = function (event) { me.keyChange(event, false); };
	
	/**
	 * Returns the state for a particular key.
	 * 
	 * This function takes a string of keys to get separated by "+"s, which are ANDed together.
	 * This means that if any one is not pressed, the function will return false.
	 * Keys are given either by a case-insensitive representation ("a", "Z"), or a supported alias ("shift", "left").
	 * Examples: get("a+b+c"), get("ctrl+alt+x")
	 * 
	 * get() also takes a second argument, state, which determines the state object in which to look for key states.
	 * This is mostly used internally to compare between the last key states in the pressed() and released() functions.
	 * 
	 * @param keyString A list of keys to get separated by "+"s.
	 * 
	 * @param state State object containing key data to use.
	 * 
	 * @returns True if the key combination is pressed, false otherwise.
	 */
	this.get = function (keyString, state) {
		if (!state)
			state = this.state;
			
		var queriedKeys = keyString.split("+");
		var result = true;
		
		for (i in queriedKeys) {
			var key = queriedKeys[i].toUpperCase();
			
			if (Object.keys(artinput.ALIASES).indexOf(key) > -1)
				result = state[artinput.ALIASES[key]];
			else
				result = state[key.charCodeAt(0)];
			
			if (!result)
				return false;
		}
		return true;
	};
	
	/**
	 * Determines whether a key combination was just pressed (lasts for one frame).
	 * @param keyString Plus-separated list of keys to poll.
	 * @returns True if the key was pressed.
	 */
	this.pressed = function(keyString) {
		return this.get(keyString) && !this.get(keyString, this.oldState);
	};
	
	/**
	 * Determines whether a key combination was just released (lasts for one frame).
	 * @param keyString Plus-separated list of keys to poll.
	 * @returns True if the key was released.
	 */
	this.released = function(keyString) {
		return !this.get(keyString) && this.get(keyString, this.oldState);
	};
	
	/**
	 * Copies the current state to another object.
	 * This is necessary for the pressed() and released() functions to work.
	 * Call this in a WebGL loop AFTER you have handled input logic!
	 */
	this.copy = function() {
		this.oldState = jQuery.extend({}, this.state);
	};
	
	/**
	 * Unsubscribes from events and clears the keyboard state.
	 */
	this.destroy = function() {
		document.removeEventListener("keydown", this.keyDown, false);
		document.removeEventListener("keyup", this.keyUp, false);
		this.state = {};
		this.oldState = {};
	};
	
	document.addEventListener("keydown", this.keyDown, false);
	document.addEventListener("keyup", this.keyUp, false);
};

//TODO: Mouse
artinput.Mouse = function() {
	var me = this;

	this.position = { x: 0, y: 0 };
	this.oldPosition = me.position;
	this.offset = { x: 0, y: 0 };

	this.getCoordsDocument = function(event) {
		me.position.x = event.pageX;
		me.position.y = event.pageY;
	};
	
	this.x = function() { return me.position.x + me.offset.x; };
	this.y = function() { return me.position.y + me.offset.y; };
	this.dx = function() { return me.position.x - me.oldPosition.x; };
	this.dy = function() { return me.position.y - me.oldPosition.y; };
	
	document.addEventListener("mousemove", this.getCoordsDocument, false);
	
	this.copy = function() {
		me.oldPosition = jQuery.extend({}, me.position);
	};
	
	this.destroy = function() {
		document.removeEventListener("mousemove", me.getCoordsDocument, false);
		this.state = {};
		this.oldState = {};
	};
};
