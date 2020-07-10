main();

//
// Start here
//
function main() {
	// Get rendering context
	const gl = getRenderingContext();
	
	// Open shader sources
	const vsSrc = document.querySelector("#vertex-shader").textContent;		// Vertex shader program
	const fsSrc = document.querySelector("#fragment-shader").textContent;	// Fragment shader program
	
	// Initialize a shader program
	const shaderProgram = initShaderProgram(gl, vsSrc, fsSrc);
	
	// Look up locations
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		},
	};
	
	// Initialize the vertex buffers
	const buffers = initBuffers(gl);
	
	// Load texture
	const texture = loadTexture(gl, './textures/cubetexture.png');
	
	// Initialize audio
	initAudio('./audio/music/A-Team_Theme.ogg');
	
	// Look up div elements
	const fpsDiv = document.querySelector("#fps")
	const frameDiv = document.querySelector("#frameTime")
	
	// Create text nodes to save some time for the browser
	const fpsText = document.createTextNode("");
	const frameText = document.createTextNode("");
	
	// Add those text nodes where they need to go
	fpsDiv.appendChild(fpsText);
	frameDiv.appendChild(frameText);
	
	var then = 0;
	var secondCount = 0;
	
	// Draw the scene repeatedly
	function render(now) {
		now *= 0.001;	// Convert to seconds
		const deltaTime = now - then;
		then = now;
		
		// Move the cube with keyboard controls
		if (forwardPressed) cubeZ -= cubeSpeed * deltaTime;		// Forward
		if (backwardPressed) cubeZ += cubeSpeed * deltaTime;	// Backward
		if (leftPressed) cubeX -= cubeSpeed * deltaTime;		// Left
		if (rightPressed) cubeX += cubeSpeed * deltaTime;		// Right
		if (downPressed) cubeY -= cubeSpeed * deltaTime;		// Down
		if (upPressed) cubeY += cubeSpeed * deltaTime;			// Up
		
		// Draw the scene
		drawScene(gl, programInfo, buffers, texture, deltaTime);
		requestAnimationFrame(render);
		
		// DEBUGGING: print stats every 2 seconds
		secondCount += deltaTime;
		if (secondCount > 2) {
			secondCount = 0;	// Reset seconds
			fpsText.nodeValue = (1 / deltaTime).toFixed(1);				// Print FPS
			frameText.nodeValue = (deltaTime * 1000).toFixed(1) + "ms";	// Print Frame Time
		}
	}
	requestAnimationFrame(render);
}

function readTextFile(url) {
	const request = new XMLHttpRequest();
	
	request.onload = function(e) {
		var contents = request.response;	// not responseText
		console.log(contents);
	}
	request.open("GET", url)
	request.overrideMimeType("text/plain");
	request.send();
}
