const {ipcRenderer} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const registerButton = document.querySelector('#register-password');
const password = document.querySelector('#password');
const form = document.querySelector('#form');
const verifyPassword = document.querySelector('#password-verify');

const closeNow = document.querySelector('#close-btn');

form.addEventListener('submit', (e) => e.preventDefault());
registerButton.addEventListener('click', (event) => {
	if(validatePasswords()){
		mainProcess.registerMaster(password.value, currentWindow);
	}
});

const validatePasswords = () => {
	let returnto = true;
	if(verifyPassword.value != password.value){
		console.log('mismatch')
		return false;
	}
	if(isNaN((password.value))){
		console.log('nan')
		return false;
	}
	if(password.value.length != 5){
		console.log('yeh')
		return false;
	}
	return returnto

}

closeNow.addEventListener('click', (event) => {
	mainProcess.closeWindow(currentWindow);
});