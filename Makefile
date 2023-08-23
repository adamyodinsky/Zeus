
db-up:
	@echo "Starting MongoDB..."
	@docker-compose -f MongoDB/docker-compose.yml up -d
	