letter ?= a
number ?= 3

db-up:
	@echo "Starting MongoDB..."
	@docker-compose -f MongoDB/docker-compose.yml up -d
	
create-chain:
	./MicroServices/generate_microservices.sh $(letter) $(number) 

