const {ipcRenderer} = require('electron');
const mainProcess = require('@electron/remote').require('./main.js');
const currentWindow = require('@electron/remote').getCurrentWindow();
const prompt = require('electron-prompt');
const password = document.querySelector('#password');
const secretPassword = `2124052022`;
const loginButton = document.querySelector('#login');
const forgetButton = document.querySelector('#forget');
password.focus();
loginButton.addEventListener('click', (event) => {
	mainProcess.verifyLogin(password.value, currentWindow);
});

ipcRenderer.on('wrong-password',(e) =>  alert('wrong password'))

forgetButton.addEventListener('click', (event) => {
	prompt({
	    title: 'Password',
	    label: 'Enter Secret Password:',
	    value: '',
	    inputAttrs: {
	        type: 'text',
	        minlength: '10',
	        maxlength: '10',
	        pattern: '[0-9]*'
	    },
	    type: 'input',
	    alwaysOnTop:true,
	}, currentWindow)
	.then((response) => {
	    if(response !== null) {
	    	if(response === secretPassword){
	    		mainProcess.registerWindow();
	    		mainProcess.closeWindow(currentWindow);
	    	}else{
	    		alert('Wrong Password');
	    	}
	    }
	})
	.catch(console.error);
});