var clusterize = require('../lib/clusterize'),
	http = require('http');

var server = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hola!');
});

clusterize(server, 5100, {numWorkers: 4});