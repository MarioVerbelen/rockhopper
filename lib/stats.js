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

var os = require('os');
var fs = require('fs');

var mappings = require('./mappings');

var func = {};
var config = {};
var cpuLast;
var indexLast;

function Stats(configSet) {
  config = configSet;
  func = require('./functions');
  // start elasticsearch connection
  func.connectES(config);
  func.startFlush(config);
}
module.exports = Stats;
Stats.prototype.run = run;
Stats.prototype.addMapping = addMapping;

function run() {
  createIndex('', function() {
    func.configSet(config);

    if(config.udpServer) {
      func.udpServer();
    }
    if(config.loadStats) {
      setInterval(getLoadStats, config.loadStatsInterval);
    }
    if(config.memStats) {
      setInterval(getMemStats, config.memStatsInterval);
    }
    if(config.cpuStats) {
      cpuLast = procStat();
      setInterval(getCpuTime, config.cpuStatsInterval);
    }

    if(config.createIndexes) {
      setInterval(createIndexTomorrow, 60 * 60 * 1000);
    }
  });
}

function addMapping(mapping) {
  Object.keys(mapping).forEach(function(key) {
    mappings[key] = mapping;
  });
}

function createIndexTomorrow() {
  var date = new Date().toISOString();
  var indexToday = config.indexPrefix + date.substring(0, 10).replace(/-/g, '.');
  if(indexLast == indexToday) {
    // create index of tomorrow in advance
    date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
    var tomorrow = config.indexPrefix + date.substring(0, 10).replace(/-/g, '.');
    createIndex(tomorrow);
  }
}

function createIndex(index, cb) {
  if(config.createIndexes) {
    if(!index || index.length == 0) {
      var date = new Date().toISOString();
      index = config.indexPrefix + date.substring(0, 10).replace(/-/g, '.');
    }

    /* defaults */
    if(config.refresh_interval == null) {
      config.refresh_interval = 5;
    }
    if(config.number_of_shards == null) {
      config.number_of_shards = 2
    }
    if(config.number_of_replicas == null) {
      config.number_of_replicas = 1;
    }

    var indice = {
      "index": index,
      "body":  {
        "settings": {
          "refresh_interval": config.refresh_interval,
          "number_of_shards":   config.number_of_shards,
          "number_of_replicas": config.number_of_replicas
        }
      }
    };

    func.esCreateIndice(indice, function() {
      Object.keys(mappings).forEach(function(key) {
        var map = {
          "index": index,
          "type":  key,
          "body":  mappings[key]
        };
        func.esCreateMapping(map);
      });
    });
    indexLast = index;
    createIndexTomorrow();
  }
  if(cb) {
    cb();
  }
}

function getMemStats() {
  var out = {
    "@timestamp": new Date().toISOString()
    , "_type":    "memStats"
    , "hostname": os.hostname()
  };

  var memInfo = procMeminfo();

  out['memApps'] = memInfo['MemTotal']
  - memInfo['MemFree']
  - memInfo['Buffers']
  - memInfo['Cached']
  - memInfo['Slab']
  - memInfo['PageTables']
  - memInfo['SwapCached'];
  out['memFree'] = memInfo['MemFree'];
  out['memBuffers'] = memInfo['Buffers'];
  //out['memTotal'] = memInfo['MemTotal'] + memInfo['SwapTotal'];
  out['memTotal'] = memInfo['MemTotal'];
  //out['swapTotal'] = memInfo['SwapTotal'];
  out['memSwapUsed'] = memInfo['SwapTotal'] - memInfo['SwapFree'];
  out['memSwapFree'] = memInfo['SwapFree'];
  out['memSwapCached'] = memInfo['SwapCached'];
  out['memCached'] = memInfo['Cached'];
  out['memCommited'] = memInfo['Committed_AS'];
  out['memKernelCache'] = memInfo['Slab'];
  out['memMapped'] = memInfo['Mapped'];
  out['memActive'] = memInfo['Active'];
  out['memPageTables'] = memInfo['PageTables'];

  //console.log(out);
  func.push(out);
}

function getLoadStats() {
  var load = os.loadavg();
  var message = {
    "@timestamp": new Date().toISOString()
    , "_type":    "loadStats"
    , "hostname": os.hostname()
  };
  for(i = 0; i < load.length; i++) {
    var x;
    if(i == 0) x = 1;
    if(i == 1) x = 5;
    if(i == 2) x = 15;
    message['load_' + x] = load[i];
  }

  func.push(message);
}

function procMeminfo() {
  var data = fs.readFileSync('/proc/meminfo', 'utf8');
  var dataLines = data.split("\n");
  var out = {};
  var list = "Committed_AS MemTotal MemFree Buffers Cached Slab PageTables SwapCached SwapTotal SwapFree Mapped Active";

  for(var i = 0; i < dataLines.length; i++) {
    dataLines[i] = dataLines[i].replace(/\s+/g, ' ').replace(':', '').split(" ");
    if(list.indexOf(dataLines[i][0]) != -1 && dataLines[i][0].length > 0) {
      out[dataLines[i][0]] = parseInt(dataLines[i][1]);
    }
  }

  return out;
}
function procStat() {
  var data = fs.readFileSync('/proc/stat', 'utf8');
  var dataLines = data.split("\n");
  var out = [];

  for(var i = 0; i < dataLines.length; i++) {
    dataLines[i] = dataLines[i].replace(/\s+/g, ' ').split(" ");
    if(dataLines[i][0].indexOf("cpu") != -1) {
      out.push(dataLines[i]);
    }
  }

  return out;
}
function getCpuTime() {
  var curr = procStat();
  var old = cpuLast;
  var X = [];
  var cpuCount = curr.length - 1;
  var out = {
    "@timestamp": new Date().toISOString()
    , "_type":    "cpuStats"
    , "hostname": os.hostname()
  };

  // loop true cpus
  for(var cpu = 0; cpu < curr.length; cpu++) {
    X[cpu] = [];
    // calculate diff per counter (0 = label)
    for(var i = 1; i < curr[cpu].length; i++) {
      X[cpu][i] = curr[cpu][i] - old[cpu][i];
    }

    if(cpu == 0) {
      X[cpu] = cpuMath(X[cpu], cpuCount);
      out = renderCpuStats(cpu, X, out);
    } else if(config.cpuAll) {
      X[cpu] = cpuMath(X[cpu], 1);
      out = renderCpuStats(cpu, X, out);
    }
  }

  cpuLast = curr;
  func.push(out);
}

function cpuMath(cpu, count) {
  var sum = 0;
  for(var i = 1; i < cpu.length; i++) {
    sum += cpu[i];
  }

  for(var j = 1; j < cpu.length; j++) {
    cpu[j] = Math.round(((cpu[j] / sum ) * 100) * count);
  }

  return cpu;
}
function renderCpuStats(cpu, X, out) {
  if(cpu == 0) {
    N = '';
  } else {
    N = cpu - 1;
  }
  out['cpu' + N + 'User'] = X[cpu][1];
  out['cpu' + N + 'Nice'] = X[cpu][2];
  out['cpu' + N + 'System'] = X[cpu][3];
  out['cpu' + N + 'Idle'] = X[cpu][4];
  out['cpu' + N + 'Iowait'] = X[cpu][5];
  out['cpu' + N + 'Irq'] = X[cpu][6];
  out['cpu' + N + 'Softirq'] = X[cpu][7];
  out['cpu' + N + 'Steal'] = X[cpu][8];
  out['cpu' + N + 'Guest'] = X[cpu][9];
  out['cpu' + N + 'Guest_nice'] = X[cpu][10];

  return out;
}
