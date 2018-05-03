let electronInstaller = require('electron-winstaller');

let resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: 'release-builds/'
});