const fs = require('fs');
const ERROR_DIR = 'puppeteer_errors';

if (!fs.existsSync(ERROR_DIR)) {
    fs.mkdirSync(ERROR_DIR);
}

const saveError = (link, error, screenshotPath) => {
    const errorData = {
        link,
        error: error.message,
        screenshot: screenshotPath,
    };
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const errorFileName = `${ERROR_DIR}/error_${timestamp}.json`;
    fs.writeFileSync(errorFileName, JSON.stringify(errorData, null, 2));
};

module.exports = {
    saveError,
};
