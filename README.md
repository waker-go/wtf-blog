# 我想见貂蝉 - 个人博客

一个精美的个人博客网站，包含樱花树动画、主题切换、小游戏等功能。

## ✨ 特性

- 🌸 **樱花树动画** - Canvas实现的动态樱花树和飘落花瓣
- 🎨 **7种主题** - 樱花粉、深色、浅色、海洋蓝、森林绿、活力橙、跟随系统
- 🎮 **小游戏** - 樱花接球、记忆翻牌
- 📱 **响应式设计** - 完美支持手机、平板、电脑
- ⚡ **性能优化** - 自动检测设备性能并调整
- 🚀 **快速加载** - Gzip压缩、浏览器缓存

## 📁 项目结构

```
.
├── index.html          # 首页
├── blog.html           # 博客列表
├── blog-single.html    # 博客详情
├── games.html          # 游戏页面
├── archive.html        # 归档页面
├── about.html          # 关于页面
├── css/                # 样式文件
│   ├── style-premium.css
│   ├── theme-switcher.css
│   ├── games.css
│   └── ...
├── js/                 # JavaScript文件
│   ├── main.js
│   ├── sakura-tree.js
│   ├── games.js
│   └── performance-config.js
├── .htaccess           # Apache配置
├── nginx.conf          # Nginx配置
└── deploy.sh           # 部署脚本
```

## 🚀 快速开始

### 本地预览

直接用浏览器打开 `index.html` 即可。

### 部署到服务器

#### 方案A: 使用免费CDN托管（推荐）

**Netlify / Vercel / GitHub Pages**
1. 注册账号
2. 上传文件或连接Git仓库
3. 自动部署完成

优势：
- ✅ 零成本
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 无限带宽

#### 方案B: 自建服务器

**Apache服务器**
```bash
# 1. 上传所有文件
rsync -avz ./ user@server:/var/www/html/

# 2. 确保.htaccess在根目录（已包含Gzip和缓存配置）

# 3. 启用必要的模块
sudo a2enmod deflate expires headers
sudo systemctl restart apache2
```

**Nginx服务器**
```bash
# 1. 上传所有文件

# 2. 将nginx.conf中的配置添加到你的配置文件
sudo nano /etc/nginx/sites-available/your-site

# 3. 重启Nginx
sudo nginx -t
sudo systemctl restart nginx
```

**使用部署脚本**
```bash
chmod +x deploy.sh
./deploy.sh your-server.com username /var/www/html
```

## ⚙️ 配置说明

### 性能配置

网站会自动检测设备性能：
- **高性能设备**: 30个飘落花瓣 + 完整特效
- **低性能设备**: 15个飘落花瓣 + 简化特效

手动调整（编辑 `js/performance-config.js`）：
```javascript
fallingPetalsCount: 15,  // 花瓣数量
enableTreeSway: false,   // 禁用树摇摆
enableComplexAnimations: false  // 禁用复杂动画
```

### 主题配置

7种内置主题：
- 🌸 樱花粉（默认）
- 🌙 深色模式
- ☀️ 浅色模式
- 🌊 海洋蓝
- 🌲 森林绿
- 🍊 活力橙
- ✨ 跟随系统

用户选择的主题会自动保存到浏览器。

## 📊 性能优化

### 已实施的优化

**服务器端**（减少传输）
- ✅ Gzip压缩 - 减少70%文件大小
- ✅ 浏览器缓存 - 减少重复下载
- ✅ 资源合并 - 减少HTTP请求

**客户端**（提升体验）
- ✅ 自动检测设备性能
- ✅ 低端设备自动降级
- ✅ 图片懒加载
- ✅ 离屏Canvas缓存

### 性能指标

优化后：
- 文件大小: 42KB（Gzip压缩后）
- 首次加载: < 1秒
- 再次访问: 几乎瞬间（缓存）

## 🎮 游戏说明

### 樱花接球
- 用鼠标/触摸移动篮子
- 接住飘落的樱花得分
- 3条生命，漏掉樱花会失去生命

### 记忆翻牌
- 经典记忆配对游戏
- 8对花朵需要配对
- 记录步数和配对数

## 🛠️ 技术栈

- HTML5
- CSS3（Flexbox、Grid、动画）
- JavaScript（ES6+）
- Canvas API
- AOS动画库
- Font Awesome图标

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 服务器要求

### 最低配置
- CPU: 1核（够用）
- 内存: 256MB（够用）
- 硬盘: 500MB（够用）
- 带宽: 1Mbps+（关键）

**说明**: 静态网站不占用服务器资源，带宽是唯一影响加载速度的因素。

## 🔧 常见问题

**Q: 如何更换主题？**
A: 点击右下角的调色板图标选择主题。

**Q: 动画卡顿怎么办？**
A: 网站会自动检测并优化，也可以手动调整 `performance-config.js`。

**Q: 如何加快加载速度？**
A: 确保启用了Gzip压缩，或使用免费CDN托管。

**Q: 可以自定义内容吗？**
A: 可以，直接编辑HTML文件即可。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

- 邮箱: woxiangjiandianchan@example.com
- 网站: [你的网站地址]

---

**享受你的博客之旅！** 🌸✨
