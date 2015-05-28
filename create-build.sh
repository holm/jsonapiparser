if [ -z "$1" ]
then
  echo "Usage: npm run create-build -- 1.2.3"
  exit 1
fi
browserify index.js -s jsonapiparser > builds/jsonapiparser.$1.js
browserify index.js -s jsonapiparser | uglifyjs -c > builds/jsonapiparser.$1.min.js
browserify index.js -s jsonapiparser > builds/jsonapiparser.js
browserify index.js -s jsonapiparser | uglifyjs -c > builds/jsonapiparser.min.js