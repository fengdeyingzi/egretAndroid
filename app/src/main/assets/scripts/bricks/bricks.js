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
var BricksPlugin = (function () {
    function BricksPlugin() {
    }
    BricksPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function* () {
            var filename = file.basename;
            if (filename == 'manifest.json') {
                var contents = file.contents.toString();
                var jsonData = JSON.parse(contents);
                var content = '';
                content += "BK.Script.loadlib(\"GameRes://js/promise.js\");\n";
                for (var _i = 0, _a = jsonData.initial; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item != 'js/promise.js' && item != 'js/promise.min.js') {
                        content += "BK.Script.loadlib(\"GameRes://" + item + "\");\n";
                    }
                }
                for (var _b = 0, _c = jsonData.game; _b < _c.length; _b++) {
                    var item = _c[_b];
                    content += "BK.Script.loadlib(\"GameRes://" + item + "\");\n";
                }
                content += "BK.Script.loadlib(\"GameRes://egret.bricks.js\");\n";
                file.path = file.dirname + '/manifest.js';
                file.contents = new Buffer(content);
            }
            else if (filename == 'main.js') {
                var content = file.contents.toString();
                var result = content.replace(/RES\.loadConfig\("resource\/default\.res\.json", "resource\/"\)/gm, 'RES.loadConfig("GameRes://resource/default.res.json", "GameRes://resource/")');
                result = result.replace(/eui\.Theme\("resource\/default\.thm\.json", _this\.stage\)/gm, 'eui.Theme("GameRes://resource/default.thm.json", _this.stage)');
                result += ";global.Main = Main;";
                file.path = file.dirname + '/main.js';
                file.contents = new Buffer(result);
            }
            else if (filename == 'promise.js') {
                return null;
            }
            return file;
        });
    };
    BricksPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function* () {
            //同步index.html 配置到main.js
            var mainJSPath = path.join(pluginContext.outputDir, 'main.js');
            var mainJSContent = fs.readFileSync(mainJSPath, { encoding: "utf8" });
            var projectConfig = pluginContext.buildConfig.projectConfig;
            mainJSContent = mainJSContent.replace(/frameRate: 30/gm, "frameRate: " + projectConfig.frameRate);
            mainJSContent = mainJSContent.replace(/contentWidth: 640/gm, "contentWidth: " + projectConfig.contentWidth);
            mainJSContent = mainJSContent.replace(/contentHeight: 1136/gm, "contentHeight: " + projectConfig.contentHeight);
            mainJSContent = mainJSContent.replace(/entryClassName: "Main"/gm, "entryClassName: " + projectConfig.entryClassName);
            mainJSContent = mainJSContent.replace(/scaleMode: "showAll"/gm, "scaleMode: " + projectConfig.scaleMode);
            mainJSContent = mainJSContent.replace(/orientation: "auto"/gm, "orientation: " + projectConfig.orientation);
            fs.writeFileSync(mainJSPath, mainJSContent);
        });
    };
    return BricksPlugin;
}());
exports.BricksPlugin = BricksPlugin;
