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
var LogoSprite = /** @class */ (function (_super) {
    __extends(LogoSprite, _super);
    function LogoSprite() {
        var _this = _super.call(this) || this;
        _this.isClose = false;
        _this.alpha = 1;
        return _this;
    }
    LogoSprite.prototype.init = function (stage) {
        var bg = new egret.Shape();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(0, 0, stage.stageWidth, stage.$stageHeight);
        bg.graphics.endFill();
        this.logo = new egret.Bitmap();
        this.logo.texture = RES.getRes("logo");
        this.logo.x = (stage.stageWidth - this.logo.width) / 2;
        this.logo.y = (stage.$stageHeight - this.logo.height) / 2;
        this.addChild(bg);
        this.addChild(this.logo);
        this.alpha = 1;
        this.logo.alpha = 0;
    };
    LogoSprite.prototype.logoc = function (stage) {
        console.log("logo run");
        if (!this.isClose) {
            var a = this.logo.alpha;
            a += 0.005;
            if (a > 1)
                a = 1;
            if (a < 0)
                a = 0;
            this.logo.alpha = a;
            if (this.logo.alpha >= 1) {
                this.onClose();
                this.isClose = true;
            }
        }
    };
    LogoSprite.prototype.setOnClose = function (onClose) {
        this.onClose = onClose;
    };
    return LogoSprite;
}(egret.Sprite));
