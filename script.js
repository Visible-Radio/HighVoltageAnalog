//TODO
// disable valueButtons if !pageDone

// string handling for chars that don't work in the font

const gridContainer = document.querySelector('.gridContainer');
const backButton = document.querySelector('.backButton');
const fwdButton = document.querySelector('.fwdButton');
const moduleCountSlider = document.querySelector("#moduleCount");
const progressIndicator = document.querySelector('.progress');
const appendButton = document.querySelector('.appendButton');
const removeButton = document.querySelector('.removeButton');
const valueButtons = document.querySelectorAll('.valueButton');
let appendRemoveValue =1;


// moduleCountSlider.addEventListener('change', handleModuleChange);

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
		appendButton.classList.add('on');
		removeButton.classList.add('on');
		fwdButton.classList.add('ready');
		if (currentPage > 0) backButton.classList.add('ready');
	} else {
		fwdButton.classList.remove('ready');	
		backButton.classList.remove('ready');
		appendButton.classList.remove('on');
		removeButton.classList.remove('on');
	}
}

function createPages(inputFull) {
	// cuts the input up into chunks corresponding to the number of charContainers	
	const pageLength = charContainers.length;
	const pagesArr = [];
	for (let i=0; i < inputFull.length; i+= charContainers.length) {
		pagesArr.push(inputFull.slice(i,charContainers.length+i));	
	}
	return pagesArr;
}

function handleText() {	
	updateButtonStatus();
	fwdButton.addEventListener('click', () => {
		// const pagesArr = createPages(inputFull); // might be worth putting pagesArr in global scope
		if (pageDone) {
			pageDone = false;			
			backButton.classList.add('ready');			
			updateButtonStatus();					
			currentPage += (currentPage === pagesArr.length-1) ? -(pagesArr.length-1) : 1;
			writePage(pagesArr[currentPage]);
		}
	});
	backButton.addEventListener('click', () => {
		// const pagesArr = createPages(inputFull); // might be worth putting pagesArr in global scope
		if (pageDone && currentPage > 0) {
			pageDone = false;			
			updateButtonStatus();
			currentPage += (currentPage === 0) ? 0 : -1;
			writePage(pagesArr[currentPage]); 
		}
	});
	// const pagesArr = createPages(inputFull);		
	writePage(pagesArr[currentPage]);	
}

function writePage(textPage) {
	clearDisplay();
	const ms = 100;
	setTimeout(() => {
			pageDone = true;
			updateButtonStatus();					
		}, ms * textPage.length);	
	if (textPage.length > charContainers.length) textPage = "Page Overflow";
	const textPageArr = Array.from(textPage);
	textPageArr.forEach((char, i) => {
		setTimeout(writeChar, ms*(i+1), char, i);			
	})	 
}

// write a single character at a specified position in the display
function writeChar(char, charModuleIndex) {
	illuminateProgress(charModuleIndex);
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

function appendModule(num = 1) {		
	if (gridContainer.childElementCount + num > 90) {
		alert("14 segment displays are expensive you know!\n If you want more than 90 you'll have to shell\n out for the premium version!")
		return true;
	}

	for (let i = 0; i <= num; i++) {
		let charContainer = document.createElement('div');
		gridContainer.appendChild(charContainer);
		charContainer.classList.add('charContainer');
		for (let i = 0; i < 4; i++) {
			let layer = document.createElement('div');
			charContainer.appendChild(layer);
			layer.classList.add(`layer`, `layer-${i}`);
		}
		charContainers.push(charContainer);
	}
	applyLEDBackground();
	pagesArr = createPages(inputText);				
	handleText();
	return false;
}

function removeModule(num = 1) {
	if (gridContainer.childElementCount - num < 1) {
		alert("It'd be silly not to have ANY 14 segment displays!");
		return true;
	}

	for (let i = 0; i < num; i++) {
		gridContainer.lastChild.remove();
		charContainers.pop();
	}							
		pagesArr = createPages(inputText);				
		handleText();
		return false;		
}

function destroyDisplay() {
	charContainers.forEach(container => container.remove());
}

function createProgressIndicator() {
	for (let i = 0; i < 10; i ++) {
		let dot = document.createElement('div');
		progressIndicator.appendChild(dot);
		dot.classList.add('progressDot');		
	}
	return Array.from(document.querySelectorAll('.progressDot'));	
}

// the whole progress bar thing seems needlesly complicated
function illuminateProgress(charModuleIndex) {
	const step = parseInt(inputText.length / 10);
	const currentProgress = (currentPage * charContainers.length) + charModuleIndex +1;	
	const currentIndex = () =>{
		num = parseInt(currentProgress / step);
		return num >= 0 ? num : 0;
	} 			
	progressDots.forEach(dot => dot.classList.remove('dotOn'));
	for (let i = 0; i < currentIndex(); i++) {		
		progressDots[i].classList.add('dotOn');		
	}	
}

function getBtnValue(e) {
	if (!pageDone) return;
	valueButtons.forEach(btn => btn.classList.remove('ready'));
	e.srcElement.classList.toggle('ready');	
	appendRemoveValue = parseInt(e.srcElement.textContent);
}

//================================DRIVER PROGRAM=====================================//
// create the desired number of 14 segment display modules
let inputText = "Mandrake, I suppose it never occured to you that while we're chatting here so enjoyably, a decision is being made by the president and the joint chiefs in the war room at the pentagon when they realize there is no possibility of recalling the wing, there'll be only one course of action open. Total comittment. Mandrake, do you recall what clemenceau once said about war? He said war was too important to be left to the generals. When he said that, 50 years ago, he might have been right. But today, war is too important to be left to politicians. They have neither the time, the training, nor the inclination for strategic thought. I can no longer sit back and allow communist infiltration, communist indoctrination, communist subversion, and the international communist conspiracy to sap and impurify all of our precious bodily fluids."
let charContainers = createDisplay(49);
let pagesArr = createPages(inputText);
handleText();
progressDots = createProgressIndicator();
valueButtons.forEach(btn => btn.addEventListener('click', getBtnValue));

removeButton.addEventListener('click', () => {
	if (pageDone)		
		pageDone = removeModule(appendRemoveValue);				
		updateButtonStatus();
})

appendButton.addEventListener('click', () => {
	if (pageDone)	{
		pageDone = appendModule(appendRemoveValue);		
		updateButtonStatus();
	}
});



//==============================END DRIVER PROGRAM===================================//





