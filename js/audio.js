function initAudio() {
	// Create Audio Context
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();
	
	// Get the audio element
	const audioElement = document.querySelector('audio');
	
	// Pass it into the audio context
	const track = audioContext.createMediaElementSource(audioElement);
	
	// Connect input node to Audio Context Destination
	track.connect(audioContext.destination);
	
	// Select our play button
	const playButton = document.querySelector('button');
	
	playButton.addEventListener('click', function() {
		// Check if context is in suspended state (autoplay policy)
		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}
		
		// Play or pause track depending on state
		if (this.dataset.playing === 'false') {
			audioElement.play();
			this.dataset.playing = 'true';
		} else if (this.dataset.playing === 'true') {
			audioElement.pause();
			this.dataset.playing = 'false';
		}
	
	}, false);
	
	audioElement.addEventListener('ended', () => {
		playButton.dataset.playing = 'false';
	}, false);
	
	return audioElement;
}

function setAudio(audioElement, url) {
	audioElement.src = url;
}
