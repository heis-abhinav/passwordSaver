const {app, BrowserWindow, Menu, Tray} =require('electron');
const {menubar} = require('menubar');
const path = require('path');
require('@electron/remote/main').initialize();
var sanitizer = require('sanitize')();
const AppDAO = require('./dao');
const vault = require('./vault');
const verify = require('./verifyPassword')
let vaultDB;
let db = null;
let newWindow, logWin, regWin, defaultmenus = null;
db = new AppDAO('./vault.sqlite3');
vaultDB = new vault(db)
let verification = new verify();
const bcrypt = require('bcrypt');
vaultDB.createTables();

const option = {
				webPreferences:{
					nodeIntegration : true,
					contextIsolation : false,
					enableRemoteModule :true
				}
};

const updateMenu = () => {
	const menuOptions = Menu.buildFromTemplate([
		{
			label: 'Open Vault',
			click() {openUp()}
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			click() { app.quit(); },
			accelerator: 'CommandOrControl+Q',
		}
	]);
	tray.setContextMenu(menuOptions);
}

app.on('ready', () => {
	tray = new Tray(path.join('img/locker.png'));
	updateMenu();
	tray.setToolTip('Password Vault');
})

const openUp = () => {
	console.log('open')
	vaultDB.checkRegistered().then((row) => {
		console.log('dbcheck')
		if (row.length <= 0 ){
			registerWindow();
		}else{
			loginWindow();
		}
	})
}

const loginWindow = () => {
	if(!logWin){
		logWin = new BrowserWindow ({
			webPreferences: {
				nodeIntegration:true,
				contextIsolation: false,
				enableRemoteModule: true,
			},
			//resizable: false,
			modal: true,
			show: false,
			alwaysOnTop:true,
			width: 300,
			height: 200,
		});
		logWin.loadFile('app/login.html');
		logWin.setMenu(null);
		logWin.once('ready-to-show', () => {
			logWin.show();
			logWin.webContents.openDevTools();
		});
		require("@electron/remote/main").enable(logWin.webContents);
	}
	logWin.on('close', () => logWin = null);
	return logWin;
}

const registerWindow = () => {
	if(!regWin) {
		regWin = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				enableRemoteModule: true,
			},
			resizable:true,
			modal: true,
			show: false,
			alwaysOnTop:true,
			width: 300,
			height: 200,
		});
		regWin.loadFile('app/register.html');
		registerWindow.setMenu(null);
		regWin.once('ready-to-show', () => {
			regWin.show();
			regWin.webContents.openDevTools();
		});
		require("@electron/remote/main").enable(regWin.webContents);
	}
	regWin.on('close', () => regWin = null);
	return regWin;
}

const mainWindow = () => {
	if(!newWindow){
		newWindow = new BrowserWindow({
			webPreferences : {
				nodeIntegration : true,
				contextIsolation : false,
				enableRemoteModule :true,
				devTools: false
			},
			resizable:false,
			titleBarStyle: 'hidden',
	  		titleBarOverlay: true,
		});

		newWindow.setBackgroundColor('#212121')
		newWindow.loadFile('app/index.html');
		//newWindow.setMenu(null);
		newWindow.once('ready-to-show', () => {
		 	newWindow.show();
		 	getAllData();

		});
		require("@electron/remote/main").enable(newWindow.webContents);
	}
	newWindow.on('close', () => newWindow = null);
	return newWindow;
}

const closeWindow =  exports.closeWindow  = async (targetWindow) => {
	targetWindow.close();
}


/*Prevent app to shutdown on closing all windows*/
app.on('window-all-closed', () => { e => e.preventDefault(); newWindow, regWin = null;  });

const addCredentialsBox = exports.addCredentialsBox = (targetWindow, values = null) => {
	let child = new BrowserWindow({
			webPreferences : {
				nodeIntegration : true,
				contextIsolation : false,
				enableRemoteModule :true,
				//devTools: false
			},
			resizable:true,
			parent:targetWindow,
			width: 300,
			height: 200,
			modal: true,
			show: false,
			alwaysOnTop:true, 
	});
	child.loadFile('./app/addcred.html');
	child.setMenu(null);
	child.once('ready-to-show', () => {
		if(values != null){
			vaultDB.getById(convertOctToDec(values)).then((row) => {
				child.webContents.send('update-method', row);
			});
		}
		child.show();
		child.webContents.openDevTools();
	});
	require("@electron/remote/main").enable(child.webContents);
};

const addCredentials = exports.addCredentials = (id = 0,namee, username, password, targetWindow) => {
	if(id != 0){
		vaultDB.update(id, namee, username, password).then((res) => {
			closeWindow(targetWindow);
		})
		
	}else{
		vaultDB.create(namee, username, password);
	}
	
};

const sanitizeString = exports.sanitizeString = (input) => {
	return sanitizer.value(input, 'String');
};

const getAllData = exports.getAllData = () => {
	vaultDB.getAll().then((rows) => {
		newWindow.webContents.send('password-list', rows);	
	});
	
};

const convertDecToOct = exports.convertDecToOct = (num) => num.toString(16);
const convertOctToDec = exports.convertOctToDec = (num) => parseInt(num, 16);
const removeCredential = exports.removeCredential = (targetWindow, id) => {
	vaultDB.delete(convertOctToDec(id)).then(getAllData());
};

const registerMaster = exports.registerMaster = (password,targetWindow) => {
	verification.createHash(password).then((hash) => {
		vaultDB.registerMaster(hash).then(() => {
				closeWindow(targetWindow);
				openUp();
			}
		);
	});
}

const verifyLogin = exports.verifyLogin = (inputPassword, targetWindow) => {
	vaultDB.getMaster().then((row)=> {
		let password = row[0]['password'];
		verification.verifyLogin(password, inputPassword).then((res) => {
			if(res){
				closeWindow(targetWindow);
				mainWindow();
			}
		})
	})
	//verification.verifyLogin(password).then
}