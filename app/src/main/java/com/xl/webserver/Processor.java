package com.xl.webserver;

import android.content.Context;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.Socket;

import folk.china.http.HTTPRequestException;
import folk.china.http.HTTPRequestHeader;

/**
 * 处理一个HTTP用户请求的线程类。
 */
public class Processor implements Runnable {
    private PrintStream out;
    private InputStream input;
    private Context context;
    /**
     * 默认的服务器存放访问内容的目录D:\eclipse3.4\workspace03
     */
    public static String WEB_ROOT = "/mnt/sdcard/www/";

    public Processor(Context context,Socket socket) {
    	this.context = context;
        try {
            input = socket.getInputStream();
            out = new PrintStream(socket.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void run() {
        try {
			/*
			String fileName = parse(input);
			readFile(fileName);
			*/
            try {
                HTTPRequestHeader header = HTTPRequestHeader.parse(input);
                System.out.println(header.toString());
                readAssetsFile(header.mLocalUrl);
            } catch (HTTPRequestException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 解析客户机发过的所有HTTP请求，如果是符合HTTP协议内容的， 就分析出客户机所要访问文件的名字，并且返回文件名。
     */
    public String parse(InputStream input) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(input));
        String inputContent = in.readLine();
        if (inputContent == null || inputContent.length() == 0) {
            sendError(400, "Client invoke error");
            return null;
        }
// 分析客户请求的HTTP信息，分析出到底想访问哪个文件，
// 发过来的HTTP请求应该是三部分。
        String request[] = inputContent.split(" ");
        if (request.length != 3) {
            sendError(400, "Client invoke error");
            return null;
        }
// 第一部分是请求的方法
        String method = request[0];
// 第二部分是请求的文件名
        String fileName = request[1];
// 第三部分是HTTP版本号
        String httpVersion = request[2];
        System.out.println("Method: " + method + ", file name: " + fileName + ", HTTP version: " + httpVersion);
        return fileName;
    }

    /**
     * 处理调用一个文件的请求
     */
    public void readFile(String fileName) throws IOException {
        File file_root = new File(Processor.WEB_ROOT, fileName);
        String filename = null;
        String content_type = "text";
        int start = 0;
        if ((start = fileName.indexOf('?')) > 0) filename = fileName.substring(0, start);
        else filename = fileName;
        File file = new File(Processor.WEB_ROOT + filename);
        if (file.isDirectory()) {
            file = new File(Processor.WEB_ROOT + filename, "index.html");
        }
        if (!file.isFile()) {
            sendError(404, file.getPath() + " File Not Found");
            return;
        }


// 把文件的内容读取到in对象中。
        InputStream in = new FileInputStream(file);
        byte content[] = new byte[(int) file.length()];
        in.read(content);
        out.println("HTTP/1.0 200 sendFile");
        if (file.getName().endsWith(".html"))
            content_type = "text/html; charset=UTF-8";
        else if (file.getName().endsWith(".png"))
            content_type = "image/png";
        out.println("Content-Type: " + content_type);

        out.println("Content-length: " + content.length);
        out.println();
        out.write(content);
        out.flush();
        out.close();
        in.close();
    }

	public void readAssetsFile(String fileName) throws IOException {
		String filename = null;
		String content_type = "text";
		int start = 0;
		if ((start = fileName.indexOf('?')) > 0) filename = fileName.substring(0, start);
		else filename = fileName;
//		File file = new File(Processor.WEB_ROOT + filename);
//		if (file.isDirectory()) {
//			file = new File(Processor.WEB_ROOT + filename, "index.html");
//		}
//		if (!file.isFile()) {
//			sendError(404, file.getPath() + " File Not Found");
//			return;
//		}


// 把文件的内容读取到in对象中。
        if(filename.startsWith("/")){
            filename = filename.substring(1);
        }
		InputStream in = context.getAssets().open(Processor.WEB_ROOT + filename);
		byte content[] = new byte[in.available()];
		in.read(content);
		out.println("HTTP/1.0 200 sendFile");
		if (filename.endsWith(".html"))
			content_type = "text/html; charset=UTF-8";
		else if (filename.endsWith(".png"))
			content_type = "image/png";
		out.println("Content-Type: " + content_type);

		out.println("Content-length: " + content.length);
		out.println();
		out.write(content);
		out.flush();
		out.close();
		in.close();
	}

    /**
     * 发送错误的信息
     */
    public void sendError(int errNum, String errMsg) {
        out.println("HTTP/1.0 " + errNum + " " + errMsg);
        out.println("Content-type:text/html");
        out.println();
        out.println("<html>");
        out.println("<meta content=&#39;text/html; charset=gb2312&#39; http-equiv=&#39;Content-Type&#39;/>");
        out.println("<head><title>Error " + errNum + "--" + errMsg + "</title></head>");
        out.println("<h1>" + errNum + " " + errMsg + "</h1>");
        out.println("</html>");
        out.println();
        out.flush();
        out.close();
        System.out.println(errNum + ",,,," + errMsg);
    }
}
