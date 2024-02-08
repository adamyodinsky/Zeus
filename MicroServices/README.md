# Zeus Demo Micro-Services chain

Demo micro-services chain designed to simulate a load of microservices in a k8s cluster as easily as possible.

Execute this script to create a microservices chain set
`./MicroServices/generate_microservices.sh <letter> <number>`

- letter: is the microservices chain set identifier
- length: the length of the microservices chain

## Load Testing

Do some load testing on the chain

`./load_test.sh <url> <length> <inner-loop-interval> <outer-loop-interval>`
