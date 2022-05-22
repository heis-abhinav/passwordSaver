const {app, BrowserWindow, Menu, Tray} =require('electron');
const {menubar} = require('menubar');
const path = require('path');
require('@electron/remote/main').initialize();
var sanitizer = require('sanitize')();
const AppDAO = require('./dao');
const vault = require('./vault');
let vaultDB;
let db = null;
let newWindow = null;
db = new AppDAO('./vault.sqlite3');
vaultDB = new vault(db)
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
			click() {windoww()}
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
	
	Menu.setApplicationMenu(null);
	tray = new Tray(path.join('img/locker.png'));
	updateMenu();
	tray.setToolTip('Password Vault');
	
})

const windoww = () => {
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
		newWindow.once('ready-to-show', () => {
		 	newWindow.show();
		});

		require("@electron/remote/main").enable(newWindow.webContents);
	
		newWindow.once('ready-to-show', () => {
			getAllData();			
		});
	}
	return newWindow;
}

const closeWindow =  exports.closeWindow  = async (targetWindow) => {
	targetWindow.close();
}


/*Prevent app to shutdown on closing all windows*/
app.on('window-all-closed', () => { e => e.preventDefault(); newWindow = null; });


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
	});
	child.loadFile('./app/addcred.html');
	child.once('ready-to-show', () => {
		if(values != null){
			vaultDB.getById(values).then((row) => {
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

const sanitizeString = exports.sanitizeString = (input) => {
	return sanitizer.value(input, 'String');
};

const getAllData = exports.getAllData = () => {
	vaultDB.getAll().then((rows) => {
		newWindow.webContents.send('password-list', rows);	
	});
};