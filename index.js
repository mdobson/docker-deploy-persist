#!/usr/bin/env node
var cmdr = require('commander');

cmdr
  .version('0.0.0')
  .option('--host [host]', 'Couchdb host')
  .option('--dockerport [host]', 'Docker host')
  .option('--app [app]', 'Deployed app name')
  .option('-c --container [id]', 'container id')
  .parse(process.argv);

var db = require('nano')(cmdr.host);
var docker = require('docker.io')({ socketPath:false, host: 'http://localhost', port: cmdr.dockerport.toString()});

if(!cmdr.container) {
  console.log("Error recording deployment! Routing will be affected.");
} else {
  docker.containers.inspect( cmdr.container, function(err, res) {
    var name = res.Name;
    var portConfigs = Object.keys(res.NetworkSettings.Ports);
    var hostPort = res.NetworkSettings.Ports[portConfigs][0].HostPort;
    var deploy = {
      containerId : cmdr.container,
      port : hostPort,
      app : cmdr.app,
      name : name,
      hash : cmdr.hash
    };
    db.insert(deploy, deploy.name, function(err, body) {
      if(err) {
        console.log("Deploy error. Routing may not work!");
      } else {
        console.log("Router updated.");
      }
    });
  });
}
