var clusterize = require('clusterize'),
	app = require('./app');

clusterize(app, 5100, {numWorkers: 4});