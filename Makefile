.PHONY: deploy
deploy:
	npm run clean:media
	npm run clean:assets
	npm run build
	npx deploy

.PHONY: fix-sharp
fix-sharp:
	cd ./src/queues/resize-image && \
		rm -rf ./node_modules/sharp && \
		npm install
