const closeBtn = document.querySelector('#close-btn');
const {ipcRenderer, clipboard} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addButton = document.querySelector('.add-btn');
const vault = new Set();

closeBtn.addEventListener('click', () =>{
	mainProcess.closeWindow(currentWindow);
});

const passwordList = document.getElementById('password-list');

const createPasswordElement = (id,name, username, password) => {
	const passwordElement = document.createElement('article');
	passwordElement.classList.add('password-list');
	passwordElement.innerHTML = `
		<div class="password-text">
			<div class="password-id" hidden>${id}</div>
			<div class="password-name">${name}</div>
			<div class="password-username">${username}</div>
			<div class="password-password">${password}</div>
		</div>
		<div class="password-control">
			<button class="edit-password">Edit</button>
			<button class="remove-password">Remove</button>
		</div>
	`;
	return passwordElement;
};

addButton.addEventListener('click', () => {
	mainProcess.addCredentialsBox(currentWindow);
});

ipcRenderer.on('this-message', (event, message) => {
	vault.add(message)
	passwordList.innerHTML = '';
	updateRenderer(vault);
});

const updateRenderer = (vault) => {
	vault.forEach(val => {
		const passwordElement = createPasswordElement(val.id, val.name, val.username, val.password);
		passwordList.prepend(passwordElement);
	});
};

ipcRenderer.on('password-list', (event, list) => {
	console.log(list);
	updateRenderer(list);
});

passwordList.addEventListener('click', (event) => {
	const hasClass = className => {
		return event.target.classList.contains(className);
	};

	const listItem = getParent(event);
	if(hasClass('password-name') || hasClass('password-username') || hasClass('password-password') ) {
		copyToClipboard(getPasswordText(listItem))
	}
});

const copyToClipboard = (text) => {
	clipboard.writeText(text);
};

const getPasswordText = (text) => {
	return text.innerText;
};

const getParent = ({target}) => {
	return target;
};