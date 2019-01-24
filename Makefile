REGISTRY := 536795411033.dkr.ecr.eu-west-1.amazonaws.com

build:
	docker build -t $(REGISTRY)/successdisco:latest .

run: build
	docker-compose down || true
	docker-compose up || true

push: build
	$(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker push $(REGISTRY)/successdisco:latest

promote: push
	http --cert /etc/pki/tls/certs/client.crt \
		--cert-key /etc/pki/tls/private/client.key \
		--verify no \
		--timeout 1000 \
		PUT https://planter.toolshed.test.tools.bbc.co.uk/successdisco < docker-compose.yml

deploy: push
	http --cert /etc/pki/tls/certs/client.crt \
		--cert-key /etc/pki/tls/private/client.key \
		--verify no \
		--timeout 1000 \
		PUT https://planter.toolshed.tools.bbc.co.uk/successdisco < docker-compose.yml
