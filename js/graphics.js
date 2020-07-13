
//
// Get rendering context to prepare for rendering
//
function getRenderingContext() {
	const canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	const gl = canvas.getContext("webgl");
	
	// Only continue if WebGL is available and working
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return null;
	}
	
	// Setup GL parameters
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
	
	// Setup game window size
	const WIDTH = 640;
	const HEIGHT = 480;
	const DPR = window.devicePixelRatio;
	canvas.width = WIDTH * DPR;
	canvas.height = HEIGHT * DPR;
	
	return gl;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	
	return shaderProgram;
}

//
// Creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	
	// Send the source to the shader object
	gl.shaderSource(shader, source)
	
	// Compile the shader program
	gl.compileShader(shader);
	
	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	
	return shader;
}

//
// Initialize buffers for shaders
//
function initBuffers(gl, mesh) {
	// Create and bind a buffer for the vertex positions
	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	// Get an array of vertex positions for the model and send it to GL
	const vertices = mesh.vertices;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	// Create and bind a buffer for the texture coordinates
	const texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	
	// Get an array of texture coordinates for the model and send it to GL
	const texCoords = mesh.texCoords;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	
	// Create and bind a buffer for the vertex normals
	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	
	// Get an array of positions for the model and send it to GL
	const normals = mesh.normals;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	
	// Create and bind a buffer for the indices
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	
	// Get an element array that defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's position
	// and send it to GL
	const indices = mesh.indices;
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	
	return {
		vertices: vertexBuffer,
		texCoords: texCoordBuffer,
		normals: normalBuffer,
		indices: indexBuffer
	};
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const lvl = 0;
	const format = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, lvl, format,
		width, height, border, srcFormat, srcType,
		pixel);
	
	const img = new Image();
	img.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, lvl, format,
			srcFormat, srcType, img);
		
		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// No, it's not a power of 2. Turn off mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};
	img.onerror = function() {console.log("Error: '" + url + "' was not loaded!")};
	img.src = url;
	
	return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function drawScene(gl, object, camera, programInfo, buffers, texture, vertexCount) {
	// Clear the canvas before we start drawing on it
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Compute model matrix for controlling the model
	const model = computeModelMatrix(object);
	
	// Compute view matrix for controlling the camera
	const view = computeViewMatrix(camera);
	
	// Compute perspective matrix to simulate the distortion of perspective in a camera
	const projection = computePerspectiveMatrix(gl);
	
	// Create a normal matrix for lighting
	const normal = glMatrix.mat4.create();
	glMatrix.mat4.invert(normal, model);
	glMatrix.mat4.transpose(normal, normal);
	
	// Tell WebGL how to pull out the vertices from
	// the vertexBuffer into the vertexPos attribute.
	{
		const numComponents = 3;  // pull out 3 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
								// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
		gl.vertexAttribPointer(programInfo.attribLocations.vertexPos,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPos);
	}
	
	// Tell WebGL how to pull out the texCoords from
	// the texCoordsBuffer into the texCoord attribute
	{
		const numComponents = 2; // every coordinate composed of 2 values
		const type = gl.FLOAT; // the data in the buffer is 32 bit float
		const normalize = false; // don't normalize
		const stride = 0; // how many bytes to get from one set to the next
		const offset = 0; // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoords);
		gl.vertexAttribPointer(programInfo.attribLocations.texCoord,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.texCoord);
	}
	
	// Tell WebGL how to pull out the normals from
	// the normalBuffer into the vertexNormal attribute.
	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexNormal,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
	}
	
	// Tell WebGL which indices to use to index the vertices
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
	// Tell WebGL to use our program when drawing
	gl.useProgram(programInfo.program);
	
	// Set the shader uniforms
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projection,
		false,
		projection);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.view,
		false,
		view);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.model,
		false,
		model);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.normal,
		false,
		normal);
	
	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	
	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
	
	// Draw using the cube's index buffer
	{
		//const vertexCount = 36;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}
}

function computeModelMatrix(object) {
	// Set the drawing position to the "identity" point, which is
	// the center of the scene.
	const model = glMatrix.mat4.create();
	
	// Now move the drawing position a bit to where we want to
	// start drawing the cube
	glMatrix.mat4.translate(model,     // destination matrix
		model,     // matrix to translate
		[object.position.x, object.position.y, object.position.z]);  // amount to translate
	
	// Apply rotation to the cube
	glMatrix.mat4.rotate(model,  // destination matrix
		model,  // matrix to rotate
		object.rotation,   // amount to rotate in radians
		[0, 0, 1]);       // axis to rotate around(Z)
	glMatrix.mat4.rotate(model,  // destination matrix
		model,  // matrix to rotate
		object.rotation * .7,   // amount to rotate in radians
		[1, 0, 0]);       // axis to rotate around(X)
	
	return model;
}

function computeViewMatrix(camera) {
	// Create a view matrix for controlling the camera
	const view = glMatrix.mat4.create();
	
	// Move the camera's position
	glMatrix.mat4.translate(view,	// destination matrix
		view,	// matrix to translate
		[-camera.position.x, -camera.position.y, -camera.position.z]);	// amount to translate
	
	// Apply rotation to the camera
	glMatrix.mat4.rotate(view,  // destination matrix
		view,  // matrix to rotate
		camera.rotation,   // amount to rotate in radians
		[0, 1, 0]);       // axis to rotate around(Z)
	
	return view;
}

function computePerspectiveMatrix(gl) {
	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 1 units
	// and 100 units away from the camera.
	const fieldOfView = 45 * Math.PI / 180;   // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 1.0;
	const zFar = 100.0;
	const projection = glMatrix.mat4.create();
	
	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	glMatrix.mat4.perspective(projection,
		fieldOfView,
		aspect,
		zNear,
		zFar);
	
	return projection;
}

function printDebugInfo(gl) {
	const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
	const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
	const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
	
	console.log("GPU Vendor: " + vendor);
	console.log("GPU Renderer: " + renderer);
}
