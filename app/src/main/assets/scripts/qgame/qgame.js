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
var MiqgamePlugin = (function () {
    function MiqgamePlugin() {
    }
    MiqgamePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file.extname == '.js') {
                var filename = file.origin;
                if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                    return null;
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
                        if (filename == "libs/modules/eui/eui.js") {
                            content = content.replace("function getRepeatedIds", "window.getRepeatedIds=function getRepeatedIds");
                            content = content.replace("function getIds", "window.getIds=function getIds");
                            content = content.replace("function toXMLString", "window.toXMLString=function toXMLString");
                            content = content.replace("function checkDeclarations", "window.checkDeclarations=function checkDeclarations");
                            content = content.replace("function getPropertyStr", "window.getPropertyStr=function getPropertyStr");
                        }
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
    MiqgamePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function* () {
            //同步 index.html 配置到 game.js
            var gameJSPath = path.join(pluginContext.outputDir, "main.js");
            if (!fs.existsSync(gameJSPath)) {
                console.log(gameJSPath + "\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4F7F\u7528 Launcher \u53D1\u5E03\u5C0F\u7C73\u5FEB\u6E38\u620F");
                return;
            }
            var gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
            var projectConfig = pluginContext.buildConfig.projectConfig;
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
            var gameJSONPath = path.join(pluginContext.outputDir, "manifest.json");
            var gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
            gameJSONContent.orientation = orientation;
            fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
        });
    };
    return MiqgamePlugin;
}());
exports.MiqgamePlugin = MiqgamePlugin;
