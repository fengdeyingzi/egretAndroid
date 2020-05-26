package folk.china.http;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import folk.china.util.ByteBuffer;

/**
 * HTTP请求头
 * @author wangchen11
 *
 */
public class HTTPRequestHeader {
	// 请求类型，是GET还是POST.
	public String mRequestType = "";
	// 本地路径
	public String mLocalUrl = "";
	// HTTP版本
	public String mVersion = "";
	// 所有的Get参数
	public Map<String, String> mGetValues = new HashMap<String, String>();
	// 所有的Post参数
	public Map<String, String> mPostValues = new HashMap<String, String>();
	// 所有属性集合
	public Map<String, String> mProperty = new HashMap<String, String>();
	
	public static HTTPRequestHeader parse(InputStream inputStream) throws HTTPRequestException
	{
		return parse(inputStream,null);
	}
	
	/**
	 * 解析得出HTTP请求头
	 * @param inputStream
	 * @param charset 指定参数的字符集,null:使用默认字符集
	 * @return 解析好的HTTP头。
	 * @throws HTTPRequestException 如果解析时发生异常，将抛出此异常。
	 */
	@SuppressWarnings("resource")
	public static HTTPRequestHeader parse(InputStream inputStream, String charset) throws HTTPRequestException
	{
		HTTPRequestHeader header= new HTTPRequestHeader();
		/**
		 * 不要在这里关闭这个scanner！
		 */
		Scanner scanner = null;
		if(charset==null)
			scanner = new Scanner(inputStream);
		else
		{
			try {
				scanner = new Scanner(inputStream,charset);
			} catch (IllegalArgumentException e) {
				throw new HTTPRequestException("unsupport charset!");
			}
		}
		
		String line = null;
		if(scanner.hasNextLine())
		{
			line = scanner.nextLine();
			if(line.endsWith("\r"))
			{
				line = line.substring(0, line.length()-1);
			}
			
			String[]items = line.split(" ");
			if(items.length!=3)
				throw new HTTPRequestException("items.length!=3");
			//得到请求类型
			if( (!items[0].equals("GET")) && (!items[0].equals("POST")) )
				throw new HTTPRequestException("Request type not 'GET' or 'POST'!");
			header.mRequestType = items[0];
			
			//分离URL和GET参数
			int fristQMarkIndex = items[1].indexOf('?');
			if(fristQMarkIndex==-1)
			{
				header.mLocalUrl = items[1];
			}
			else
			{
				header.mLocalUrl = items[1].substring(0, fristQMarkIndex);
				header.mGetValues.putAll(
						getParamByString( items[1].substring(fristQMarkIndex+1,items[1].length()),charset ));
			}
			header.mVersion = items[2];
		}
		
		/**
		 * 碰到空行，如果是GET请求就立即停止解析，如果是POST请求就只读下一行所有内容，下一行内容都是POST的参数。
		 */
		while(scanner.hasNextLine())
		{
			line = scanner.nextLine();
			if(line.endsWith("\r"))
			{
				line = line.substring(0, line.length()-1);
			}
			
			if(lineIsEmpty(line))
			{
				if(header.mRequestType.equals("POST"))
				{
					if(scanner.hasNextLine())
						header.mPostValues.putAll(getParamByString(scanner.nextLine(),charset));
				}
				break;
			}
			
			int fristColonIndex = line.indexOf(":");
			if(fristColonIndex==-1)
			{
				throw new HTTPRequestException("line:"+line+" no expected ':'");
			}
			else
			{
				String name = line.substring(0, fristColonIndex);
				String value = line.substring(fristColonIndex+1);
				if(value.startsWith(" "))
					value = value.substring(1);
				header.mProperty.put(name,value);
			}
		}
		
		return header;
	}
	
	private static Map<String, String> getParamByString(String str, String charset) throws HTTPRequestException
	{
		Map<String, String> map = new HashMap<String, String>();
		String[]params = str.split("&");
		for(String param : params)
		{
			int fristEqualIndex = param.indexOf('=');
			if(fristEqualIndex==-1)
			{
				// throw new HTTPRequestException("params  is not valid!");
				// ignore it 
				continue;
			}
			String name = param.substring(0, fristEqualIndex);
			String value = param.substring(fristEqualIndex+1);
			map.put(name, getTranslatedValue(value,charset) );
		}
		return map;
	}
	
