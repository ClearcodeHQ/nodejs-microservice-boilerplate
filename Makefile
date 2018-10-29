include .env
export

# ========================== HELP COLORS ================================
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)
# =======================================================================
.DEFAULT_GOAL := help
RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

DOCKER_EXEC_INTER = docker exec -it

SERVICE_ID = $$(docker ps | grep $(PROJECT).your-service-name | cut -c 1-12)

CURRENT_DIR := $(shell pwd)

.PHONY: help

TARGET_MAX_CHAR_NUM=20

DEV_COMPOSE_FILE=docker-compose-local.yml
STACK_COMPOSE_FILE=docker-compose.yml

## BUILD environment
build: build-app npm-install
build-app:
		docker-compose -f ${DEV_COMPOSE_FILE} build

## START environment
start:
		docker-compose -f ${DEV_COMPOSE_FILE} up -d

## STOP environment
stop:
		docker-compose -f ${DEV_COMPOSE_FILE} stop

## DESTROY environment
destroy:
		docker-compose -f ${DEV_COMPOSE_FILE} down

## REBUILD environment
rebuild: rebuild-app npm-install
rebuild-app:
		docker-compose -f ${DEV_COMPOSE_FILE} up -d --build

## Log in NODE
login-node:
		${DOCKER_EXEC_INTER} ${SERVICE_ID} sh

## Install DEPENDENCIES
npm-install:
		npm install

## Display LOGS
logs:
		docker-compose -f ${DEV_COMPOSE_FILE} logs

## Run TESTS
tests:
		${DOCKER_EXEC_INTER} ${SERVICE_ID} npm run test

## Run TESTS IN DOCKER (uses the same logic as the pipeline setup)
tests-in-docker:
		docker build . -t sutimage:latest --build-arg COMMIT_SHA=test-build
		docker build . --file Dockerfile.test -t suttestimage:latest
		docker run --rm -v ${CURRENT_DIR}/pipeline:/pipeline suttestimage:latest

## Show HELP
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

.PHONY: build start stop destroy rebuild login-node logs npm-install build-app rebuild-app