const {app, BrowserWindow, Menu, Tray} =require('electron');
const applicationMenu = require('./application-menu');
const path = require('path');
require('@electron/remote/main').initialize();
const AppDAO = require('./dao');
const vault = require('./vault');
const verify = require('./verifyPassword')
let vaultDB;
let db = null;
let newWindow, logWin, regWin, defaultmenus = null;
let dbpath = `vault.sqlite3`.replace('app.asar', '');
const imgPath = app.isPackaged ? path.join(process.resourcesPath, "img") : "img";
console.log(dbpath)
db = new AppDAO(dbpath);
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
const gotTheLock = app.requestSingleInstanceLock();

if(!gotTheLock) app.quit();

app.on('ready', () => {
	
	tray = new Tray(path.join(imgPath,'locker.png'));
	console.log('onready');
	updateMenu();
	tray.setToolTip('Password Vault');
})

const openUp = () => {
	console.log('openup');
	vaultDB.checkRegistered().then((row) => {
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
				devTools:false,
			},
			resizable: false,
			modal: true,
			show: false,
			alwaysOnTop:true,
			width: 300,
			height: 200,
			icon:path.join(imgPath,'locker.png'),
		});
		logWin.loadFile(path.join(__dirname, 'login.html'));
		logWin.setMenu(null);
		logWin.once('ready-to-show', () => {
			logWin.show();
		});
		require("@electron/remote/main").enable(logWin.webContents);
	}
	logWin.on('close', () => logWin = null);
	return logWin;
}

const registerWindow = exports.registerWindow = () => {
	if(!regWin) {
		regWin = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				enableRemoteModule: true,
			},
			resizable:true,
			devTools:false,
			modal: true,
			show: false,
			alwaysOnTop:true,
			width: 300,
			height: 200,
			icon:path.join(imgPath,'locker.png'),
		});
		regWin.loadFile(path.join(__dirname, 'register.html'));
		regWin.setMenu(null);
		regWin.once('ready-to-show', () => {
			regWin.show();
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
				devTools: false,
			},
			resizable:false,
			titleBarStyle: 'hidden',
	  		titleBarOverlay: true,
	  		icon:path.join(imgPath,'locker.png'),
		});

		newWindow.setBackgroundColor('#212121')
		newWindow.loadFile(path.join(__dirname, 'index.html'));
		newWindow.setMenu(applicationMenu);
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
				devTools: false
			},
			resizable:true,
			parent:targetWindow,
			width: 300,
			height: 200,
			modal: true,
			show: false,
			alwaysOnTop:true, 
			icon:path.join(imgPath,'locker.png'),
	});
	child.loadFile(path.join(__dirname, 'addcred.html'));
	child.setMenu(null);
	child.once('ready-to-show', () => {
		if(values != null){
			vaultDB.getById(convertOctToDec(values)).then((row) => {
				child.webContents.send('update-method', row);
			});
		}
		child.show();
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
	verPassword(inputPassword).then((res) => {
		if(res){
			closeWindow(targetWindow);
			mainWindow();
		}else{
			targetWindow.webContents.send('wrong-password');
		}
	});
}

const verPassword = exports.verPassword = (inputPassword)  => {
	return new Promise((resolve,reject) => {
		vaultDB.getMaster().then((row)=> {
			let password = row[0]['password'];
			verification.verifylogin(password, inputPassword).then((res) => {
				resolve(res);
			});
		});
	});
	
}

const updatePassword = exports.updatePassword = () => {
	updateWindow();
}

const updateWindow = () => {
	let updWin = new BrowserWindow({
			webPreferences : {
				nodeIntegration : true,
				contextIsolation : false,
				enableRemoteModule :true,
				devTools: false
			},
			resizable:true,
			parent:newWindow,
			width: 300,
			height: 200,
			modal: true,
			show: false,
			alwaysOnTop:true, 
	});
	updWin.loadFile(path.join(__dirname, 'update.html'));
	updWin.setMenu(null);
	updWin.once('ready-to-show', () => {
		updWin.show();
	});
	require("@electron/remote/main").enable(updWin.webContents);
}

const relaunch = exports.relaunch = () => {
	closeWindow(newWindow);
}