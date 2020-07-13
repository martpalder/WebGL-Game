function Object(x, y, z, speed) {
	this.position = glMatrix.vec3.create();
	this.position.x = x;
	this.position.y = y;
	this.position.z = z;
	this.rotation = 0.0;
	this.speed = speed;
}

main();

//
// Start here
//
function main() {
	// Game objects
	// Cube
	const cube = new Object(0.0, 0.0, -6.0, 4);
	
	// Camera
	const camera = new Object(0.0, 0.0, 0.0, 4);
	
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
	const cubeMesh = loadMesh('./meshes/Cube.obj');
	
	// Initialize the vertex buffers
	const buffers = initBuffers(gl, cubeMesh);
	
	// Load a texture
	const texture = loadTexture(gl, './textures/cubetexture.png');
	
	// Initialize music
	const music = initAudio('#music');
	
	// Set music file
	music.src = './audio/music/bensound-summer.mp3';
	
	// User Interface(UI)
	// Create text elements
	const fps = document.querySelector("#fps");
	const frameTime = document.querySelector("#frameTime");
	const meshPos = document.querySelector("#meshPos");
	const cameraPos = document.querySelector("#cameraPos");
	
	// Create text nodes to save some time for the browser
	const fpsText = document.createTextNode("");
	const frameTimeText = document.createTextNode("");
	const meshPosText = document.createTextNode("");
	const cameraPosText = document.createTextNode("");
	
	// Add those text nodes where they need to go
	fps.appendChild(fpsText);
	frameTime.appendChild(frameTimeText);
	meshPos.appendChild(meshPosText);
	cameraPos.appendChild(cameraPosText);
	
	var then = 0;
	var secondCount = 0.0;
	
	// Draw the scene repeatedly
	function render(now) {
		now *= 0.001;	// Convert to seconds
		const deltaTime = now - then;
		then = now;
		
		// Move the cube with WASD, Q and E
		if (playerForward) cube.position.z -= cube.speed * deltaTime;	// Forward
		if (playerBackward) cube.position.z += cube.speed * deltaTime;	// Backward
		if (playerLeft) cube.position.x -= cube.speed * deltaTime;		// Left
		if (playerRight) cube.position.x += cube.speed * deltaTime;		// Right
		if (playerDown) cube.position.y -= cube.speed * deltaTime;		// Down
		if (playerUp) cube.position.y += cube.speed * deltaTime;		// Up
		// Move the camera with numpad
		if (cameraForward) camera.position.z -= camera.speed * deltaTime;	// Forward
		if (cameraBackward) camera.position.z += camera.speed * deltaTime;	// Backward
		if (cameraLeft) camera.position.x -= camera.speed * deltaTime;		// Left
		if (cameraRight) camera.position.x += camera.speed * deltaTime;		// Right
		if (cameraDown) camera.position.y -= camera.speed * deltaTime;		// Page Down
		if (cameraUp) camera.position.y += camera.speed * deltaTime;		// Page Up
		
		// Draw the scene
		drawScene(gl, cube, camera, programInfo, buffers, texture, cubeMesh.vertexCount);
		requestAnimationFrame(render);
		
		// Update the rotation for the next draw
		cube.rotation += deltaTime;
		
		// DEBUGGING: print stats every 1/5th of a second
		secondCount += deltaTime;
		if (secondCount > 0.2) {
			fpsText.nodeValue = (1 / deltaTime).toFixed(1);					// Print FPS
			frameTimeText.nodeValue = (deltaTime * 1000).toFixed(1) + "ms";	// Print Frame Time
			meshPosText.nodeValue = "X: " + cube.position.x.toFixed(1) + " Y: "+ cube.position.y.toFixed(1) + " Z: "+ cube.position.z.toFixed(1);	// Print cube position
			cameraPosText.nodeValue = "X: " + camera.position.x.toFixed(1) + " Y: "+ camera.position.y.toFixed(1) + " Z: "+ camera.position.z.toFixed(1);	// Print camera position
			secondCount = 0;	// Reset second count
		}
	}
	requestAnimationFrame(render);
}
