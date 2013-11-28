#!/usr/bin/env node
var db = require('nano')('http://localhost:49159/deploys'),
    cmdr = require('commander');

cmdr
  .version('0.0.0')
  .option('-c --container [id]', 'container id')
  .option('-p --port [port]', 'Open port on host machine')
  .option('-a --app [app]', 'App name')
  .option('-n --name [name]', 'Container name')
  .option('-h --hash [hash]', 'git md5 hash')
  .parse(process.argv);

if (!cmdr.container && !cmdr.port && !cmdr.app && !cmdr.name) {
  console.log("Error recording deployment! Routing will be affected.");
} else {
  var deploy = {
    containerId : cmdr.container,
    port : cmdr.port,
    app : cmdr.app,
    name : cmdr.name,
    hash : cmdr.hash
  };
  db.insert(deploy, deploy.name, function(err, body) {
    if(err) {
      console.log("Deploy error. Routing may not work!");
    } else {
      console.log("Router updated.");
    }
  });
}
