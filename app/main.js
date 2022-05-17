const {app, BrowserWindow, Menu, Tray} =require('electron');
const {menubar} = require('menubar');
const path = require('path');
require('@electron/remote/main').initialize();
const vault = require('./vault');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./vault.sqlite3', (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }});

db.run(`CREATE TABLE IF NOT EXISTS passwordvault (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR,
		username VARCHAR,
		password VARCHAR
	)`, async () => {
			const vaultDB = await new vault(db);
		}
	);


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
	vaultDB.createTable();
	tray = new Tray(path.join('img/locker.png'));
	updateMenu();
	tray.setToolTip('Password Vault');
	
})

const windoww = () => {
	//if(newWindow != null){
		const newWindow = new BrowserWindow({
			webPreferences : {
				nodeIntegration : true,
				contextIsolation : false,
				enableRemoteModule :true,
			},
			
			resizable:false,
			frame:false,
			titleBarStyle: 'hidden',
	  		titleBarOverlay: true,
		});
		newWindow.setBackgroundColor('#212121')
		newWindow.loadFile('app/index.html');
		newWindow.once('ready-to-show', () => {
		 	newWindow.show();

		});

		require("@electron/remote/main").enable(newWindow.webContents);
		newWindow.openDevTools();
	//}
	return newWindow;
}

const closeWindow =  exports.closeWindow  = async (targetWindow) => {
	targetWindow.close();
}

/*Prevent app to shutdown on closing all windows*/
app.on('window-all-closed', e => e.preventDefault() )


const addCredentialsBox = exports.addCredentialsBox = (targetWindow) => {
	let child = new BrowserWindow({
			webPreferences : {
				nodeIntegration : true,
				contextIsolation : false,
				enableRemoteModule :true,
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
		 	child.show();
	});
	require("@electron/remote/main").enable(child.webContents);
}

const addCredentials = exports.addCredentials = (namee, username, password, targetWindow) => {
	console.log(namee, username, password);
	console.log(targetWindow);
	//newWindow.webContents.send('message', {namee, username, password})
}