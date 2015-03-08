# Rockhopper 

[![Rockhopper](http://mario.verbelen.org/img/Rockhopper_Penguin_32.png)](https://github.com/MarioVerbelen/rockhopper)

The Rockhopper Penguin

```js
var config = require('./local_config');
var Rockhopper = require('rockhopper');
rockhopper = new Rockhopper(config);

var exampleMapping = {
  "apache" : {
    "properties": {
      "@timestamp": {
        "type": "date",
        "format": "dateOptionalTime"
      },
      "bytes": {
        "type": "long"
      }
    }
  }
};
rockhopper.addMapping(exampleMapping);

rockhopper.run();
```

## Install

```bash
$ npm install rockhopper
```

## Test

* OS = linux
* requirements: elasticsearch server

```bash
$ mkdir -p test/node_modules
$ cd test
$ npm install rockhopper
$ cp node_modules/rockhopper/example/* .
$ node example_app
```

## features

  * Logging to Elasticsearch
    *  cpu, memory, load stats
  * Index mapping
  * Configurable intervals
  * External logging JSON on incoming udp
  * Graphing on Kibana

## Screenshots with Kibana 4

[![Rockhopper](http://mario.verbelen.org/img/kibana4_dashboard_ApacheLog_example_512.png)](http://mario.verbelen.org/img/kibana4_dashboard_ApacheLog_example.png)

[![Rockhopper](http://mario.verbelen.org/img/kibana4_dashboard_example_512.png)](http://mario.verbelen.org/img/kibana4_dashboard_example.png)

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
