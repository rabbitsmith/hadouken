var fs      = require("fs");
var session = require("bittorrent").session;

// File to write torrent info hashes to.
var file = "finished-torrents.json";

function torrentFinished(args) {
  var contents = [];

  if(fs.fileExists(file)) {
    contents = JSON.parse(fs.readText(file));
  }

  // Add our info hash to the array.
  contents.push(args.torrent.infoHash);

  // Write the results to the file.
  fs.writeText(file, JSON.stringify(contents));
}

exports.load = function() {
  session.on("torrent.finished" torrentFinished);
};
