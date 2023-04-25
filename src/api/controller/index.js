const fs = require('fs');
const path = require('path');

/*
Dynamically import all other files in dir and apply their routes to server object
*/
const applyAllRoutes = (app) => {
    fs.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)))
	.forEach(file => {
        const controller = require(path.join(__dirname, file));
        controller.applyRoutes(app);
    })
};

module.exports = {
    applyAllRoutes,
};
