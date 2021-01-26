rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf packages/*/dist 
cnpm i
# lerna bootstrap --npm-client=cnpm && lerna run build && lerna run test:all
npm run test:local

