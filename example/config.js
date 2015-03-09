var config = {};

config.log = 'info';

config.indexPrefix = 'rockhopper-';
config.number_of_shards = 2;
config.number_of_replicas = 1;
config.refresh_interval = 5;

/* don't create indexes on all Rockhopper's, one is enough
 * two if you want HA for index creations
 */
config.createIndexes = true;

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
