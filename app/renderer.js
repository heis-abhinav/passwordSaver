//const closeBtn = document.querySelector('#close-btn');
const {ipcRenderer, clipboard} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addButton = document.querySelector('.add-btn');
const vault = new Set();

const passwordList = document.getElementById('passwords');

const createPasswordElement = (id,name, username, password) => {
	const passwordElement = document.createElement('tr');
	passwordElement.classList.add('password-list');
	passwordElement.innerHTML = `
			<td class="password-id" hidden>${+id}</td>
			<td class="password-name">${name}</td>
			<td class="password-username" title= "Click to copy" >${username}</td>
			<td class="password-password" title= "Click to copy">${password}</td>
			<div class="password-control">
				<button class="edit-password" id = "${+id}">Edit</button>
				<button class="remove-password">Remove</button>
			</div>
	`;
	return passwordElement;
};

addButton.addEventListener('click', () => {
	mainProcess.addCredentialsBox(currentWindow);
});

const updateRenderer = (vault) => {
	passwordList.innerHTML = '';
	vault.forEach(val => {
		const passwordElement = createPasswordElement(val.id, val.name, val.username, val.password);
		passwordList.append(passwordElement);
	});
};

ipcRenderer.on('password-list', (event, list) => {
	updateRenderer(list);
});

passwordList.addEventListener('click', (event) => {
	const hasClass = className => {
		return event.target.classList.contains(className);
	};

	const listItem = getParent(event);
	if( hasClass('password-username') || hasClass('password-password') ) {
		copyToClipboard(getPasswordText(listItem))
	}
	if(hasClass('edit-password')){mainProcess.addCredentialsBox(currentWindow, listItem.id);}
	console.log(listItem.id);
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