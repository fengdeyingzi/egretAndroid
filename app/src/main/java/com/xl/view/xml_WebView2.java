package com.xl.view;

import android.content.Context;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.net.Uri;
import android.util.Log;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.xl.game.tool.DisplayUtil;


/*
专门为手机C定制的activity
可以检测系统版本 cpu类型 获取当前app包名 显示toast
 */
public class xml_WebView2 extends WebView {
    public static String TAG = "WebView";
    int progress;
    Paint paint_rect;
    Paint paint_back;
    Context context;


    public void setProgress(int pos) {
        this.progress = pos;
    }


    void initView() {
        String ua = this.getSettings().getUserAgentString();
        this.getSettings().setUserAgentString(ua + "; XLWebView/1.0");
        //设置WebView属性，能够执行Javascript脚本
        getSettings().setJavaScriptEnabled(true);


        getSettings().setDomStorageEnabled(true);
        //evaluateJavascript();
        getSettings().setDomStorageEnabled(true);
        // 打开本地缓存提供JS调用,至关重要
        getSettings().setAppCacheMaxSize(1024 * 1024 * 8);// 实现8倍缓存
        getSettings().setAllowFileAccess(true);
        getSettings().setAppCacheEnabled(true);
        String appCachePath = getContext().getCacheDir().getAbsolutePath();
        getSettings().setAppCachePath(appCachePath);
        getSettings().setDatabaseEnabled(true);

        paint_rect = new Paint();
        paint_rect.setColor(0xff75c0f0);

        paint_back = new Paint();
        paint_back.setColor(0x90202020);

        getSettings().setJavaScriptEnabled(true);
        setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {

                view.loadUrl(url);
                android.util.Log.e(TAG, "new url " + url);
                return true;
            }

            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(android.webkit.WebView view, java.lang.String url) {
                if (url.startsWith("http") || url.startsWith("https")) {
                    //loadUrl(url);
                } else if (url.startsWith("file")) {
                    //loadUrl(url);
                } else {
                    //Intent in = new Intent(Intent.ACTION_VIEW,Uri.parse(url));
                    //context.startActivity(in);
                }
                return null;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                xml_WebView2.this.progress = 100;
					/*
					if(!view.getSettings().getLoadsImagesAutomatically()){
						view.getSettings().setLoadsImagesAutomatically(true);

						if(Build.VERSION.SDK_INT>=15)
						view.setLayerType(View.LAYER_TYPE_NONE, null);//如果渲染后有视频播发 就得把加速器关闭了


					  }
					*/
            }
        });

        setWebChromeClient(
                new WebChromeClient() {
                    public void onProgressChanged(WebView view, int progress) {
                        //Activity和Webview根据加载程度决定进度条的进度大小
                        //当加载到100%的时候 进度条自动消失
                        //ApiActivity.this.setProgress(progress);
                        //progressBar.setVisibility(view.VISIBLE);
                        //progressBar.setProgress(progress);
                        //progressBar.postInvalidate();
                        xml_WebView2.this.progress = progress;
                        //invalidate();
                        //if(progress==100)
                        //	progressBar.setVisibility(View.GONE);
                        //Toast.makeText(context,""+progress,0).show();
                    }

                });


        //网页加载完成后再加载图片
		/*
		if(Build.VERSION.SDK_INT >= 19) {
			getSettings().setLoadsImagesAutomatically(true);
    } else {
			getSettings().setLoadsImagesAutomatically(false);
    }
	*/
        //提高渲染优先级
        getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);
        //硬件加速
		/*
		if (Build.VERSION.SDK_INT >= 19)
			{
				//硬件加速器的使用
			setLayerType(View.LAYER_TYPE_HARDWARE, null);
		  }
			else if(Build.VERSION.SDK_INT>=15)
			{
			setLayerType(View.LAYER_TYPE_SOFTWARE, null);
		  }
		*/
        progress = 100;
initEx();
    }
    //
    public void initEx(){
        this.addJavascriptInterface(new app(getContext()),"app");
    }

    public xml_WebView2(android.content.Context context, android.util.AttributeSet attrs) {
        super(context, attrs);
        this.context = context;
        initView();
    }

    public xml_WebView2(Context context) {
        super(context);
        this.context = context;
        initView();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // TODO: Implement this method
        super.onDraw(canvas);
        int size = DisplayUtil.dip2px(context, 6f);
        if (progress < 100) {
            canvas.drawRect(getScrollX(), getScrollY(), getScrollX() + getWidth(), getScrollY() + size, paint_back);
            canvas.drawRect(getScrollX(), getScrollY(), getScrollX() + getWidth() * progress / 100, getScrollY() + size, paint_rect);
        }
        //Log.e(TAG,""+progress);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        // TODO: Implement this method
/*
				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
					setLayerType(View.LAYER_TYPE_SOFTWARE, null);
				}
				*/
        super.onLayout(changed, l, t, r, b);

    }


    @Override
    public void loadUrl(String url) {
        if (url.startsWith("http://pan.baidu.com") || url.startsWith("https://pan.baidu.com")) {
            goBrowser(url);
        } else if (url.startsWith("http://") || url.startsWith("https://")) {
            progress = 0;
            super.loadUrl(url);
        }
        else if(url.startsWith("javascript://")){
            super.loadUrl(url);
        }
        else {
            Intent in = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            try {
                context.startActivity(in);
            } catch (Exception e) {
                Log.e(TAG, "loadUrl error:" + url);
            }
        }


    }


    //调用浏览器打开
    public void goBrowser(String url) {
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        intent.setData(Uri.parse(url));
        try {
            getContext().startActivity(intent);


        } catch (Exception var6_4) {
            Toast.makeText(getContext(), "请下载网页浏览器", Toast.LENGTH_SHORT).show();

        }
    }

}
