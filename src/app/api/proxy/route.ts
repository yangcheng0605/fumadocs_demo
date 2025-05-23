import { NextRequest } from 'next/server';
import crypto from 'crypto';

/**
 * 计算请求签名
 * @param headers 请求头参数
 * @param body 请求体JSON字符串
 * @returns MD5签名
 */
function calcSign(headers: {[key: string]: string}, body: string | null): string {
  // 构建签名原始字符串
  let raw = `accessKey=${headers.accessKey}&action=${headers.action}&bizType=${headers.bizType}&ts=${headers.ts}`;
  
  // 添加请求体
  if (body) {
    raw += `&body=${body}`;
  }
  
  // 添加密钥
  raw += `&accessSecret=${headers.accessSecret}`;
  
  console.log(`签名原始字符串: ${raw}`);
  
  // MD5加密并转换为小写十六进制
  const sign = crypto.createHash('md5').update(raw).digest('hex');
  console.log(`生成的签名: ${sign}`);
  
  return sign;
}

/**
 * 自定义代理实现，增加详细的日志输出
 */
async function proxyHandler(req: NextRequest): Promise<Response> {
  // 添加调试信息
  console.log('Node.js版本:', process.version);
  console.log('当前工作目录:', process.cwd());
  console.log('环境变量:', process.env.NODE_ENV);
  
  const url = req.nextUrl.searchParams.get('url');
  console.log(`代理请求URL: ${url}`);
  if (!url) {
    console.error('缺少URL查询参数');
    return Response.json('缺少URL查询参数', { status: 400 });
  }

  // 定义不应转发的hop-by-hop头部
  const hopByHopHeaders = [
    'connection', 
    'keep-alive', 
    'transfer-encoding', 
    'te', 
    'trailer', 
    'upgrade', 
    'proxy-authorization', 
    'proxy-authenticate'
  ];

  // 使用普通对象存储请求头，而不是Headers对象
  const headerObj: {[key: string]: string} = {};
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // 过滤掉host,origin和所有hop-by-hop头部
    if (lowerKey !== 'host' && 
        lowerKey !== 'origin' && 
        !hopByHopHeaders.includes(lowerKey)) {
      headerObj[key] = value;
    } else {
      console.log(`跳过头部: ${key}`);
    }
  });

  // 获取并记录请求体
  let requestBody;
  try {
    if (req.body) {
      const bodyText = await req.text();
      console.log(`请求体: ${bodyText}`);
      requestBody = bodyText;
    } else {
      console.log('请求体为空');
      requestBody = null;
    }
  } catch (error) {
    console.error('读取请求体失败:', error);
    requestBody = null;
  }

  try {
    // 替换为新的测试环境地址
    let targetUrl = url;
    if (url.startsWith('https://test-nxlink.nxcloud.com')) {
      targetUrl = url.replace('https://test-nxlink.nxcloud.com', 'https://test-api-westus.nxlink.ai');
      console.log(`URL已替换为新测试环境: ${targetUrl}`);
    }

    // 尝试HTTP协议而不是HTTPS（针对特定端口）
    if (targetUrl.startsWith('https://') && targetUrl.includes(':8010')) {
      targetUrl = targetUrl.replace('https://', 'http://');
      console.log(`尝试使用HTTP协议: ${targetUrl}`);
    }

    // 创建大小写不敏感的请求头对象
    const lowerCaseHeaderObj: {[key: string]: string} = {};
    Object.keys(headerObj).forEach(key => {
      lowerCaseHeaderObj[key.toLowerCase()] = headerObj[key];
    });
    console.log('大小写不敏感的请求头对象:', lowerCaseHeaderObj);

    // 检查是否有必要的认证参数 (使用小写比较)
    const requiredParams = ['accesskey', 'biztype', 'action', 'accesssecret'];
    const missingParams = requiredParams.filter(param => !lowerCaseHeaderObj[param]);
    
    // 只添加时间戳（如果没有）
    if (!lowerCaseHeaderObj.ts) {
      const ts = Date.now().toString();
      headerObj.ts = ts;
      lowerCaseHeaderObj.ts = ts;
      console.log(`添加时间戳: ${ts}`);
    }

    // 如果有必要的认证参数，计算签名
    if (missingParams.length === 0) {
      // 获取accessKey (使用小写索引获取值)
      const accessKey = lowerCaseHeaderObj.accesskey;
      
      // 从请求头获取accessSecret
      const accessSecret = lowerCaseHeaderObj.accesssecret;
      
      if (accessSecret) {
        // 创建用于签名的参数对象 (从请求头获取)
        const signParams = {
          accessKey: lowerCaseHeaderObj.accesskey,
          bizType: lowerCaseHeaderObj.biztype,
          action: lowerCaseHeaderObj.action,
          ts: lowerCaseHeaderObj.ts,
          accessSecret: lowerCaseHeaderObj.accesssecret
        };
        console.log('signParams', signParams);
        // 计算签名
        const sign = calcSign(signParams, requestBody);
        // 添加签名到请求头
        headerObj.sign = sign;
        console.log(`使用请求头的密钥计算签名: sign=${sign}`);
      } else {
        console.log(`请求头中未提供accessSecret，跳过签名计算`);
      }
    } else {
      console.log(`缺少签名所需参数: ${missingParams.join(', ')}，跳过签名计算`);
    }

    // 添加更多请求调试信息
    console.log(`正在发送${req.method}请求到: ${targetUrl}`);
    console.log(`请求头数量: ${Object.keys(headerObj).length}`);
    console.log(`请求体长度: ${requestBody ? requestBody.length : 0}`);
    console.log('请求头详情:', headerObj);

    // 发送请求到目标API，但禁用重定向跟随，以便捕获301等状态码
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headerObj, // 直接使用对象作为headers
      body: requestBody,
      redirect: 'manual', // 手动处理重定向
      cache: 'no-store' as RequestCache
    };
    console.log('Fetch选项:', JSON.stringify(fetchOptions, null, 2));

    // 发送请求
    const response = await fetch(targetUrl, fetchOptions);

    // 记录响应信息
    console.log(`响应状态: ${response.status} ${response.statusText}`);
    
    // 使用普通对象处理响应头
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!lowerKey.startsWith('access-control-') && 
          lowerKey !== 'content-encoding' &&
          !hopByHopHeaders.includes(lowerKey)) {
        responseHeaders[key] = value;
      }
    });

    // 获取响应体，需要使用原始形式返回，不尝试解码
    const responseClone = response.clone();
    let responseBody;
    try {
      // 不对gzip压缩的内容进行解码，直接传递原始响应
      if (response.headers.get('content-encoding') === 'gzip') {
        console.log('检测到gzip编码，使用原始响应体');
        
        // 设置CORS头
        const finalHeaders = new Headers(responseHeaders);
        finalHeaders.set('Access-Control-Allow-Origin', '*');
        finalHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        finalHeaders.set('Access-Control-Allow-Headers', '*');
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: finalHeaders
        });
      }

      // 其他情况下尝试读取响应文本
      responseBody = await responseClone.text();
      console.log(`响应体预览: ${responseBody.substring(0, 300)}...`);
    } catch (error) {
      console.log('无法读取响应体:', error);
      responseBody = '';
    }

    // 检查并记录重定向
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log(`*** 收到重定向(${response.status}): ${location} ***`);
    }

    // 如果状态码表示错误，记录更详细的信息
    if (response.status >= 400) {
      console.log(`*** 收到错误响应(${response.status}) ***`);
      console.log(`详细错误信息: ${responseBody}`);
    }

    // 创建最终响应头
    const finalHeaders = new Headers(responseHeaders);
    
    // 设置CORS头
    finalHeaders.set('Access-Control-Allow-Origin', '*');
    finalHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    finalHeaders.set('Access-Control-Allow-Headers', '*');

    // 返回响应，包括错误状态码
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: finalHeaders
    });
  } catch (error: any) {
    console.error('代理请求失败:', error);
    
    // 详细记录错误信息
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    console.error('详细错误:', JSON.stringify({
      message: error.message,
      name: error.name,
      code: error.code,
      cause: error.cause,
      stack: error.stack
    }, null, 2));
    
    if (error.cause) {
      console.error('错误原因:', error.cause);
      console.error('错误代码:', error.cause.code);
      if (error.cause.socket) {
        console.error('套接字信息:', {
          localAddress: error.cause.socket.localAddress,
          localPort: error.cause.socket.localPort,
          remoteAddress: error.cause.socket.remoteAddress,
          remotePort: error.cause.socket.remotePort,
          bytesWritten: error.cause.socket.bytesWritten,
          bytesRead: error.cause.socket.bytesRead
        });
      }
    }

    return Response.json(
      { 
        error: `代理请求失败: ${error?.message || '未知错误'}`,
        cause: error.cause ? JSON.stringify(error.cause) : '未知原因',
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

// 处理各种HTTP方法
export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
export const HEAD = proxyHandler;
export const OPTIONS = async (req: NextRequest) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
}; 