/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>
"use strict";
var built_in_1 = require('built-in');
var vivogame_1 = require('./vivogame/vivogame');
var defaultConfig = require('./config');
var config = {
    buildConfig: function (params) {
        var target = params.target, command = params.command, projectName = params.projectName, version = params.version;
        var outputDir = "../" + projectName + "_vivogame/src";
        if (command == 'build') {
            return {
                outputDir: outputDir,
                commands: [
                    new built_in_1.CleanPlugin({ matchers: ["../engine/js", "resource"] }),
                    new built_in_1.CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new built_in_1.ExmlPlugin('commonjs'),
                    new vivogame_1.VivogamePlugin(),
                    new built_in_1.ManifestPlugin({ output: 'manifest.js', info: { target: 'vivogame' } })
                ]
            };
        }
        else if (command == 'publish') {
            return {
                outputDir: outputDir,
                commands: [
                    new built_in_1.CleanPlugin({ matchers: ["../engine/js", "resource"] }),
                    new built_in_1.CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new built_in_1.ExmlPlugin('commonjs'),
                    new vivogame_1.VivogamePlugin(),
                    new built_in_1.UglifyPlugin([
                        // 使用 EUI 项目，要压缩皮肤文件，可以开启这个压缩配置
                        // {
                        //     sources: ["resource/default.thm.js"],
                        //     target: "default.thm.min.js"
                        // },
                        {
                            sources: ["main.js"],
                            target: "main.min.js"
                        }
                    ]),
                    new built_in_1.ManifestPlugin({ output: 'manifest.js', info: { target: 'vivogame' } })
                ]
            };
        }
        else {
            throw "unknown command : " + params.command;
        }
    },
    mergeSelector: defaultConfig.mergeSelector,
    typeSelector: defaultConfig.typeSelector
};
module.exports = config;
