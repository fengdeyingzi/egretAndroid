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
var HeroSprite = /** @class */ (function (_super) {
    __extends(HeroSprite, _super);
    function HeroSprite() {
        var _this = _super.call(this) || this;
        _this._isDetach = false;
        return _this;
    }
    HeroSprite.prototype.init = function () {
        // var rect:egret.Shape = new egret.Shape();
        // rect.width = 60;
        // rect.height = 60;
        // rect.graphics.beginFill(0xffffff);
        // rect.graphics.drawRect(0,0, 60,60);
        // rect.graphics.endFill();
        var rect = new egret.Bitmap();
        rect.texture = RES.getRes("rect");
        this.addChild(rect);
    };
    //将主角脱离 true
    HeroSprite.prototype.detach = function (isDetach) {
        this._isDetach = isDetach;
    };
    HeroSprite.prototype.isDetach = function () {
        return this._isDetach;
    };
    //获取主角中心x
    HeroSprite.prototype.getCenterX = function () {
        return this.x + this.width / 2;
    };
    //获取主角中心y
    HeroSprite.prototype.getCenterY = function () {
        return this.y + this.height / 2;
    };
    //主角运动 只有在脱离板子时才进行运动
    HeroSprite.prototype.logoc = function () {
        if (this._isDetach) {
            this.y -= 16;
        }
    };
    return HeroSprite;
}(egret.Sprite));
