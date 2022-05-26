# Password Vault
A password storage desktop app to store passwords of different applcations under one roof which resides in tray

## Technologies Used:
* [electron JS](https://www.electronjs.org/)  
* [Node JS](https://nodejs.org)

## Usage:
To use this application:  
* close or download the project,
* open terminal in project folder,
* initialize using ```npm install```.
* To run, execute the following command: ```npm start```
* project icon will appear on the system taskbar Tray
* Right click on the icon, click on "Open Vault"
* It would prompt for setting master password which would require to access the vault.
* Set the master password.
* login prompt would appear.
* use the master password set earlier
* vault window would open.
* You can now add usernames and passwords and store it for further use.
* click on username, password to copy it.

## Build:
Before building the project, yarn is required.
To install yarn, use ```npm install --global yarn```

To build the executable version of application:
* clone or download the project.
* open terminal in project folder
* initialize using ```npm install```
* execute the following command: ```yarn app:dist```
* A dist folder would be created in the project folder.

For use npm for building, [package.json](https://github.com/heis-abhinav/passwordSaver/blob/main/package.json) configuration should be updated.
For further information about build configuration, visit [Electron Builder](https://www.electron.build/configuration/configuration.html).
 
