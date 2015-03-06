/*
 * The MIT License (MIT)
 *
 * Copyright (c) Mario Verbelen <mario@verbelen.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var buffer = [];
var bufferSize = 0;
var config = {};
function functions() {
}
module.exports = functions;
functions.udpServer = udpServer;
functions.flush = flush;
functions.push = push;
functions.startFlush = startFlush;

function push(data) {
  if(checkJSONValid(data)) {
    var type = 'logs'; // default _type
    if(data.hasOwnProperty('type')) {
      type = data['type'];
    }

    if(!data.hasOwnProperty('@timestamp')) {
      data['@timestamp'] = new Date().toISOString()
    }

    var index = '{ index: { _index: "rockhopper-'
      + data['@timestamp'].substring(0, 10).replace(/-/g, '.')
      + '", _type: "'
      + type
      + '" } }';

    var dataStr = JSON.stringify(data);

    bufferSize += index.length;
    bufferSize += dataStr.length;
    buffer.push(index);
    buffer.push(dataStr);

    if(bufferSize >= config.pushBuff) {
      flush();
    }
  } else {
    console.log('invalid JSON:\'' + data + '\'');
  }
}

function startFlush(config) {
  setInterval(flush, config.pushFlushTime);
}

var elasticsearch = require('elasticsearch');
var client;
function connectES(config) {
  client = new elasticsearch.Client({
    host: config.elasticSearchServer,
    log:  config.log
  });
}
functions.connectES = connectES;

function udpServer(configSet) {
  config = configSet;
  var PORT = config.udpPort;
  var HOST = config.udpListen;
  var dgram = require('dgram');
  var server = dgram.createSocket('udp4');

  server.on('message', function(data) {
    // split coz apache can push more then one line in a packet
    var lines = data.toString().split(/\r?\n/);
    for(i = 0; i < lines.length; i++) {
      if(lines[i].length > 0) {
        push(JSON.parse(lines[i]));
      }
    }
  });

  server.bind(PORT, HOST);
}

function flush() {
  var out = buffer;
  buffer = [];

  if(out.length != 0) {
    client.bulk({
      body: out
    }, function(err, resp) {
      if(err) console.log(err);
      // todo: retry buffer in case of
    })
  }
}

function checkJSONValid(str) {
  try {
    JSON.parse(JSON.stringify(str));
  } catch(e) {
    return false;
  }
  return true;
}
