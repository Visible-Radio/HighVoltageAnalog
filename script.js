//TODO
// handling for strings that are longer than the number of display modules

// challenges:
// never break a word across a page
// never start a page with a space
// never start a line with a space
// scale duration to size of display
// read from a file
// read from Spotify

//TODO
// Module OFF animation

//TODO
// scaleable modules rather than fixed pixel dimensions

const gridContainer = document.querySelector('.gridContainer');

function createDisplay(moduleCount) {

	for (let i = 0; i < moduleCount; i++) {
		//create the container
		let charContainer = document.createElement('div');
		gridContainer.appendChild(charContainer);
		charContainer.classList.add('charContainer');	
		//create the layers
		for (let i = 0; i < 4; i++) {
			let layer = document.createElement('div');
			charContainer.appendChild(layer);
			layer.classList.add(`layer`, `layer-${i}`);
			charContainer.appendChild(layer);
		}
	}	
	applyLEDBackground();
	return Array.from(gridContainer.children);
}

function applyLEDBackground() {
	LEDBackgrounds = Array.from(document.querySelectorAll('.layer-0'));
	LEDBackgrounds.forEach( background => background.textContent = '~');
}

function writeString(writeThis) {
	clearDisplay();
	let stringIndex = 0;

	if (writeThis.length > charContainers.length) {
		writeThis = "error";
	}

	const timerId = setInterval(writeNextChar, 50);
	function writeNextChar() {	
		layers = Array.from(charContainers[stringIndex].children);
		layers.shift();
		layers.forEach(layer => layer.textContent=writeThis[stringIndex]);
		layers[2].classList.add('on');		

		stringIndex++;	
		if (stringIndex === writeThis.length) {
			clearInterval(timerId);
		}
	}

}

function clearDisplay() {
	charContainers.forEach((container) => {
		layers = Array.from(container.children);
		layers.shift();
		layers.forEach(layer => layer.textContent='');
		layers[2].classList.remove('on');
	})
}

function writeLong(longString) {
	// pass in longer strings and display them in chunks according to the length of
	// charContainers, ie, how many modules there are
	if (longString.length < charContainers.length) {
		writeString(longString);
		return;
	} else {
		// pass in slices of longString until the entire thing has been displayed
		let sliceLength = charContainers.length;
		let startIndex = 0;
		let endIndex = sliceLength;
		writeNextSlice();
		const timerIdLongString = setInterval(writeNextSlice, 2250)
		function writeNextSlice() {
			if (startIndex >= longString.length) {
				clearInterval(timerIdLongString);				
				return;
			}
			writeString(longString.slice(startIndex,endIndex));
			startIndex += sliceLength;
			endIndex += sliceLength;
			
		}
		
	}
}
//================================DRIVER PROGRAM=====================================//
// create the desired number of 14 segment display modules
const charContainers = createDisplay(32);
writeLong("_ high voltage analog is better-");
//==============================END DRIVER PROGRAM===================================//








