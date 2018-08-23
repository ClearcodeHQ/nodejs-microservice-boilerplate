FROM node:8.9-alpine as builder

RUN mkdir code
WORKDIR /code
ADD package.json package-lock.json ./
RUN npm install
ADD . .
RUN rm package-lock.json

ARG COMMIT_SHA
RUN echo $COMMIT_SHA > ./src/config/commit_sha

FROM node:8.9-alpine as image

RUN apk update && apk add vim curl
COPY --from=builder /code /code
ENV PATH "$PATH:/code/node_modules/.bin"
WORKDIR /code

EXPOSE 3000

CMD ["npm", "start"]

