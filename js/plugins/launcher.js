var config  = require("config");
var logger  = require("logger").get("plugins.launcher");
var process = require("process");
var session = require("bittorrent").session;

function getApplicationEvents() {
    var key    = "extensions.launcher.apps";
    var result = {};

    for(var i = 0; i < Number.MAX_VALUE; i++) {
        var query = key + "[" + i + "]";

        if(config.has(query)) {
            var eventName   = config.getString(query + "[0]");
            var application = config.getString(query + "[1]");

            if(!result[eventName]) {
                result[eventName] = [];
            }

            result[eventName].push(application);
        } else {
            break;
        }
    }

    return result;
}

function launch(apps, args) {
    if(!apps || apps.length === 0) {
        return;
    }

    for(var i = 0; i < apps.length; i++) {
        var app = apps[i];
        var options = {
            arguments: args
        };

        var exitCode = process.launch(app, options);

        if(exitCode != 0) {
            logger.error("Process '" + app + "' returned a non-zero exit code: " + exitCode);
        }
    }
}

function load() {
    var enabled = config.getBoolean("extensions.launcher.enabled");

    if(!enabled) {
        return;
    }

    var appEvents = getApplicationEvents();

    session.on("torrent.added", function(torrent) {
        var status = torrent.getStatus();
        var apps   = appEvents["torrent.added"];

        if(!apps) { return; }

        launch(apps, [ torrent.infoHash, status.name, status.savePath ]);
    });

    session.on("torrent.finished", function(torrent) {
        var status = torrent.getStatus();
        var apps   = appEvents["torrent.finished"];

        if(!apps) { return; }

        launch(apps, [ torrent.infoHash, status.name, status.savePath ]);
    });
}

exports.load = load;
