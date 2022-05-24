const { Menu, shell} = require('electron');
const mainProcess = require('./main');
const template = exports.template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Change Password',
				click(){
					mainProcess.updatePassword();
				},
			
			},
			{
				label: 'Close',
				accelerator: 'CommandOrControl+Q',
				click(item, focusedWindow){
					mainProcess.closeWindow(focusedWindow);
				}
			},		
		]
	},
	

];

module.exports = Menu.buildFromTemplate(template);