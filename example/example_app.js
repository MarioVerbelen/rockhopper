var config = require('./config');
var Rockhopper = require('rockhopper');
rockhopper = new Rockhopper(config);

var apacheMapping = {
  "apache": {
    "properties": {
      "@timestamp": {
        "type": "date",
        "format": "dateOptionalTime"
      },
      "bytes": {
        "type": "long"
      },
      "client": {
        "type": "string"
      },
      "clientip": {
        "type": "string"
      },
      "domain": {
        "type": "string"
      },
      "duration": {
        "type": "long"
      },
      "hostname": {
        "type": "string"
      },
      "method": {
        "type": "string"
      },
      "referer": {
        "type": "string"
      },
      "request": {
        "type": "string"
      },
      "serveTime": {
        "type": "long"
      },
      "status": {
        "type": "long"
      },
      "tags": {
        "type": "string"
      },
      "type": {
        "type": "string"
      },
      "useragent": {
        "type": "string"
      }
    }
  }
};
rockhopper.addMapping(apacheMapping);

rockhopper.run();