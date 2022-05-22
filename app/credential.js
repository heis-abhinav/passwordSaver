const {ipcRenderer} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addToVault = document.querySelector('#add-to-vault');
const namee = document.querySelector('#name'); 
const username = document.querySelector('#username'); 
const password = document.querySelector('#password'); 
const closeNow = document.querySelector('#close-btn');
const id = document.getElementById('id');
addToVault.addEventListener('click', (event) => {
	mainProcess.addCredentials(id.value, namee.value,username.value,password.value, currentWindow);
	mainProcess.getAllData();
	namee.value = '';
	username.value = '';
	password.value = '';
});

closeNow.addEventListener('click', (event) => {
	mainProcess.closeWindow(currentWindow);
});


ipcRenderer.on('update-method', (event, value) =>{
	addToVault.innerText = 'Update';
	document.querySelector('title').textContent = 'Update Credentials';
	console.log(value)
	id.value = value.id;
	namee.value = value.name;
	username.value = value.username;
	password.value = value.password;
});