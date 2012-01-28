/*
 | Clusterize
 | Copyright (C) 2012 Kishore Nallan <kishore@kishorelive.com>
 | MIT Licensed
*/

var cluster = require('cluster'),
    fs = require('fs');

exports.version = '0.1.2';

var CPU_CORES = require('os').cpus().length,
    ABORT_WHEN_DEATHS_EXCEEDS = 20,
    STARTUP_TIME = new Date();

function Clusterize(server, port, options) {
    this.numWorkers = options.numWorkers || CPU_CORES;
    this.pidDir = options.pidDir || 'pids';
    this.workerDeaths = 0;
    this.workerPids = Object.create(null);

    this.start = function() {
        if(cluster.isMaster && process.env.NODE_ENV != 'development') {
            console.log('Starting application with %d workers.', this.numWorkers);
            this.forkWorkers(this.numWorkers);
            cluster.on('death', this.onWorkerDeath.bind(this));
        } else {
            server.listen(port);
        }
    };

    this.shutdown = function() {
       // kill all workers first, and then the master
       for(var pid in this.workerPids) process.kill(pid);
       process.exit(1);
    };

    this.forkWorkers = function(numWorkers) {
        for (var i=0; i<numWorkers; i++) {
            var worker = cluster.fork();
            this.workerPids[worker.pid] = worker.pid;
            console.log('Forked worker with pid %d.', worker.pid);
        }
    };

    this.onWorkerDeath = function(worker) {
        console.log('Worker %d died.', worker.pid);
        delete this.workerPids[worker.pid];

        if(new Date() - STARTUP_TIME < 20000 && ++workerDeaths == ABORT_WHEN_DEATHS_EXCEEDS) {
            console.error('Detected over %d worker deaths during startup.', ABORT_WHEN_DEATHS_EXCEEDS);
            console.error('There is something seriously wrong with your server. Aborting.');
            return this.shutdown();
        }
        // try to replace the dead worker with another
        this.forkWorkers(1);
    };

    this.createPidFile = function(pid, isMaster) {
        isMaster = isMaster || false;
        var filePath = join(pidDir, pid.toString());
        fs.writeFileSync(filePath, pid.toString(), 'ascii');
    };

    this.start();
}

module.exports = Clusterize;