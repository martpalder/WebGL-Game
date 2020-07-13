function readTextFile(url) {
	const request = new XMLHttpRequest();
	var contents
	
	// When the file is loaded
	request.onload = function() {
		// Get the file contents
		contents = request.response;
	};
	request.open("GET", url, false)
	request.overrideMimeType("text/plain");
	request.send();
	if (request.status != 200)
		console.log("Error " + request.status + ": '" + url + "' was not loaded!");
	
	return contents;
}
