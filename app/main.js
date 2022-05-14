const {app, BrowserWindow, Menu, Tray} =require('electron');
const {menubar} = require('menubar');
const path = require('path');
require('@electron/remote/main').initialize();
const option = {
				webPreferences:{
					nodeIntegration : true,
					contextIsolation : false,
					enableRemoteModule :true
				}
};
/*const menuBar = new menubar(
	{
		dir: __dirname,
		browserWindow : option, 
		preloadWindow: true,
		index: `file://${__dirname}/index.html`,
		icon: __dirname+'/locker.png',
		tooltip: 'menuuu'
	}
);*/
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
	/*const newWindow = new BrowserWindow({
		webPreferences : {
			nodeIntegration : true,
			contextIsolation : false,
			enableRemoteModule :true
		}
	});*/
	//newWindow.loadFile('app/index.html');
	//newWindow.show();
	// newWindow.once('ready-to-show', () => {
	// 	newWindow.show();
	// });
	updateMenu();
	//menuBar.tray.popUpContextMenu(menuOptions);
	tray.setToolTip('Password Vault');
})

const windoww = () => {
	const newWindow = new BrowserWindow({
		webPreferences : {
			nodeIntegration : true,
			contextIsolation : false,
			enableRemoteModule :true,
			devTools: true,
		},
		resizable:false,
		frame:false,
		titleBarStyle: 'hidden',
  		titleBarOverlay: true,
	});
	newWindow.setBackgroundColor('#212121')
	newWindow.loadFile('app/index.html');
	require("@electron/remote/main").enable(newWindow.webContents);
	newWindow.once('ready-to-show', () => {
	 	newWindow.show();
	});

newWindow.openDevTools();

}

const closeWindow =  exports.closeWindow  = async (targetWindow) => {
	targetWindow.hide();
}

