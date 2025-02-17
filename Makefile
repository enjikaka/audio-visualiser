build:
	npx esbuild src/index.ts --bundle --minify --sourcemap --format=esm --platform=browser --target=es2018 --outfile=pkg/index.js
	npx tsc
	deno run --allow-run --allow-read --allow-write https://raw.githubusercontent.com/enjikaka/webact/refs/heads/master/scripts/compile-package-json.ts
	cp README.md pkg/README.md

release:
	npm version patch
	make build
	cd pkg && npm publish
	git push --follow-tags

test:
	npm run lint:js
	npm run lint:types
