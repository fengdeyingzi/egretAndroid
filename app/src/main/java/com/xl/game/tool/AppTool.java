package com.xl.game.tool;

import android.app.Activity;
import android.app.UiModeManager;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import java.io.File;
import java.util.List;

//import androidx.core.content.FileProvider;

public class AppTool
{
	private static final String[][] OPEN_Tab= new String[][]
			{
					{".apk","application/vnd.android.package-archive"},

					{".avi", "video/x-msvideo"},

					{".mrp",

							"application/mrp"},

					{".png",

							"image/png"},

					{".gif",

							"image/gif"},

					{".jpg",

							"image/jpeg"},
					{".bmp",

							"image/bmp"},

					{".html",

							"text/html"},

					{ ".mp3",

							"audio/x-mpeg"},

					{".wav",

							"audio/x-wav"},

					{".mid",

							"audio"},

					{ ".m4a",
							"audio/mp4a-latm"},

					{".amr",

							"audio"},

					{".mp4",

							"video/mp4"},

					{".zip",

							"application/x-zip-compressed"}

			};

	/**
	 　　* 获取版本号
	 　　* @return 当前应用的版本号　
	 　*/
	public static int getVersionCode(Context context)
	{
		try
		{
			PackageManager manager = context.getPackageManager();

			PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);

			String version = ""+info.versionCode;
			return  info.versionCode;
		}
		catch (PackageManager.NameNotFoundException e)
		{
			return 0;
		}

	}

	//获取版本名称
	public static String getVersionName(Context context)
	{
		try
		{
			PackageManager manager = context.getPackageManager();

			PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);

			String version = info.versionName;
			return  version;
		}
		catch (PackageManager.NameNotFoundException e)
		{
			return null;
		}

	}

	//获取应用包名
	public static String getPageName(Context context)
	{
		try
		{
			PackageManager manager = context.getPackageManager();

			PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);

			//String version = ""+info.packageName;
			return  info.packageName;
		}
		catch (PackageManager.NameNotFoundException e)
		{
			e.printStackTrace();
			return null;
		}
	}

	//跳转到指定应用
	public static boolean startApp(Context context, String packageName) {
//String packageName = "XXX";
		Intent intent = new Intent(Intent.ACTION_MAIN, null);
		intent.addCategory(Intent.CATEGORY_LAUNCHER);
		PackageManager pm = context.getPackageManager();
		List<ResolveInfo> listInfos = pm.queryIntentActivities(intent, 0);
		String className = null;
		for (ResolveInfo info : listInfos) {
			if (packageName.equals(info.activityInfo.packageName)) {
				className = info.activityInfo.name;
				break;
			}
		}
		if (className != null && className.length() > 0) {
			intent.setComponent(new ComponentName(packageName, className));
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
					| Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
			try
			{
				context.startActivity(intent);
			}
			catch(ActivityNotFoundException e)
			{
				e.printStackTrace();
			}
			return true;
		}
		return false;
	}



	private void openApp2(Context context, String packageName) {
		PackageManager packageManager = context.getPackageManager();
		Intent launchIntentForPackage = packageManager
				.getLaunchIntentForPackage(packageName);
		if (launchIntentForPackage != null)
			context.startActivity(launchIntentForPackage);
		else
			Toast.makeText(context, "手机未安装该应用", Toast.LENGTH_SHORT).show();

	}

	private boolean openApp(Context context, String packageName) {
		try {

			PackageManager pm = context.getPackageManager();
			PackageInfo pi=null;
			try
			{
				pi = pm.getPackageInfo(packageName, 0);
			}
			catch(PackageManager.NameNotFoundException e)
			{
				return false;
			}
			Intent resolveIntent = new Intent(Intent.ACTION_MAIN, null);
			resolveIntent.addCategory(Intent.CATEGORY_LAUNCHER);
			resolveIntent.setPackage(pi.packageName);

			List<ResolveInfo> apps = pm.queryIntentActivities(resolveIntent, 0);
			ResolveInfo ri = apps.iterator().next();
			if (ri != null) {
				String packageName1 = ri.activityInfo.packageName;
				String className = ri.activityInfo.name;
				Intent intent = new Intent(Intent.ACTION_MAIN);
				intent.addCategory(Intent.CATEGORY_LAUNCHER);
				ComponentName cn = new ComponentName(packageName1, className);
				intent.setComponent(cn);
				context.startActivity(intent);
			}
		} catch (ActivityNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return true;
	}



	//获取状态栏高度
	public static int getstatusBarHeight(Activity activity)
	{
		// 获取状态栏高度 /
		Rect frame = new Rect();
		activity.getWindow().getDecorView().getWindowVisibleDisplayFrame(frame);
		int statusBarHeight = frame.top;
		return statusBarHeight;
	}

	//获得View的截图
	public static Bitmap getBitmap(View mLayoutSource)
	{
		mLayoutSource.setDrawingCacheEnabled(true);
		Bitmap tBitmap = mLayoutSource.getDrawingCache();
		// 拷贝图片，否则在setDrawingCacheEnabled(false)以后该图片会被释放掉
		tBitmap = tBitmap.createBitmap(tBitmap);
		mLayoutSource.setDrawingCacheEnabled(false);
		/*
		if (tBitmap != null) {

			Toast.makeText(getApplicationContext(), "获取成功", Toast.LENGTH_SHORT).show();
		} else {
			Toast.makeText(getApplicationContext(), "获取失败", Toast.LENGTH_SHORT).show();
		}
		*/
		return tBitmap;
	}

	/**
	 * 安装 apk 文件
	 *
	 * @param apkFile
	 */
	public boolean installApk(Context context, String apkFile) {
		/* Intent installApkIntent = new Intent();
		 installApkIntent.setAction(Intent.ACTION_VIEW);
		 installApkIntent.addCategory(Intent.CATEGORY_DEFAULT);
		 installApkIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		 installApkIntent.setDataAndType(Uri.fromFile(apkFile), MIME_TYPE_APK);

		 if (sApp.getPackageManager().queryIntentActivities(installApkIntent, 0).size() > 0) {
		 sApp.startActivity(installApkIntent);
		 }*/
		//Toast.makeText(sApp,apkFile.getPath(),Toast.LENGTH_SHORT).show();
		Intent intent = new Intent(Intent.ACTION_VIEW);
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
			intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
			Uri contentUri = Uri.parse(apkFile);//FileProvider.getUriForFile(sApp, "cn.bingoogolapple.update.demo.fileprovider", apkFile);
			intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
		} else {
			intent.setDataAndType(Uri.parse(apkFile), "application/vnd.android.package-archive");
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		}
		if (context.getPackageManager().queryIntentActivities(intent, 0).size() > 0) {
			context.startActivity(intent);
			return true;
		}
		else{
			//toast("未找到安装器");
			return false;
		}
		//return true;
	}
