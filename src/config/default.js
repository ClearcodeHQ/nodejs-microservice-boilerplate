'use strict';

const fs = require('fs');
const os = require('os');

module.exports = {
  server: {
    host: '0.0.0.0',
    port: process.env.SERVICE_PORT || 3201,
  },
  metrics: {
    heartbeatInterval: Number(process.env.HEARTBEAT_INTERVAL) || 1000,
    commitSha: fs.readFileSync(__dirname + '/commit_sha', {encoding: 'utf-8'}) || 'manual-build',
    dockerHost: os.hostname(),
    version: process.env.npm_package_version || '',
  },
  rabbitmq: {
    hostname: process.env.RABBITMQ_HOST || 'hostname',
    username: process.env.RABBITMQ_USER || 'username',
    password: process.env.RABBITMQ_PASS || 'password',
    port: process.env.RABBITMQ_PORT || 5672,
    queue: process.env.RABBITMQ_QUEUE || 'queue',
    exchange: process.env.RABBITMQ_EXCHANGE || 'exchange',
    maxConnectionRetries: Number(process.env.RABBITMQ_MAX_CONNECTION_RETRIES) || 10,
    initialRetryConnectionAfter: Number(process.env.RABBITMQ_INITIAL_RETRY_CONNECTION_AFTER) || 1000,
    waitForNack: Number(process.env.RABBITMQ_WAIT_BEFORE_NACK) || 5000,
  },
  postgres: {
    user: process.env.PGSQL_DB_USER || 'user',
    password: process.env.PGSQL_DB_PASSWORD || 'password',
    database: process.env.PGSQL_DB_NAME || 'database',
    host: process.env.PGSQL_DB_HOST || 'host',
    port: process.env.PGSQL_DB_PORT || 5432,
  },
  elasticsearch: {
    host: process.env.ELASTIC_HOST || 'host',
    port: process.env.ELASTIC_PORT || 9200,
    index: process.env.ELASTIC_EXAMPLE_INDEX || 'index',
    type: process.env.ELASTIC_EXAMPLE_TYPE || 'type',
    pingTimeout: Number(process.env.CONNECTION_TIMEOUT) || 5000,
  },
};
