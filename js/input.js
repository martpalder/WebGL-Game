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
	if (event.keyCode == 87) forwardPressed = true;			// "W" key
	else if (event.keyCode == 65) leftPressed = true;		// "A" key
	else if (event.keyCode == 83) backwardPressed = true;	// "S" key
	else if (event.keyCode == 68) rightPressed = true;		// "D" key
	// Vertical keys
	else if (event.keyCode == 81) downPressed = true;	// "Q" key
	else if (event.keyCode == 69) upPressed = true;		// "E" key
}

function keyUpHandler(event) {
	// Horizontal keys
	if (event.keyCode == 87) forwardPressed = false;		// "W" key
	else if (event.keyCode == 65) leftPressed = false;		// "A" key
	else if (event.keyCode == 83) backwardPressed = false;	// "S" key
	else if (event.keyCode == 68) rightPressed = false;		// "D" key
	// Vertical keys
	else if (event.keyCode == 81) downPressed = false;	// "Q" key
	else if (event.keyCode == 69) upPressed = false;	// "E" key
}
=======
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
	if (event.keyCode == 87) forwardPressed = true;			// "W" key
	else if (event.keyCode == 65) leftPressed = true;		// "A" key
	else if (event.keyCode == 83) backwardPressed = true;	// "S" key
	else if (event.keyCode == 68) rightPressed = true;		// "D" key
	// Vertical keys
	else if (event.keyCode == 81) downPressed = true;	// "Q" key
	else if (event.keyCode == 69) upPressed = true;		// "E" key
}

function keyUpHandler(event) {
	// Horizontal keys
	if (event.keyCode == 87) forwardPressed = false;		// "W" key
	else if (event.keyCode == 65) leftPressed = false;		// "A" key
	else if (event.keyCode == 83) backwardPressed = false;	// "S" key
	else if (event.keyCode == 68) rightPressed = false;		// "D" key
	// Vertical keys
	else if (event.keyCode == 81) downPressed = false;	// "Q" key
	else if (event.keyCode == 69) upPressed = false;	// "E" key
}
