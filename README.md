# Clusterize - helper for core cluster module

Clusterize is a small helper module which wraps the [cluster module](http://nodejs.org/docs/v0.6.0/api/cluster.html) offered by Node 0.6.x.

## Install
	
	$ npm install clusterize

## Usage

	// server.js

	var clusterize = require('clusterize'),
		http = require('http');

	var server = http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello Clusterize!');
	});

	clusterize(server, 5100, {numWorkers: 4});

You can then start the server normally

	$ node server.js

## API

###clusterize(httpServer, port, [options]);

**`options`**:

* `numWorkers` : number of workers to fork, defaults to the number of available cores

## Using with Express 2.x

To use Clusterize with your Express application, simply export your `app` object and pass it to Clusterize

	// app.js
	var app = express.createServer();
	app.configure(function() {
		// ...
	});

	module.exports = app;

	// server.js

	var clusterize = require('clusterize'),    
    	app = require('./app');

	clusterize(app, 3000, {numWorkers: 2});

Start your app this way

	$ node server.js

##Watching for files changes + CoffeeScript

There are already plenty of mature libraries that do this, so I did not want to reinvent the wheel. If you want to watch for changes and automatically restart the server during development, you can use [nodemon](https://github.com/remy/nodemon) with Clusterize by starting it in development mode, like this:

	$ npm install -g nodemon
	$ NODE_ENV=development nodemon server.js

When started in development mode this way, Clusterize will run your application is a single process, and **will not spawn any workers.**

## TODO

This is pretty much a work in progress:

	* Tests
	* Starting, stopping, and restarting the cluster from command line
	* Sending messages to peers
	* Generate PID files for master and workers
	* Send email with stack trace when worker crashes
	
## License

(The MIT License)

Copyright (c) 2012 Kishore Nallan  <kishore@kishorelive.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
