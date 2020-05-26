"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 * 示例自定义插件，您可以查阅 http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/cmdExtensionPlugin/index.html
 * 了解如何开发一个自定义插件
 */
var CustomPlugin = (function () {
    function CustomPlugin() {
    }
    CustomPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function* () {
            return file;
        });
    };
    CustomPlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    };
    return CustomPlugin;
}());
exports.CustomPlugin = CustomPlugin;
