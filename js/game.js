main();

//
// Start here
//
function main() {
	// Game variables
	// Cube speed
	const cubeSpeed = 4;
	
	// Cube position
	var cubePos = glMatrix.vec3.create();
	cubePos.x = 0.0
	cubePos.y = 0.0
	cubePos.z = -6.0
	
	// Cube rotation
	var cubeRotation = 0.0;
	
	// Get rendering context
	const gl = getRenderingContext();
	
	// Print debug info
	printDebugInfo(gl);
	
	// Read shader files using XMLHttpRequest
	const vsSrc = readTextFile('./shaders/shader.vs');
	const fsSrc = readTextFile('./shaders/shader.fs');
	
	// Initialize a shader program
	const shaderProgram = initShaderProgram(gl, vsSrc, fsSrc);
	
	// Look up locations
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPos: gl.getAttribLocation(shaderProgram, 'aVertexPos'),
			texCoord: gl.getAttribLocation(shaderProgram, 'aTexCoord'),
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
		},
		uniformLocations: {
			projection: gl.getUniformLocation(shaderProgram, 'uProjection'),
			view: gl.getUniformLocation(shaderProgram, 'uView'),
			model: gl.getUniformLocation(shaderProgram, 'uModel'),
			normal: gl.getUniformLocation(shaderProgram, 'uNormal'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		},
	};
	
	// Load an OBJ mesh file
	mesh = loadMesh('./meshes/Cube.obj');
	
	// Initialize the vertex buffers
	const buffers = initBuffers(gl, mesh);
	
	// Load a texture
	const texture = loadTexture(gl, './textures/cubetexture.png');
	
	// Initialize audio
	const audioElement = initAudio();
	
	// Set audio file
	setAudio(audioElement, './audio/music/A-team_Theme.ogg');
	
	// User Interface(UI)
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
		if (forwardPressed) cubePos.z -= cubeSpeed * deltaTime;		// Forward
		if (backwardPressed) cubePos.z += cubeSpeed * deltaTime;	// Backward
		if (leftPressed) cubePos.x -= cubeSpeed * deltaTime;		// Left
		if (rightPressed) cubePos.x += cubeSpeed * deltaTime;		// Right
		if (downPressed) cubePos.y -= cubeSpeed * deltaTime;		// Down
		if (upPressed) cubePos.y += cubeSpeed * deltaTime;			// Up
		
		// Draw the scene
		drawScene(gl, cubePos, cubeRotation, programInfo, buffers, texture);
		requestAnimationFrame(render);
		
		// Update the rotation for the next draw
		cubeRotation += deltaTime;
		
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
