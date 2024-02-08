letter ?= a
number ?= 3
url ?= http://localhost:8080
length ?= 5
inner-loop-interval ?= 1
outer-loop-interval ?= 1


db-helm-install:
	helm install mongo bitnami/mongodb --values mongodb/mongo-values.yaml

db-helm-uninstall:
	@echo "Stopping MongoDB..."
	helm uninstall mongo

db-up:
	@echo "Starting MongoDB..."
	docker-compose -f mongodb/docker-compose.yaml up -d

db-down:
	@echo "Stopping MongoDB..."
	docker-compose -f mongodb/docker-compose.yaml down

create-chain:
	./MicroServices/generate_microservices.sh $(letter) $(number) 

load-test:
	@echo "Starting load test..."
	./load_test.sh $(url) $(length) $(inner-loop-interval) $(outer-loop-interval)
	
start-controller-scraper:
	@echo "Starting controller scraper..."
	node Zeus-ControllersScraper/src/app.js

start-nodes-scrapers:
	@echo "Starting nodes scrapers..."
	node Zeus-NodesScraper/src/app.js

start-backend:
	@echo "Starting backend..."
	node Zeus-BackEnd/src/app.js
