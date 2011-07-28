#! /usr/bin/env node

// See https://github.com/drudge/node-gpg

var http = require('http');
var sys = require('sys');
var formidable = require('/home/manu/.node_libraries/formidable');
var gpg = require('/home/manu/.node_libraries/gpg');

// Send a log message to be included in CouchDB's
// log files.
var log = function(mesg) {
  console.log(JSON.stringify(["log", mesg]));
}

/*
var proxy = http.createClient(80, request.headers['host']);
var proxy_request = proxy.request(request.method, request.url, request.headers);
proxy_request.addListener('response', function (proxy_response) {
  proxy_response.addListener('data', function(chunk) {
    response.write(chunk, 'binary');
  });
  proxy_response.addListener('end', function() {
    response.end();
  });
  response.writeHead(proxy_response.statusCode, proxy_response.headers);
});
*/

function send_content(decrypted_content) {
  log("Decrypted content: "+decrypted_content);
}

var server = http.createServer(function (req, resp) {
  log(req.method + " " + req.url);
  //log(sys.inspect(req));

  // curl -F _attachments=@../extras/firstbill.gpg http://localhost:5984/_node
  if (req.method == 'POST') {
    new formidable.IncomingForm().parse(req, function(err, fields, files) {
      gpg.decryptFile(files._attachments.path, function(err, contents) {
        send_content(contents);
      });
    });
  } else {
    // This is for direct PUT curl upload
    // curl -X PUT -H "Content-Type: application/pgp-encrypted" -T ../extras/firstbill.gpg http://localhost:5984/_node
    var buffer;
    req.on('data', function(chunk) {
      if (buffer == null) {
        buffer = chunk;
      } else {
        buffer += chunk;
      }
    });
    req.on('end', function () {
      gpg.decrypt(buffer, function(err, contents) {
        send_content(contents);
      });
    });
  }

  resp.writeHead(200, {'Content-Type': 'text/plain'});
  resp.end('Hello World\n');
})

// We use stdin in a couple ways. First, we
// listen for data that will be the requested
// port information. We also listen for it
// to close which indicates that CouchDB has
// exited and that means its time for us to
// exit as well.
var stdin = process.openStdin();

stdin.on('data', function(d) {
  server.listen(parseInt(JSON.parse(d)));
});

stdin.on('end', function () {
  process.exit(0);
});

// Send the request for the port to listen on.
console.log(JSON.stringify(["get", "couch_node", "port"]));
