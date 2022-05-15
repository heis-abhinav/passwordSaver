const {ipcRenderer} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addToVault = document.querySelector('#add-to-vault');
const namee = document.querySelector('#name'); 
const username = document.querySelector('#username'); 
const password = document.querySelector('#password'); 
const closeNow = document.querySelector('#close-btn');

addToVault.addEventListener('click', (event) => {
	mainProcess.addCredentials(namee.value,username.value,password.value, currentWindow);
	namee.value = '';
	username.value = '';
	password.value = '';
	//console.log(namee.value)
	//mainProcess.closeWindow(currentWindow);
});

closeNow.addEventListener('click', (event) => {
	mainProcess.closeWindow(currentWindow);
})