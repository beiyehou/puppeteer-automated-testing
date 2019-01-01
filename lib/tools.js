const fs = require('fs');

module.exports.testandCreateFolder = function(folderPath) {
    /** Testing the screenshots folder and create it if not existing. **/
    try {
        fs.accessSync(folderPath, fs.constants.F_OK);
    } catch(err) {
        fs.mkdirSync(folderPath);
    }
}