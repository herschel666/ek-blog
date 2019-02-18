deploy:
	npm run clean:media
	npm run clean:assets
	npm run build
	npx deploy
