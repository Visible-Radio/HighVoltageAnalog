//TODO
// scaleable modules rather than fixed pixel dimensions
// do it with css variables

//TODO
// don't write a space at the begining of a row

const gridContainer = document.querySelector('.gridContainer');
const backButton = document.querySelector('.backButton');
const fwdButton = document.querySelector('.fwdButton');

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
		}
	}	
	applyLEDBackground();
	return Array.from(gridContainer.children);
}

function applyLEDBackground() {
	const LEDBackgrounds = Array.from(document.querySelectorAll('.layer-0'));
	LEDBackgrounds.forEach( background => background.textContent = '~');
}

let pageDone = false; // need this global variable as feedback from setTimeout callbacks
let currentPage = 0;	// couldn't find a way to get this out of global scope either

function updateButtonStatus() {
	if (pageDone) {
		fwdButton.classList.add('ready');
		if (currentPage > 0) backButton.classList.add('ready');
	} else {
		fwdButton.classList.remove('ready');	
		backButton.classList.remove('ready');
	}
}

function handleText(inputFull) {	
	const pageLength = charContainers.length;
	const pagesArr = [];
	for (let i=0; i < inputFull.length; i+= charContainers.length) {
		pagesArr.push(inputFull.slice(i,charContainers.length+i));	
	}
	fwdButton.addEventListener('click', () => {
		if (pageDone) {
			pageDone = false;
			backButton.classList.add('ready');
			updateButtonStatus();					
			currentPage += (currentPage === pagesArr.length-1) ? -(pagesArr.length-1) : 1;
			writePage(pagesArr[currentPage]);
		}
	});
	backButton.addEventListener('click', () => {
		if (pageDone && currentPage > 0) {
			pageDone = false;			
			updateButtonStatus();
			currentPage += (currentPage === 0) ? 0 : -1;
			writePage(pagesArr[currentPage]);
		}
	});		
	writePage(pagesArr[currentPage]);	
}

function writePage(textPage) {
	clearDisplay();
	const ms = 100;
	setTimeout(() => {
			pageDone = true;
			updateButtonStatus();		
			console.log("done");
		}, ms * textPage.length);	
	if (textPage.length > charContainers.length) textPage = "Page Overflow";
	const textPageArr = Array.from(textPage);
	textPageArr.forEach((char, i) => {
		setTimeout(writeChar, ms*(i+1), char, i);			
	})	 
}

// write a single character at a specified position in the display
function writeChar(char, charModuleIndex) {
	const moduleLayers = Array.from(charContainers[charModuleIndex].children);
	moduleLayers.shift();
	moduleLayers.forEach(layer => {
	  layer.textContent = char;
		layer.classList.add('on');});
}

function clearDisplay() {
	charContainers.forEach((container) => {
		layers = Array.from(container.children);
		layers.shift();
		layers.forEach(layer => {
			layer.classList.remove('on');
			layer.textContent=''});
	})
}


//================================DRIVER PROGRAM=====================================//
// create the desired number of 14 segment display modules
const charContainers = createDisplay(80);
// writeLong("Mandrake, I suppose it never occured to you.");
handleText("Mandrake, I suppose it never occured to you that while we're chatting here so enjoyably, a decision is being made by the president and the joint chiefs in the war room at the pentagon when they realize there is no possibility of recalling the wing, there'll be only one course of action open. Total comittment. Mandrake, do you recall what clemenceau once said about war? He said war was too important to be left to the generals. When he said that, 50 years ago, he might have been right. But today, war is too important to be left to politicians. They have neither the time, the training, nor the inclination for strategic thought. I can no longer sit back and allow communist infiltration, communist indoctrination, communist subversion, and the international communist conspiracy to sap and impurify all of our precious bodily fluids.");

//==============================END DRIVER PROGRAM===================================//


// 

