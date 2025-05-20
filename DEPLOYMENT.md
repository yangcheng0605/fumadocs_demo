# 部署指南

## 1. 环境要求

- Node.js 18.19.0
- Nginx
- PM2

## 2. 安装Node.js 18.19.0

推荐使用NVM安装特定版本的Node.js：

```bash
# 安装NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# 或使用wget
# wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# 安装Node.js 18.19.0
nvm install 18.19.0

```

## 3. 项目文件部署

### 3.1 文件放置

```bash
# 创建应用目录
mkdir -p /var/www/fumadocs

# 将项目文件复制到目标目录
# 方法1：从本地上传
scp -r /path/to/local/fumadocs/* user@your-server:/var/www/fumadocs/

# 方法2：从Git仓库克隆
cd /var/www
git clone <your-repository-url> fumadocs
cd fumadocs
```

### 3.2 安装依赖并构建项目

```bash
cd /var/www/fumadocs

# 安装依赖
npm ci  # 使用package-lock.json的确切版本安装

# 构建项目
npm run build

# 可选：移除缓存以减少空间占用
rm -rf .next/cache
```

## 4. 安装和配置PM2

PM2是Node.js应用程序的进程管理器，可以保持应用持续运行。

```bash
# 全局安装PM2
npm install -g pm2


# 查看应用状态
pm2 status
```

## 5. Nginx配置

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP

    access_log /var/log/nginx/fumadocs.access.log;
    error_log /var/log/nginx/fumadocs.error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 优化静态资源缓存
    location /_next/static/ {
        proxy_pass http://localhost:3000/_next/static/;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 禁止访问特定文件，提高安全性
    location ~ /\.(?!well-known) {
        deny all;
    }
}
```

### 重启服务

```bash
# 重启应用
pm2 restart fumadocs

# 重启Nginx
sudo systemctl restart nginx
```

## 9. 性能优化建议

1. 启用Nginx缓存：在Nginx配置中添加适当的缓存指令
2. 使用CDN：考虑将静态资源部署到CDN
3. 监控内存使用：使用`pm2 monit`监控应用内存使用情况
4. 定期清理：定期清理`.next/cache`目录以释放磁盘空间 