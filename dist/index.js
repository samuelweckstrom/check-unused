#!/usr/bin/env node
"use strict";
'use-strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var childProcess = require('child_process');
var path = require('path');
var CONSOLE_FORMAT = {
    BLUE: '\x1b[34m',
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    BOLD: '\x1b[1m'
};
function getDependencies(path) {
    return __awaiter(this, void 0, void 0, function () {
        var dependencies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.readFile(path, function (err, data) {
                            if (err) {
                                reject(new Error('Could not find package.json in current folder!'));
                                return;
                            }
                            var parsed = JSON.parse(data);
                            dependencies = parsed.dependencies && Object.keys(parsed.dependencies);
                            if (!dependencies) {
                                reject(new Error('No dependencies defined in package.json!'));
                                return;
                            }
                            resolve();
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, dependencies];
            }
        });
    });
}
function checkUnusedDependency(dependencies, pathArg) {
    if (pathArg === void 0) { pathArg = '.'; }
    return __awaiter(this, void 0, void 0, function () {
        var unused;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dependencies || !dependencies.length)
                        return [2 /*return*/];
                    unused = [];
                    return [4 /*yield*/, Promise.all(dependencies.map(function (dependency) { return __awaiter(_this, void 0, void 0, function () {
                            var command;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        command = "grep '(loader|require|from).*" + dependency + "' -R  -E --exclude-dir='node_modules' " + pathArg;
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                childProcess.exec(command, function (err, stdout, stderr) {
                                                    if (stderr.length) {
                                                        reject(new Error(stderr));
                                                        return;
                                                    }
                                                    if (err) {
                                                        unused.push(dependency);
                                                        resolve();
                                                        return;
                                                    }
                                                    if (stdout) {
                                                        resolve();
                                                    }
                                                });
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, unused];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var jsonPath, pathArg, unusedDependencies, dependencies, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jsonPath = path.resolve(__dirname, '..', 'package.json');
                    pathArg = process.argv[2];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    unusedDependencies = [];
                    return [4 /*yield*/, getDependencies(jsonPath)];
                case 2:
                    dependencies = _a.sent();
                    if (!dependencies.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkUnusedDependency(dependencies, pathArg)];
                case 3:
                    unusedDependencies = _a.sent();
                    _a.label = 4;
                case 4:
                    if (unusedDependencies && unusedDependencies.length) {
                        unusedDependencies.forEach(function (item) {
                            return console.log("" + CONSOLE_FORMAT.BOLD + CONSOLE_FORMAT.BLUE, 'Unused dependency: \t', "" + CONSOLE_FORMAT.RED, item);
                        });
                        return [2 /*return*/];
                    }
                    console.log("" + CONSOLE_FORMAT.BOLD + CONSOLE_FORMAT.GREEN, 'No unused dependencies!');
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log("" + CONSOLE_FORMAT.BOLD + CONSOLE_FORMAT.RED, error_1.message);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
module.exports = run();
//# sourceMappingURL=index.js.map