var fs = require('fs');
var path = require('path');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

function createNpmDependenciesArray (packageFilePath) {
    var p = require(packageFilePath);
    if (!p.dependencies) return [];
    var deps = [];
    for (var mod in p.dependencies) {
        deps.push(mod + "@" + p.dependencies[mod]);
    }

    return deps;
}

function preloadPlugins() {
    var deps = [];
    var npm = require("npm");
    
    for (var i = 0; i < pluginFolders.length; i++) {
        try{
            require(pluginDirectory + pluginFolders[i]);
        } catch(e) {
            deps = deps.concat(createNpmDependenciesArray(pluginDirectory + pluginFolders[i] + "/package.json"));
        }
    }
    
    if(deps.length > 0) {
        npm.load({
            loaded: false
        }, function (err) {
            // catch errors

            npm.commands.install(deps, function (er, data) {
                if(er){
                    console.log(er);
                }
                console.log("Plugin preload complete");
                loadPlugins();
            });

            if (err) {
                console.log("preloadPlugins: " + err);
            }
        });
    } else {
        loadPlugins();
    }
}

function loadPlugins() {
    var dbot = require("./discordBot.js");
    for (var i = 0; i < pluginFolders.length; i++) {
        var plugin;
        var commandCount = 0;
        try {
            plugin = require(pluginDirectory + pluginFolders[i]);
        } catch (e) {
            console.log("Improper setup of the '" + pluginFolders[i] + "' plugin. : " + e);
        }

        if (plugin) {
            if ("commands" in plugin) {
                for (var j = 0; j < plugin.commands.length; j++) {
                    if (plugin.commands[j] in plugin) {
                        dbot.addCommand(plugin.commands[j], plugin[plugin.commands[j]])
                        commandCount++;
                    }
                }
            }
        }
        console.log("Loaded " + commandCount + " chat commands")
    }
}

var pluginFolders;
var pluginDirectory;
try {
    pluginDirectory = './plugins/';
    pluginFolders = getDirectories(pluginDirectory);
} catch (e) {
    console.log(e.stack);
}

exports.init = function () {
    preloadPlugins();
}