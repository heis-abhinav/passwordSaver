const closeBtn = document.querySelector('#close-btn');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();


closeBtn.addEventListener('click', () =>{
	mainProcess.closeWindow(currentWindow);
})