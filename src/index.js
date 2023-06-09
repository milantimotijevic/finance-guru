require('dotenv/config');

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./api/middleware/errorHandler');
const express = require('express');
const controllers = require('./api/controller');
const pack = require('../package.json');

const { BASIQ_API_KEY } = process.env;

if (!BASIQ_API_KEY) {
	throw Error('Missing BASIQ_API_KEY environment variable');
}

const port = process.env.PORT || 3000;

const app = express();

app.use([
	bodyParser.json(),
	bodyParser.urlencoded({ extended: true }),
	cors(),
	morgan('dev'),
]);

controllers.applyAllRoutes(app);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, 'static')));

const server = app.listen(port);

server.on('listening', () => {
	console.log(`${pack.name} server listening on port ${port}, App version ${pack.version}`);
});

// load Cron service for periodic users connections refreshing
require('./service/Cron');
