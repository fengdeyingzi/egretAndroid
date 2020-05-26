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
var BoardSprite = /** @class */ (function (_super) {
    __extends(BoardSprite, _super);
    function BoardSprite() {
        var _this = _super.call(this) || this;
        _this._isSleep = false;
        _this._UP = 0;
        _this._DOWN = 1;
        _this._LEFT = 2;
        _this._RIGHT = 3;
        _this.v = 3;
        return _this;
    }
    BoardSprite.prototype.init = function () {
        var board = new egret.Bitmap();
        board.texture = RES.getRes("board");
        this.addChild(board);
        this._direction = this._RIGHT;
        this.setRunType(0);
        this._sprite = null;
        this._isSleep = false;
    };
    //在板子上添加一个精灵
    BoardSprite.prototype.addSprite = function (sprite) {
        if (!this._isSleep) {
            this._sprite = sprite;
            sprite.x = this.x;
            sprite.y = this.y;
            this.setSleep(false);
        }
    };
    //移除一个精灵
    BoardSprite.prototype.removeSprite = function (sprite) {
        this._sprite = null;
    };
    //获取精灵
    BoardSprite.prototype.getSprite = function () {
        return this._sprite;
    };
    //设置板子是否休眠
    BoardSprite.prototype.setSleep = function (isSleep) {
        this._isSleep = isSleep;
    };
    //
    BoardSprite.prototype.isSleep = function () {
        return this._isSleep;
    };
    BoardSprite.prototype.getRandomNumInt = function (min, max) {
        var Range = max - min;
        var Rand = Math.random(); //获取[0-1）的随机数
        return (min + Math.round(Rand * Range)); //放大取整
    };
    //设置板子运动方式 0不运动 1只有在有精灵的情况下才运动 2只有在没精灵的情况下运动 3始终运动 
    BoardSprite.prototype.setRunType = function (runType) {
        this._run_type = runType;
        this.v = this.getRandomNumInt(3, 6);
    };
    //板子运动事件
    BoardSprite.prototype.logoc = function (stage) {
        switch (this._run_type) {
            case 1:
                // if(this._sprite!=null){
                //     this.run(stage);
                // }
                if (this._sprite == null) {
                    this.run(stage);
                }
                break;
            case 2:
                if (this._sprite == null) {
                    this.run(stage);
                }
                break;
            case 3: //没有精灵才运动
                if (this._sprite == null) {
                    this.run(stage);
                }
        }
    };
    BoardSprite.prototype.run = function (stage) {
        var sw = stage.stageWidth;
        var sh = stage.stageHeight;
        switch (this._direction) {
            case this._UP:
                this.y -= 3;
                if (this.getSprite() != null) {
                    this.getSprite().y -= 3;
                }
                if ((this.y <= 0))
                    this._direction = this._DOWN;
                break;
            case this._DOWN:
                this.y += 3;
                if (this.getSprite() != null) {
                    this.getSprite().y += 3;
                }
                if ((this.y + this.height) > sh)
                    this._direction = this._UP;
                break;
            case this._LEFT:
                this.x -= this.v;
                if (this.getSprite() != null) {
                    this.getSprite().x -= 3;
                }
                if (this.x <= 0)
                    this._direction = this._RIGHT;
                break;
            case this._RIGHT:
                this.x += this.v;
                if (this.getSprite() != null) {
                    this.getSprite().x += 3;
                }
                if ((this.x + this.width) > sw)
                    this._direction = this._LEFT;
        }
    };
    return BoardSprite;
}(egret.Sprite));