//	public static Uri getUriFromFile(Context context, File file) {
//		Uri imageUri;
//
//		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//			try{
//				imageUri = FileProvider.getUriForFile(context, context.getPackageName()+".fileprovider", file);//通过FileProvider创建一个content类型的Uri
//			}catch(Exception e){
//				e.printStackTrace();
//				//xlDialog.show(this,"",getLog(e));
//				imageUri = Uri.fromFile(file);
//			}
//		} else {
//			imageUri = Uri.fromFile(file);
//		}
//		//toast(imageUri.getPath());
//		return imageUri;
//	}


	//打开文件
//	public static boolean packageApp(Context context, String str) {
//		Context context2 = context;
//		String str2 = str;
//		for (int i = 0; i < OPEN_Tab.length; i++) {
//			if (str2.endsWith(OPEN_Tab[i][0])) {
//				File file =  new File(str2);
//				/*
//				if(str2.endsWith(".apk") || str2.endsWith(".APK")){
//					packageApp(context, str2);
//				}
//				*/
//				//Uri fromFile = Uri.fromFile(file);
//				Intent intent = new Intent("android.intent.action.VIEW");
//
//				Uri fromFile = getUriFromFile(context, file);
//
//				intent = intent.setDataAndType(fromFile, OPEN_Tab[i][1]);
//				intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//				try {
//					context2.startActivity(intent);
//					return true;
//				} catch (ActivityNotFoundException e) {
//					ActivityNotFoundException activityNotFoundException = e;
//					e.printStackTrace();
//					return false;
//				}
//			}
//		}
//		return false;
//	}


	//模拟按下home
	public static void checkHome(Context context)
	{
		Intent intent = new Intent(Intent.ACTION_MAIN);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		intent.addCategory(Intent.CATEGORY_HOME);
		context.startActivity(intent);
	}

	/**
	 * 获取应用详情页面intent
	 *
	 * @return
	 */
	public static Intent getAppDetailSettingIntent(Context context)
	{
		Intent localIntent = new Intent();
		localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		if (Build.VERSION.SDK_INT>= 9)
		{
			localIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
			localIntent.setData(Uri.fromParts("package", context.getPackageName(), null));
		}
		else if (Build.VERSION.SDK_INT <= 8)
		{
			localIntent.setAction(Intent.ACTION_VIEW);
			localIntent.setClassName("com.android.settings","com.android.settings.InstalledAppDetails");
			localIntent.putExtra("com.android.settings.ApplicationPkgName", context.getPackageName());
		}
		return localIntent;
	}

	//获取设备(tv 手机)
	public boolean isTV(Context context)
	{
		String TAG = "DeviceTypeRuntimeCheck";

		UiModeManager uiModeManager = (UiModeManager) context.getSystemService(context.UI_MODE_SERVICE);
		if (uiModeManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION)
		{

			Log.d(TAG, "Running on a TV Device");
			return true;
		}
		else
		{

			Log.d(TAG, "Running on a non-TV Device");
		}
		return false;
	}

}
