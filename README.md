# This is a node boilerplate for your new microservice!

It was created by the joint effort of Clearcode's PHP03 team (known also as The A Team). We've made it to make creating new microservices easier for us, as all of them share the same backbone.

## Features

### Metrics

Service metrics are exposed using [Express HTTP server](https://expressjs.com/) and [prom-client](https://github.com/siimon/prom-client) library, which serves them in a text format recognizable by the [Prometheus monitoring system](https://prometheus.io/). An example healthcheck metric is included in the `src/modules/healthcheck.js`.

### Testing

Testing environment is installed with dev dependencies. Our solution provides the following components:

 - [Mocha](https://mochajs.org/) as the base framework
 - [Chai](http://www.chaijs.com/) as the assertion library
 - [Sinon](https://sinonjs.org/) as the test doubles provider
 - [Rewire](https://github.com/jhnns/rewire) as the injector service
 - [Istanbul/NYC](https://istanbul.js.org/) as the coverage reporter

A basic test for the healthcheck module is prepared in the `src/tests/healthcheck.spec.js` directory.

### Docker

Two docker-compose files are prepared:

 - `docker-compose.yml` contains only the specification for the application itself. It is meant to be used in a local environment where external dependencies are already present, or to serve as a basis for production configuration
 - `docker-compose-local.yml` contains both the service and some external dependencies, so that the service can be used in a self-contained manner, without sharing data or resources with other microservices

A Dockerfile is also present, building the image in a two-step process.

### Configuration

Configuration is mainly done by utilising the environment variables. Example of these are contained in the `env.dist` file. The environment variables are utilised in the docker-compose files, as well as by the configuration file for the service, contained in the `src/config/default.js` file.

Service configuration converts required values from environment variables into numbers so that proper typing is ensured. It also contains a set of default values, in case some of the environment variables are missing.

One separate value is taken from `src/config/commit_sha` file. This file will contain the SHA of the commit on which the current image was built. It is supposed to be filled by Dockerfile setup and Dockerfile should receive this value from the continuous integration system. This allows us to use the value in metrics and logs, which in turn ensures that proper version of the application was deployed.

### Linter

Configuration file `.eslintrc.json` is included, as well as the [eslint](https://eslint.org/) tool itself in package.json, alongside a command to run or fix the source files.

### Makefile

The Makefile gives more convenient access to most frequently performed actions, such as rebuilding or starting the service, showing logs or logging into the container. It is based on the `docker-compose-local.yml` file, so all external dependencies will be run as well.

You will also be able to run tests in a docker container, as they would be in a pipeline. The results will be available in the `pipieline` directory.

### Pipelines (for bitbucket)

The original project was hosted internally on bitbucket, so we have created a pipeline file for it. You may find it useful if your setup is also based there, or it may serve you as an example of CD setup.

## What to do

Fill in .env based on .env.dist

Replace:
 - `your.dockerhub.com` in docker-compose.yml, docker-compose-local.yml to your Docker repository
 - `your-service-name` in docker-compose.yml, docker-compose-local.yml, Makefile and package.json
 - `your.service.name` in docker-compose.yml, docker-compose-local.yml
 - `project-name` in .env.dist

After that run (in the main project directory):

```
make build
make start
```

This should bring the project and external dependencies to life, unless something really unfortunate, like port conflict, happens. You can check how everything is going by checking logs:

```
make logs
```

Or by checking if the HTTP server responds:

```
curl 0.0.0.0:8030
```

It should yield:

```
<p>It is working!</p>%
```

Or by checking the metrics:

```
curl 0.0.0.0:8030/metrics
```

Which should yield something like this:

```
# HELP service_is_alive Check if service is working.
# TYPE service_is_alive counter
service_is_alive{hostname="f15d4a62c171"} 12

# HELP service_version Check service version.
# TYPE service_version counter
service_version{version="0.0.0"} 1

# HELP service_commit_sha Check service commit sha.
# TYPE service_commit_sha counter
service_commit_sha{sha="manual-build"} 1
```

If everything works as expected, you can start building your application!

## Enjoy!