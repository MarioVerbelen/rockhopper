# rockhopper
  * ToDo
    * check if index already exists to avoid IndexAlreadyExistsException
  * 0.0.10
    * fix configSet if config.udpServer = false
    * fix catch invalid JSON input on udp
  * 0.0.9
    * add option config.refresh_interval for performance gain of indexing documents
    * add default settings of index creation
    * fix bufferSize not resetted @flush
  * 0.0.8
    * fix createIndexTomorrow
  * 0.0.7
    * fix config.createIndexes switch
  * 0.0.6
    * add mapping support + default mappings
    * create index of tomorrow in advance (avoid bad mappings)
  * 0.0.5
    * fix logo syntax for npmjs
  * 0.0.4
    * Add logo
  * 0.0.3
    * fix missing timer for flush loop
  * 0.0.2
    * rename prefix indices mon to rockhopper
    * config move out of project to user
    * add example
  * 0.0.1 initial Alfa release
