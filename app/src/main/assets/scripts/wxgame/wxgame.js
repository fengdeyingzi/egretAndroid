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
var crypto = require('crypto');
var WxgamePlugin = (function () {
    function WxgamePlugin(useWxPlugin) {
        this.useWxPlugin = false;
        this.md5Obj = {};
        this.useWxPlugin = useWxPlugin;
    }
    WxgamePlugin.prototype.md5 = function (content) {
        var md5 = crypto.createHash('md5');
        return md5.update(content).digest('hex');
    };
    WxgamePlugin.prototype.onFile = function (file) {
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
                    this.md5Obj[path.basename(filename)] = this.md5(content);
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
                    this.md5Obj[path.basename(filename)] = this.md5(content);
                    file.contents = new Buffer(content);
                }
            }
            return file;
        });
    };
    WxgamePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function* () {
            var projectRoot = pluginContext.projectRoot, outputDir = pluginContext.outputDir, buildConfig = pluginContext.buildConfig;
            //同步 index.html 配置到 game.js
            var gameJSPath = path.join(outputDir, "game.js");
            if (!fs.existsSync(gameJSPath)) {
                console.log(gameJSPath + "\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4F7F\u7528 Launcher \u53D1\u5E03\u5FAE\u4FE1\u5C0F\u6E38\u620F");
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
            if (buildConfig.command !== "publish" && gameJSONContent.plugins && gameJSONContent.plugins['egret-library']) {
                delete gameJSONContent.plugins["egret-library"];
            }
            this.writeData(gameJSONContent, gameJSONPath);
            //下面的流程是配置开启微信插件的功能
            var engineVersion = this.readData(path.join(projectRoot, "egretProperties.json")).engineVersion;
            if (!gameJSONContent.plugins) {
                gameJSONContent.plugins = {};
            }
            if (buildConfig.command == "publish" && this.useWxPlugin) {
                gameJSONContent.plugins["egret-library"] = {
                    "provider": "wx7e2186943221985d",
                    "version": engineVersion,
                    "path": "egret-library"
                };
            }
            else {
                gameJSONContent.plugins = {};
            }
            this.writeData(gameJSONContent, gameJSONPath);
            if (buildConfig.command !== "publish" || !this.useWxPlugin) {
                return;
            }
            var libDir = path.join(outputDir, "egret-library");
            fs.mkdirSync(libDir);
            var pluginData = { "main": "index.js" };
            this.writeData(pluginData, path.join(libDir, "plugin.json"));
            var engineJS = ['assetsmanager', 'dragonBones', 'egret', 'game', 'eui', 'socket', 'tween'];
            var signatureData = {
                "provider": "wx7e2186943221985d",
                "signature": []
            };
            for (var i in engineJS) {
                var name_1 = engineJS[i] + '.min.js';
                if (this.md5Obj[name_1]) {
                    var jsInfo = {
                        "path": name_1,
                        "md5": this.md5Obj[name_1]
                    };
                    signatureData.signature.push(jsInfo);
                }
            }
            this.writeData(signatureData, path.join(libDir, "signature.json"));
            fs.writeFileSync(path.join(libDir, "index.js"), null);
        });
    };
    WxgamePlugin.prototype.readData = function (filePath) {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    };
    WxgamePlugin.prototype.writeData = function (data, filePath) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
    };
    return WxgamePlugin;
}());
exports.WxgamePlugin = WxgamePlugin;
