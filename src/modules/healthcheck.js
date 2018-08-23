'use strict';

const express = require('express');
const register = require('prom-client').register;
const Counter = require('prom-client').Counter;
const server = express();
const config = require('./../config/default');

const hostname = config.metrics.dockerHost;
const version = config.metrics.version;
const sha = config.metrics.commitSha;

const serviceHeartbeatCounter = new Counter({
  name: 'service_is_alive',
  help: 'Check if service is working.',
  labelNames: ['alive'],
});

const updateServiceStatus = () => {
  serviceHeartbeatCounter.inc({hostname});
};

const serviceVersion = new Counter({
  name: 'service_version',
  help: 'Check service version.',
  labelNames: ['version'],
});

serviceVersion.inc({version});

const serviceCommitSha = new Counter({
  name: 'service_commit_sha',
  help: 'Check service commit sha.',
  labelNames: ['commit_sha'],
});

serviceCommitSha.inc({sha});

server.get('/', (req, res) => {
  res.status(200);
  res.end('<p>It is working!</p>');
});

server.get('/metrics', (req, res) => {
  res.status(200);
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

console.log(`Server listening to ${config.server.port}, metrics exposed on /metrics endpoint`);
server.listen(config.server.port);

module.exports = { server, updateServiceStatus };
