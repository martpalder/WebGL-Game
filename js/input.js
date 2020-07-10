document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Horizontal checks
var forwardPressed = false;
var backwardPressed = false;
var leftPressed = false;
var rightPressed = false;
// Vertical checks
var upPressed = false;
var downPressed = false;

function keyDownHandler(event) {
	// Horizontal keys
	if (event.keyCode == 87 || event.keyCode == 38) forwardPressed = true;			// "W" or "Up" key
	else if (event.keyCode == 65 || event.keyCode == 37) leftPressed = true;		// "A" or "Left" key
	else if (event.keyCode == 83 || event.keyCode == 40) backwardPressed = true;	// "S" key or "Down" key
	else if (event.keyCode == 68 || event.keyCode == 39) rightPressed = true;		// "D" key or "Right" key
	// Vertical keys
	else if (event.keyCode == 81) downPressed = true;	// "Q" key
	else if (event.keyCode == 69) upPressed = true;		// "E" key
}

function keyUpHandler(event) {
	// Horizontal keys
	if (event.keyCode == 87 || event.keyCode == 38) forwardPressed = false;		// "W" or "Up" key
	else if (event.keyCode == 65 || event.keyCode == 37) leftPressed = false;		// "A" or "Left" key
	else if (event.keyCode == 83 || event.keyCode == 40) backwardPressed = false;	// "S" key or "Down" key
	else if (event.keyCode == 68 || event.keyCode == 39) rightPressed = false;		// "D" key or "Right" key
	// Vertical keys
	else if (event.keyCode == 81) downPressed = false;	// "Q" key
	else if (event.keyCode == 69) upPressed = false;	// "E" key
}
