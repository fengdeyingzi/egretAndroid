package net.yzjlb.egret;

import android.app.Activity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.xl.view.xml_WebView2;
import com.xl.webserver.Processor;
import com.xl.webserver.WebServer;

import java.io.File;

public class MainActivity extends Activity {
xml_WebView2 webView;
    WebServer server = new WebServer();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.webview);
        startGameService();
    }

    //启动服务
    void startGameService(){
        //开启HTTP服务
        Processor.WEB_ROOT = "";
        server.startServer(this, 3002);
        webView.loadUrl("http://localhost:3002/index.html");
    }
}
