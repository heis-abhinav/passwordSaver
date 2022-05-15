const {app, BrowserWindow, Menu, Tray} =require('electron');
const {menubar} = require('menubar');
const path = require('path');
let newWindow = null;
require('@electron/remote/main').initialize();
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
	tray = new Tray(path.join('img/locker.png'));
	updateMenu();
	tray.setToolTip('Password Vault');
	
})

const windoww = () => {
	//if(newWindow != null){
		let newWindow = new BrowserWindow({
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
	//newWindow.webContents.send('message', {namee, username, password})
}