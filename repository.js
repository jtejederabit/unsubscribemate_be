const fs = require('fs');

const REPOSITORY_FILE = 'unsubscribe_methods.json';

const loadRepository = () => {
    if (fs.existsSync(REPOSITORY_FILE)) {
        return JSON.parse(fs.readFileSync(REPOSITORY_FILE));
    }
    return {};
};

const saveRepository = (repository) => {
    fs.writeFileSync(REPOSITORY_FILE, JSON.stringify(repository, null, 2));
};

const repository = loadRepository();

module.exports = {
    loadRepository,
    saveRepository,
    repository
};
