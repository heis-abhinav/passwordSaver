const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const password = document.querySelector('#password');
const loginButton = document.querySelector('#login');

loginButton.addEventListener('click', (event) => {
	mainProcess.verifyLogin(password.value, currentWindow);
});