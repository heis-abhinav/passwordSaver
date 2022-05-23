//const closeBtn = document.querySelector('#close-btn');
const {ipcRenderer, clipboard} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const addButton = document.querySelector('.add-btn');
const vault = new Set();

const passwordList = document.getElementById('passwords');

/*const createPasswordElement = (id,name, username, password) => {
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
};*/

const createPasswordRow = (id, name, username, password) => {
	const passwordElement = passwordList.insertRow(-1);
	passwordElement.classList.add('password-list');
	passwordElement.setAttribute('id', mainProcess.convertDecToOct(id));
	passwordElement.insertCell().innerHTML = `<div class="password-name">${name}</div>`;
	passwordElement.insertCell().innerHTML = `<div class="password-username" title= "Click to copy" >${username}</div>`;
	passwordElement.insertCell().innerHTML = `<div class="password-password" title= "Click to copy">${password}</div>`;
	passwordElement.insertCell().innerHTML = `<div class="password-control">
												<button class="edit-password">Edit</button>
												<button class="remove-password">Remove</button>
											</div>`;
	return passwordElement;
}

addButton.addEventListener('click', () => {
	mainProcess.addCredentialsBox(currentWindow);
});

const updateRenderer = (vault) => {
	passwordList.innerHTML = '';
	vault.forEach(val => {
		const passwordElement = createPasswordRow(val.id, val.name, val.username, val.password);
		//passwordList.prepend(passwordElement);
	});
};

ipcRenderer.on('password-list', (event, list) => {
	updateRenderer(list);
});

passwordList.addEventListener('click', (event) => {
	const hasClass = className => {
		return event.target.classList.contains(className);
	};

	const listItem = getSelf(event);
	const parent = getParent(event);
	if( hasClass('password-username') || hasClass('password-password') ) {
		copyToClipboard(getPasswordText(listItem))
	}
	if(hasClass('edit-password')) mainProcess.addCredentialsBox(currentWindow, parent.id); 
	if(hasClass('remove-password')) removeCredential(currentWindow, parent.id);
});

const copyToClipboard = (text) => clipboard.writeText(text);
const getPasswordText = (text) => text.innerText;
const getSelf = ({target}) => target;
const getParent = ({target}) => target.parentNode.parentNode.parentNode;

const removeCredential = (targetWindow, id) => {
	if (confirm("Do you really want to remove this?") == true) {
	    mainProcess.removeCredential(currentWindow,id)
	}
}