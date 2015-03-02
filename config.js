var config = {};

config.log = 'info';

config.elasticSearchServer = '127.0.0.1:9200';
config.pushBuff = 5000000; // 5MB default
config.pushFlushTime = 5000; // time in ms

config.memStats = true;
config.memStatsInterval = 1000; // time in ms

config.loadStats = true;
config.loadStatsInterval = 1000; // time in ms

config.cpuStats = true;
config.cpuAll = false;
config.cpuStatsInterval = 1000; // time in ms

config.udpServer = true;
config.udpListen = '127.0.0.1';
config.udpPort = 5514;

module.exports = config;
