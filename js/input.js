document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Button checks
// WASD, Q and E
var playerForward = false;
var playerBackward = false;
var playerLeft = false;
var playerRight = false;
var playerUp = false;
var playerDown = false;
// Numpad
var cameraForward = false;
var cameraBackward = false;
var cameraLeft = false;
var cameraRight = false;
// Page up and down
var cameraDown = false;
var cameraUp = false;

function keyDownHandler(event) {
	// WASD, Q and E
	if (event.keyCode == 87 || event.keyCode == 38) playerForward = true;			// "W" or "Up"
	else if (event.keyCode == 83 || event.keyCode == 40) playerBackward = true;		// "S" or "Down"
	else if (event.keyCode == 65 || event.keyCode == 37) playerLeft = true;			// "A" or "Left"
	else if (event.keyCode == 68 || event.keyCode == 39) playerRight = true;		// "D" or "Right"
	else if (event.keyCode == 81) playerDown = true;	// "Q"
	else if (event.keyCode == 69) playerUp = true;		// "E"
	// Numpad
	else if (event.keyCode == 104) cameraForward = true;	// "Numpad 8"
	else if (event.keyCode == 98) cameraBackward = true;	// "Numpad 2"
	else if (event.keyCode == 100) cameraLeft = true;		// "Numpad 4"
	else if (event.keyCode == 102) cameraRight = true;		// "Numpad 6"
	// Page up and down
	else if (event.keyCode == 103) cameraDown = true;	// "Page Down"
	else if (event.keyCode == 105) cameraUp = true;		// "Page Up"
}

function keyUpHandler(event) {
	// WASD, Q and E
	if (event.keyCode == 87 || event.keyCode == 38) playerForward = false;			// "W" or "Up"
	else if (event.keyCode == 83 || event.keyCode == 40) playerBackward = false;	// "S" or "Down"
	else if (event.keyCode == 65 || event.keyCode == 37) playerLeft = false;		// "A" or "Left"
	else if (event.keyCode == 68 || event.keyCode == 39) playerRight = false;		// "D" or "Right"
	else if (event.keyCode == 81) playerDown = false;	// "Q"
	else if (event.keyCode == 69) playerUp = false;		// "E"
	// Numpad
	else if (event.keyCode == 104) cameraForward = false;	// "Numpad 8"
	else if (event.keyCode == 98) cameraBackward = false;	// "Numpad 2"
	else if (event.keyCode == 100) cameraLeft = false;		// "Numpad 4"
	else if (event.keyCode == 102) cameraRight = false;		// "Numpad 6"
	// Page up and down
	else if (event.keyCode == 103) cameraDown = false;	// "Page Down"
	else if (event.keyCode == 105) cameraUp = false;	// "Page Up"
}
