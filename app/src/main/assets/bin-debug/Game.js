var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        // var spr_hero:egret.Sprite;
        _this.list_background = new Array();
        _this.list_board = new Array();
        _this.hero = new HeroSprite();
        //提示文字
        _this.infoText = new egret.TextField();
        //游戏状态 -1 未运行 0 未开始 1 已开始 2 暂停 3 结束
        _this.gameState = -1;
        _this.logoSprite = new LogoSprite();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Game.prototype.onTouchDown = function (event) {
        console.log("onTouchDown : " + event.stageX + " " + event.stageY);
    };
    Game.prototype.onTouchMove = function (event) {
        console.log("onTouchMove:" + event.stageX + " " + event.stageY);
    };
    Game.prototype.onTouchUp = function (event) {
        console.log("onTouchUp" + event.stageX + " " + event.stageY);
        if (this.gameState == 0) {
            if (this.getChildByName("info_text") != null) {
                this.removeChild(this.infoText);
            }
            this.setGameState(1);
            //将方块脱离
            this.hero.detach(true);
        }
        if (this.gameState == 3) {
            this.setGameState(0);
        }
        if (this.gameState == 1) {
            //将方块脱离
            for (var i = 0; i < this.list_board.length; i++) {
                if (this.list_board[i].getSprite() != null) {
                    this.hero.detach(true);
                    this.list_board[i].removeSprite(this.hero);
                    this.list_board[i].setSleep(true);
                    console.log("方块脱离", this.list_board[i].y);
                }
            }
        }
        console.log("当前游戏状态：" + this.gameState);
    };
    Game.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("game1", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.onAddToStage = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchDown, this);
                        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
                        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
                        this.stage.orientation = egret.OrientationMode.AUTO;
                        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.addImage, this);
                        return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        // await RES.loadConfig("resource/default.res.json","resource/");
                        // console.log("开始加载资源组");
                        // await RES.loadGroup("game1");
                        egret.lifecycle.addLifecycleListener(function (context) {
                            context.onUpdate = function () {
                                // console.log("onUpdate");
                                _this.logoSprite.logoc(_this.stage);
                                if (_this.list_background != null && _this.gameState != -1) {
                                    if (_this.list_background[0].y == _this.list_background[1].y) {
                                        _this.list_background[1].y += _this.stage.stageHeight;
                                    }
                                    for (var i = 0; i < _this.list_background.length; i++) {
                                        // console.log(""+i + " "+this.list_background[i].y);
                                        _this.list_background[i].y += 1;
                                        if (_this.list_background[i].y > _this.stage.stageHeight) {
                                            for (var j = 0; j < _this.list_background.length; j++) {
                                                _this.list_background[j].y -= _this.stage.stageHeight;
                                            }
                                        }
                                    }
                                    _this.hero.logoc();
                                    for (var n = 0; n < _this.list_board.length; n++) {
                                        _this.list_board[n].logoc(_this.stage);
                                    }
                                    //判断死亡
                                    if (_this.hero.y < 0 && _this.gameState != 3) {
                                        _this.setGameState(3);
                                    }
                                    //判断板子是否接住方块
                                    for (var nn = 0; nn < _this.list_board.length; nn++) {
                                        if (!_this.list_board[nn].isSleep() && _this.list_board[nn].getSprite() == null) {
                                            if (_this.list_board[nn].hitTestPoint(_this.hero.getCenterX(), _this.hero.getCenterY())) {
                                                _this.list_board[nn].addSprite(_this.hero);
                                                _this.hero.detach(false);
                                                console.log("接住方块");
                                            }
                                        }
                                    }
                                    _this.cameraRun();
                                }
                            };
                        });
                        egret.lifecycle.onPause = function () {
                            console.log("onPause");
                        };
                        egret.lifecycle.onResume = function () {
                            console.log("onResume");
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    //设置游戏状态
    Game.prototype.setGameState = function (state) {
        this.gameState = state;
        console.log("切换游戏状态：" + state);
        if (this.gameState == 0) {
            this.infoText.text = "测试\n点击屏幕\n将方块投进目标位置";
            if (this.getChildByName("info_text") == null) {
                this.addChild(this.infoText);
            }
            for (var i = 0; i < this.list_board.length; i++) {
                this.list_board[i].init();
                this.list_board[i].x = (this.stage.stageWidth - this.list_board[i].width) / 2;
                this.list_board[i].y = i * 400 + 480;
                console.log("初始化方块：", i * 400 + 480);
                if (i == 1) {
                    this.hero.detach(false);
                    this.list_board[i].addSprite(this.hero);
                }
            }
        }
        if (this.gameState == 1) {
            if (this.getChildByName("info_text") != null) {
                this.removeChild(this.infoText);
            }
        }
        if (this.gameState == 3) {
            if (this.getChildByName("info_text") == null) {
                this.addChild(this.infoText);
            }
            this.infoText.text = "游戏结束\n点击屏幕重新开始";
        }
    };
    //刷新板子
    Game.prototype.refBoard = function () {
        console.log("刷新板子");
        for (var i = 0; i < this.list_board.length; i++) {
            if (this.list_board[i].isSleep()) {
                this.list_board[i].setSleep(false);
                this.list_board[i].x = this.hero.x;
                this.list_board[i].y -= 400 * 2;
                this.list_board[i].setRunType(this.getRandomNumInt(0, 3));
            }
        }
    };
    Game.prototype.getRandomNumInt = function (min, max) {
        var Range = max - min;
        var Rand = Math.random(); //获取[0-1）的随机数
        return (min + Math.round(Rand * Range)); //放大取整
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Game.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Game.prototype.addImage = function () {
        var _this = this;
        console.log("addImage");
        // alert("舞台宽高："+this.stage.stageWidth);
        var background1 = this.createBitmapByName("background1");
        background1.width = this.stage.stageWidth;
        background1.height = this.stage.stageHeight;
        this.addChild(background1);
        var background2 = this.createBitmapByName("background1");
        background2.x = 0;
        background2.y = this.stage.stageHeight;
        background2.width = this.stage.stageWidth;
        background2.height = this.stage.stageHeight;
        this.addChild(background2);
        this.list_background.push(background1);
        this.list_background.push(background2);
        background1.y = 0;
        background2.y = this.stage.stageHeight;
        // let icon = this.createBitmapByName("egret_icon_png");
        // this.addChild(icon);
        // icon.x = 26;
        // icon.y = 33;
        // background.graphics.beginFill(0xffffff);
        // background.graphics.endFill();
        //添加一个board
        var board1 = new BoardSprite();
        board1.init();
        var board2 = new BoardSprite();
        board2.init();
        var board3 = new BoardSprite();
        this.list_board.push(board1);
        this.list_board.push(board2);
        this.list_board.push(board3);
        this.addChild(board1);
        this.addChild(board2);
        this.addChild(board3);
        //添加主角
        var hero = new HeroSprite();
        hero.init();
        this.hero = hero;
        this.addChild(this.hero);
        //初始化坐标
        board1.x = (this.stage.stageWidth - board1.width) / 2;
        board2.x = (this.stage.stageWidth - board2.width) / 2;
        board3.x = (this.stage.stageWidth - board3.width) / 2;
        hero.x = (this.stage.stageWidth - hero.width) / 2;
        hero.y = this.stage.stageHeight * 4 / 5;
        // board2.y = hero.y;
        board2.addSprite(hero);
        board1.y = hero.y - 400;
        board3.y = hero.y + 400;
        board1.setRunType(0);
        board2.setRunType(0);
        board3.setRunType(0);
        board1.setSleep(false);
        board2.setSleep(false);
        board3.setSleep(false);
        this.infoText.x = 0;
        this.infoText.width = this.stage.stageWidth;
        this.infoText.height = 280;
        this.infoText.y = this.stage.stageHeight / 2;
        this.infoText.textAlign = egret.HorizontalAlign.CENTER;
        this.infoText.text = "点击屏幕\n将方块投进目标位置";
        this.infoText.textColor = 0xffffff;
        this.infoText.name = "info_text";
        this.addChild(this.infoText);
        this.setGameState(0);
        this.logoSprite = new LogoSprite();
        this.logoSprite.init(this.stage);
        this.addChild(this.logoSprite);
        this.logoSprite.setOnClose(function () {
            _this.onLogoClose();
        });
    };
    Game.prototype.onLogoClose = function () {
        this.removeChild(this.logoSprite);
    };
    //模拟相机移动
    Game.prototype.cameraRun = function () {
        var v = 6;
        var isOut = false; //是否超出屏幕
        for (var k = 0; k < this.list_board.length; k++) {
            if (this.list_board[k].y < 80) {
                isOut = true;
                break;
            }
        }
        if (this.hero.y < 800)
            isOut = true;
        if (!this.hero.isDetach() && isOut) {
            this.hero.y += v;
            for (var i = 0; i < this.list_board.length; i++) {
                this.list_board[i].y += v;
                if (this.list_board[i].y > this.stage.stageHeight) {
                    //刷新板子
                    this.refBoard();
                }
            }
        }
    };
    return Game;
}(egret.DisplayObjectContainer));
