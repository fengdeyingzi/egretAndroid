"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var fs = require('fs');
var path = require('path');
var QQgamePlugin = (function () {
    function QQgamePlugin(useQQPlugin, pliginList) {
        this.useQQPlugin = false;
        this.pliginList = []; //qq engine plugin
        this.useQQPlugin = useQQPlugin;
        this.pliginList = pliginList;
    }
    QQgamePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file.extname == '.js') {
                var filename = file.origin;
                if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                    return null;
                }
                if (this.useQQPlugin) {
                    var basename = file.basename;
                    //QQ 小游戏引擎插件，支持下列官方库
                    var engineJS = ['assetsmanager', 'dragonBones', 'egret', 'game', 'eui', 'socket', 'tween'];
                    for (var i in engineJS) {
                        var jsName = engineJS[i];
                        if (basename == jsName + ".js" || basename == jsName + ".min.js") {
                            this.pliginList.push("requirePlugin(\"egret-library/" + jsName + ".min.js\")");
                            return null;
                        }
                    }
                }
                if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                    var content = file.contents.toString();
                    content += ";window.egret = egret;";
                    content = content.replace(/definition = __global/, "definition = window");
                    file.contents = new Buffer(content);
                }
                else {
                    var content = file.contents.toString();
                    if (filename == "libs/modules/res/res.js" ||
                        filename == 'libs/modules/res/res.min.js' ||
                        filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                        filename == 'libs/modules/assetsmanager/assetsmanager.js') {
                        content += ";window.RES = RES;";
                    }
                    if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                        content += ";window.eui = eui;";
                    }
                    if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                        content += ';window.dragonBones = dragonBones';
                    }
                    content = "var egret = window.egret;" + content;
                    if (filename == 'main.js') {
                        content += "\n;window.Main = Main;";
                    }
                    file.contents = new Buffer(content);
                }
            }
            return file;
        });
    };
    QQgamePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function* () {
            var projectRoot = pluginContext.projectRoot, outputDir = pluginContext.outputDir, buildConfig = pluginContext.buildConfig;
            //同步 index.html 配置到 game.js
            var gameJSPath = path.join(outputDir, "game.js");
            if (!fs.existsSync(gameJSPath)) {
                console.log(gameJSPath + "\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4F7F\u7528 Launcher \u53D1\u5E03QQ\u5C0F\u6E38\u620F");
                return;
            }
            var gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
            var projectConfig = buildConfig.projectConfig;
            var optionStr = ("entryClassName: " + projectConfig.entryClassName + ",\n\t\t") +
                ("orientation: " + projectConfig.orientation + ",\n\t\t") +
                ("frameRate: " + projectConfig.frameRate + ",\n\t\t") +
                ("scaleMode: " + projectConfig.scaleMode + ",\n\t\t") +
                ("contentWidth: " + projectConfig.contentWidth + ",\n\t\t") +
                ("contentHeight: " + projectConfig.contentHeight + ",\n\t\t") +
                ("showFPS: " + projectConfig.showFPS + ",\n\t\t") +
                ("fpsStyles: " + projectConfig.fpsStyles + ",\n\t\t") +
                ("showLog: " + projectConfig.showLog + ",\n\t\t") +
                ("maxTouches: " + projectConfig.maxTouches + ",");
            var reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
            var replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
            gameJSContent = gameJSContent.replace(reg, replaceStr);
            fs.writeFileSync(gameJSPath, gameJSContent);
            //修改横竖屏
            var orientation;
            if (projectConfig.orientation == '"landscape"') {
                orientation = "landscape";
            }
            else {
                orientation = "portrait";
            }
            var gameJSONPath = path.join(outputDir, "game.json");
            var gameJSONContent = this.readData(gameJSONPath);
            gameJSONContent.deviceOrientation = orientation;
            if (!gameJSONContent.plugins) {
                gameJSONContent.plugins = {};
            }
            if (!this.useQQPlugin) {
                delete gameJSONContent.plugins["egret-library"];
            }
            else {
                var engineVersion = this.readData(path.join(projectRoot, "egretProperties.json")).engineVersion;
                gameJSONContent.plugins["egret-library"] = {
                    "provider": "1110108620",
                    "version": engineVersion
                };
            }
            this.writeData(gameJSONContent, gameJSONPath);
        });
    };
    QQgamePlugin.prototype.readData = function (filePath) {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    };
    QQgamePlugin.prototype.writeData = function (data, filePath) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
    };
    return QQgamePlugin;
}());
exports.QQgamePlugin = QQgamePlugin;
