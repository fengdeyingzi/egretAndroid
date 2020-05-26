package folk.china.http;

/**
 * HTTP请求异常
 * @author wangchen11
 *
 */
public class HTTPRequestException extends Exception {
	public HTTPRequestException(String string) {
		super(string);
	}

	private static final long serialVersionUID = 1L;
}
