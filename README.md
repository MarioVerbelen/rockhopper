# Rockhopper 

The Rockhopper Penguin

```js
var rockhopper = require('rockhopper');
```

## Install

```bash
$ npm install rockhopper
```

## Test

```bash
$ mkdir test
$ cd test
$ mkdir node_modules
$ npm install rockhopper
$ cd node_modules/rockhopper/example
$ node example_app
```

## features

  * Logging cpu, memory, load stats to Elasticsearch
  * Configurable intervals
  * External logging JSON on incoming udp

## example external logging apache

```
LogFormat "{ \
\"@timestamp\": \"%{%Y-%m-%dT%H:%M:%S%z}t\", \
\"type\": \"apache\",  \
\"hostname\": \"<hostname>\",  \
\"domain\": \"%v\", \
\"tags\": \"apache\", \
\"clientip\": \"%a\", \
\"client\": \"%h\", \
\"status\": %s, \
\"duration\": %D, \
\"serveTime\": %T, \
\"status\": %>s, \
\"request\": \"%U%q\", \
\"bytes\": %B, \
\"method\": \"%m\", \
\"referer\": \"%{Referer}i\", \
\"useragent\": \"%{User-agent}i\" \
}" rockhopper_json

CustomLog "| nc -u localhost 5514" rockhopper_json
```
