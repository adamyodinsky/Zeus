FROM alpine

RUN apk update && apk add npm --update

COPY ./demoService /demoService
WORKDIR /demoService
ENTRYPOINT npm start

# adamyo/public:demoService-v1.0.2