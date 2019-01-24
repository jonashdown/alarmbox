# Success Disco
## Lets Celebrate when we do good things

## Description
This App uses node.js & sockets.io to implement a web based broadcast.
When something worth celebrating happens, GET requests can be sent to various endpoints to trigger a celebration mode in the browsers where it is displayed.

## Usage
Visiting `http(s):\\<successDiscoURL>\` will display the app in the browser.

Visiting `http(s):\\<successDiscoURL>\launch\<some_product>\<some_env>` will trigger a product launch celebration.

Visiting `http(s):\\<successDiscoURL>\newstarter\<someone>` will trigger a new starter celebration.

## Running locally

### Through native node
```
nvm use 10
npm install
npm start
```

### Through docker
```
docker build . -t successdisco
docker run -p -it
```
