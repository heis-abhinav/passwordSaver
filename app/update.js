const mainProcess = require("@electron/remote").require("./main");
const oldPassword = document.querySelector('#old-password');
const currentWindow = require('@electron/remote').getCurrentWindow();
const password = document.querySelector('#password');
const verifyPassword = document.querySelector('#password-verify');
const updateButton = document.querySelector('#update-password');
const closeNow = document.querySelector('#close-btn');
const form = document.querySelector('#form');
oldPassword.focus();
form.addEventListener('submit', (e) => e.preventDefault());

updateButton.addEventListener('click', () => {
	mainProcess.verPassword(oldPassword.value).then((response) => {
		if(response && validatePasswords()){
			mainProcess.registerMaster(password.value, currentWindow);
			mainProcess.relaunch();
		}else{
			alert('Wrong Password!')
		}
	});
});

const validatePasswords = () => {
	let returnto = true;
	if(verifyPassword.value != password.value){
		alert('Password mismatch')
		return false;
	}
	if(isNaN((password.value))){
		alert('Should be a number')
		return false;
	}
	if(password.value.length != 5){
		alert('Should be 5 digits')
		return false;
	}
	return returnto

}

closeNow.addEventListener('click', (event) => {
	mainProcess.closeWindow(currentWindow);
});