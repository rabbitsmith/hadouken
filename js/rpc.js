var logger = require("logger").get("rpc");
var fs     = require("fs");

/*
Object hash containing all RPC methods.
*/
var methods = {};

(function() {
    function introspect() {
        return Object.keys(methods);
    }

    methods["core.introspect"] = introspect;
})();

(function() {
    var files = fs.getFiles("./rpc");

    for(var i = 0; i < files.length; i++) {
        var rpc = require(files[i]).rpc;

        if(rpc.name && rpc.method) {
            methods[rpc.name] = rpc.method;
        }
    }
})();

logger.info("Found " + Object.keys(methods).length + " RPC method(s).");

function handleRequest(request) {
    var method = methods[request.method];
    var response = {
        id: request.id,
        jsonrpc: "2.0"
    };

    if(method) {
        var fn = null;

        if(request.params instanceof Array) {
            fn = function() { return method.apply(method, request.params); };
        } else {
            fn = function() { return method(request.params); };
        }

        try {
            response.result = fn();
        } catch(e) {
            response.result = undefined;
            response.error = {
                code: -32000,
                message: "Internal server error",
                data: {
                    name: e.name,
                    message: e.message
                }
            };

            logger.error("Error when executing RPC method '" + request.method + "': " + e);
        }
    } else {
        response.error = {
            code: -32601,
            message: "Method not found",
            data: request.method
        };

        logger.error("Method '" + request.method + "' not found.");
    }

    return response;
}

exports.handler = handleRequest;
