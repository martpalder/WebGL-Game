function Mesh() {
	this.vertices = new Array();
	this.texCoords = new Array();;
	this.normals = new Array();;
	this.indices = new Array();
}

function loadMesh(url) {
	// Read the file and split by lines
	const contents = readTextFile(url).split('\n');
	// Create a new mesh object
	var mesh = new Mesh();
	
	// For every line
	for (line = 0; line < contents.length; ++line) {
		// If it's a comment or an empty line: read next line
		if (contents[line][0] == '#' || contents[line][0] == ' ') continue;
		// If it's a vertex
		else if (contents[line][0] == 'v' && contents[line][1] == ' ') {
			// Save as a vertex array
			const vertexPos = contents[line].slice(2).split(' ');
			// Push to mesh.vertices array
			for (i = 0; i < vertexPos.length; ++i) {
				mesh.vertices.push(vertexPos[i]);
			}
		}
		// If it's a texture coordinate
		else if (contents[line][0] == 'v' && contents[line][1] == 't'){
			// Save as a texCoord array
			const texCoord = contents[line].slice(3).split(' ');
			// Push to mesh.texCoords array
			for (i = 0; i < texCoord.length; ++i) {
				mesh.texCoords.push(texCoord[i]);
			}
		}
		// If it's a vertex normal
		else if (contents[line][0] == 'v' && contents[line][1] == 'n') {
			// Save as a vertexNormal array
			const vertexNormal = contents[line].slice(3).split(' ');
			// Push to mesh.vertexNormals array
			for (i = 0; i < vertexNormal.length; ++i) {
				mesh.normals.push(vertexNormal[i]);
			}
		}
		// If it's an index
		else if (contents[line][0] == 'f') {
			// Save as an index array
			const index = contents[line].slice(2).split(' ');
			// Push to mesh.indices array
			for (i = 0; i < index.length; ++i) {
				mesh.indices.push(index[i]);
			}
		}
	}
	
	return mesh;
}
