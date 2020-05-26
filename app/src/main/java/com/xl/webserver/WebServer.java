package com.xl.webserver;
import android.content.Context;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WebServer
{
	/**
	 * 使用线程池，减少频繁创建线程的消耗。
	 * 线程池
	 */
	private ExecutorService mExecutorService = null;
	private ServerSocket mServerSocket;
	private int mPort = 0;
	private boolean mIsAlive = true;
	private Context context;
	
	public void startServer(Context context, int port)
	{
		this.context = context;
		mIsAlive = true;
		mPort = port;
		/**
		 * 创建缓存类型的线程池
		 */
		mExecutorService = Executors.newCachedThreadPool();
		mExecutorService.execute(new AcceptRunnable());
	}
	
	/**
	 * 服务器是否还活着
	 * @return
	 */
	public boolean isAlive()
	{
		return mIsAlive;
	}

	/**
	 * 等到所有的线程都处理完才关闭服务器
	 */
	public void shutdown()
	{
		try {
			if(mServerSocket!=null)
			mServerSocket.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		mIsAlive = false;
		if(mExecutorService!=null)
			mExecutorService.shutdown();
	}
	
	/**
	 * 立即关闭服务器，不会等到所有的线程都处理完。
	 * 
	 */
	public void shutdownNow()
	{
		try {
			if(mServerSocket!=null)
			mServerSocket.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		mIsAlive = false;
		if(mExecutorService!=null)
			mExecutorService.shutdownNow();
	}
	
	/**
	 * 用于执行接受客户端连接的线程
	 * 将接受客户端的操作也放入子线程中执行，这样就不会阻塞主线程。
	 */
	class AcceptRunnable implements Runnable
	{
		@Override
		public void run() {
			try
			{
				mServerSocket = new ServerSocket(mPort);
				System.out.println("Web Server startup on " + mPort);
				while (mIsAlive)
				{
					Socket socket = mServerSocket.accept();
					// 通过线程池的方式来处理客户的请求
					if(mIsAlive)
						mExecutorService.execute(new Processor(context, socket));
				}
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}
}

