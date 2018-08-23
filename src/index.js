'use strict';

const config = require('./config/default');
const healthcheck = require('./modules/healthcheck');

setInterval(healthcheck.updateServiceStatus, config.metrics.heartbeatInterval);

console.log('Starting service');
console.log('My config is as follows:');
console.log(JSON.stringify(config, null, 2));
