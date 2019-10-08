# complate-sample-spring-mvc

This sample repository demonstrates the server-side rendering of an [java spring](https://spring.io) application using the [corresponding adaptor](https://github.com/complate/complate-spring-mvc).

## Getting Started

```
# Install js dependencies
$ npm install
# Build java application
./mvnw clean install
# Collect dependencies
./mvnw dependency:copy-dependencies
# Build JSX view
./node_modules/.bin/faucet
# Start server
./mvnw spring-boot:run
```

## Walkthrough
