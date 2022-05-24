const {ipcRenderer} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addToVault = document.querySelector('#add-to-vault');
const name = document.querySelector('#name'); 
const username = document.querySelector('#username'); 
const password = document.querySelector('#password'); 
const closeNow = document.querySelector('#close-btn');
const id = document.getElementById('id');
name.focus();
addToVault.addEventListener('click', (event) => {
	namee = name.value.trim();
	usernamee = username.value.trim();
	passwordd = password.value.trim();

	if(namee && usernamee && passwordd ){
		console.log(namee, usernamee, passwordd);
		mainProcess.addCredentials(id.value, namee, usernamee, passwordd, currentWindow);
		mainProcess.getAllData();
		name.value = '';
		username.value = '';
		password.value = '';
	}
});

closeNow.addEventListener('click', (event) => {
	mainProcess.closeWindow(currentWindow);
});

ipcRenderer.on('update-method', (event, value) =>{
	addToVault.innerText = 'Update';
	document.querySelector('title').textContent = 'Update Credentials';
	console.log(value)
	id.value = value.id;
	name.value = value.name;
	username.value = value.username;
	password.value = value.password;
});