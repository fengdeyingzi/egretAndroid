package com.xl.view;

import android.content.Context;
import android.os.Build;
import android.webkit.JavascriptInterface;

import com.xl.game.tool.AppTool;

/**
 * suthor:风的影子
 * <p>
 * date:2019/11/20
 * desc:
 * version:1.0
 **/
public class app {
    Context context;
    public app(Context context){
        this.context = context;
    }
    @JavascriptInterface
    public int getVersionCode(){
        return AppTool.getVersionCode(context);
    }

    @JavascriptInterface
    public String getVersionName(){
        return AppTool.getVersionName(context);
    }

    @JavascriptInterface
    public String getCpuAbi(){
        return android.os.Build.CPU_ABI;
    }



    @JavascriptInterface
    public String getModel(){
        return Build.MODEL;
    }

    @JavascriptInterface
    public int getAndroidVersion(){
        return Build.VERSION.SDK_INT;
    }


}
