print:
	echo "Something"

version-tag:
	@echo $(filter-out $@,$(MAKECMDGOALS))

run-docker:
	@docker run -d \
		--name hook3r \
		-p 18080:18080 \
		-e HOOK3R_SECRET='changeme!!' \
		quay.io/mag3llan/hook3r:$(tag)
rm:
	docker rm -f hook3r

test: 
	mocha ./lib

action:
	@echo action $(filter-out $@,$(MAKECMDGOALS))

%:      # thanks to chakrit
	@:    # thanks to William Pursell