	/**
	 * 判断一行是否除了 空格 \r \t 没有其它字符了
	 * @param line
	 * @return
	 */
	private static boolean lineIsEmpty(String line)
	{
		int len = line.length();
		for(int i=0;i<len;i++)
		{
			char ch = line.charAt(i);
			switch (ch) {
			case ' ':
			case '\r':
			case '\t':
				break;
			default:
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 得到翻译后的参数
	 * @param value 翻译前的参数
	 * @param charset 字符集
	 * @return
	 * @throws HTTPRequestException
	 */
	private static String getTranslatedValue(String value, String charset) throws HTTPRequestException
	{
		StringBuilder builder = new StringBuilder();
		ByteBuffer byteBuffer = new ByteBuffer();
		int len = value.length();
		for(int i=0;i<len;i++)
		{
			char ch = value.charAt(i);
			if(ch=='%')
			{//后跟最多两位的十六进制数
				int onebyte = 0;
				if(i+2>=len)
				{
					continue;
				}
				else
				{
					int halfByte = getHexChar(value.charAt(i+1));
					onebyte = halfByte&0x0f;
					if(halfByte==-1)
					{
						continue;
					}
					else
					{
						i++;
						halfByte = getHexChar(value.charAt(i+1));
						if(halfByte==-1)
						{
						}
						else
						{
							i++;
							onebyte = (onebyte<<4)|(halfByte&0x0f);
						}
						byteBuffer.put((byte)onebyte);
					}
					
				}
			}
			else
			{
				if(byteBuffer.length()>0)
				{
					if(charset==null)
					{
						builder.append(new String(byteBuffer.getBytes(), 0, byteBuffer.length()));
					}
					else
					{
						try {
							builder.append(new String(byteBuffer.getBytes(), 0, byteBuffer.length(),charset));
						} catch (UnsupportedEncodingException e) {
							throw new HTTPRequestException("UnsupportedEncodingException:"+e.getMessage());
						}
					}
					byteBuffer.clear();
				}
				builder.append(ch);
			}
		}
		
		if(byteBuffer.length()>0)
		{
			if(charset==null)
			{
				builder.append(new String(byteBuffer.getBytes(), 0, byteBuffer.length()));
			}
			else
			{
				try {
					builder.append(new String(byteBuffer.getBytes(), 0, byteBuffer.length(),charset));
				} catch (UnsupportedEncodingException e) {
					throw new HTTPRequestException("UnsupportedEncodingException:"+e.getMessage());
				}
			}
			byteBuffer.clear();
		}
		
		return builder.toString();
	}
	
	public static int getHexChar(char ch)
	{
		int halfByte = -1;
		if(ch>='0'&&ch<='9')
			halfByte = ch-'0';
		if(ch>='a'&&ch<='f')
			halfByte = ch-'a'+10;
		if(ch>='A'&&ch<='F')
			halfByte = ch-'A'+10;
		return halfByte;
	}
	
	@Override
	public String toString() {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(""+mRequestType+" "+mLocalUrl+"?"+mGetValues.toString()+" "+mVersion);
		stringBuilder.append("\r\n");
		if(mPostValues.size()>0)
		{
			stringBuilder.append(""+mPostValues.toString());
			stringBuilder.append("\r\n");
		}
		stringBuilder.append(""+mProperty.toString());
		stringBuilder.append("\r\n");
		stringBuilder.append("\r\n");
		return stringBuilder.toString();
	}
}

/*
GET / HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,* /*;q=0.8
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8
Cookie: _ga=GA1.1.1885384815.1467970825


POST / HTTP/1.1
Host: 127.0.0.1:8080
Connection: keep-alive
Content-Length: 10
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,* /*;q=0.8
Origin: null
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8
Cookie: _ga=GA1.1.1885384815.1467970825

name=value

（注:* /*,为了避开注释的结束符，多加了一个空格）。
*/