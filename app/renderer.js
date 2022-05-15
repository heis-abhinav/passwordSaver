const closeBtn = document.querySelector('#close-btn');
const {ipcRenderer} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addButton = document.querySelector('.add-btn');

closeBtn.addEventListener('click', () =>{
	mainProcess.closeWindow(currentWindow);
});

const PasswordList = document.getElementById('password-list');
const createPasswordElement = (name, username, password) => {
	const passwordElement = document.createElement('article');
	passwordElement.classList.add('password-list');
	passwordElement.innerHTML = `
		<div class="password-text" >${name} ${username} ${password}</div>
		<div class="password-control">
			<button class="edit-password">Edit</button>
			<button class="remove-password">Remove</button>
		</div>
	`;
	return passwordElement;
};


addButton.addEventListener('click', ()=> {
	/*const passwordElement = createPasswordElement('abhinav', 'a', 'b');
	PasswordList.prepend(passwordElement);*/
	mainProcess.addCredentialsBox(currentWindow);
});

ipcRenderer.on('message', (event, message) => {
	console.log(message);
})