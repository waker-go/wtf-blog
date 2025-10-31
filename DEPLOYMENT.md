# 部署指南

## 📦 部署前准备

### 1. 文件检查清单
- ✅ 所有 HTML 文件
- ✅ CSS 文件（已优化）
- ✅ JavaScript 文件（已优化）
- ✅ 图片资源（建议转换为 WebP）
- ✅ 配置文件（.htaccess 或 nginx.conf）

### 2. 性能优化已完成
- ✅ 自动检测设备性能
- ✅ 低端设备自动降级
- ✅ 资源懒加载
- ✅ 缓存策略
- ✅ Gzip 压缩配置

## 🚀 部署步骤

### 方案 A: 使用 Apache 服务器

1. 上传所有文件到服务器
```bash
# 使用 FTP/SFTP 或 rsync
rsync -avz --exclude 'node_modules' ./ user@server:/var/www/html/
```

2. 确保 .htaccess 文件在根目录

3. 检查 Apache 模块是否启用
```bash
sudo a2enmod deflate
sudo a2enmod expires
sudo a2enmod headers
sudo systemctl restart apache2
```

### 方案 B: 使用 Nginx 服务器

1. 上传所有文件到服务器

2. 将 nginx.conf 中的配置添加到你的 Nginx 配置文件
```bash
sudo nano /etc/nginx/sites-available/your-site
```

3. 测试配置并重启
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 方案 C: 使用静态托管服务（推荐）

#### Netlify
1. 注册 Netlify 账号
2. 连接 Git 仓库或直接拖拽文件夹
3. 自动部署完成

#### Vercel
1. 注册 Vercel 账号
2. 导入项目
3. 自动部署完成

#### GitHub Pages
1. 创建 GitHub 仓库
2. 推送代码
3. 在设置中启用 GitHub Pages

## ⚙️ 服务器配置要求

### 最低配置（静态网站）
- CPU: 1核（够用）
- 内存: 256MB（够用）
- 硬盘: 500MB（够用）
- **带宽: 1-5Mbps**（关键！）

### 说明
- **CPU/内存**: 静态网站几乎不占用服务器资源
- **带宽**: 这是唯一影响加载速度的因素
- **优化重点**: 减少文件大小，启用压缩

## 🔧 优化配置说明

### 自动性能检测
网站会自动检测访问者的设备性能：
- **高性能设备**: 完整特效（30个飘落花瓣、树摇摆、粒子背景）
- **低性能设备**: 简化特效（15个飘落花瓣、无树摇摆、无粒子背景）

### 手动调整性能
如果需要手动调整，编辑 `js/performance-config.js`:

```javascript
// 强制低性能模式
return {
    fallingPetalsCount: 10,  // 减少到10个
    targetFPS: 30,
    enableComplexAnimations: false,
    enableBackgroundCanvas: false,
    enableTreeSway: false
};
```

## 📊 性能监控

部署后使用以下工具测试：

1. **Google PageSpeed Insights**
   - 访问: https://pagespeed.web.dev/
   - 输入你的网站地址
   - 目标分数: 90+

2. **GTmetrix**
   - 访问: https://gtmetrix.com/
   - 测试加载速度
   - 目标: A级

3. **Chrome DevTools**
   - 按 F12 打开开发者工具
   - 切换到 Lighthouse 标签
   - 运行性能测试

## 🐛 常见问题

### 问题1: 页面加载慢
**解决方案**:
- 检查服务器带宽
- 启用 Gzip 压缩
- 使用 CDN 加速

### 问题2: 动画卡顿
**解决方案**:
- 检查是否启用了性能优化
- 手动降低花瓣数量
- 禁用部分特效

### 问题3: 缓存不生效
**解决方案**:
- 检查服务器配置
- 清除浏览器缓存
- 验证 HTTP 响应头

### 问题4: 移动端显示异常
**解决方案**:
- 检查 viewport 设置
- 测试响应式布局
- 使用移动端调试工具

## 🔒 安全建议

1. 定期更新依赖库
2. 使用 HTTPS（Let's Encrypt 免费证书）
3. 设置安全响应头
4. 定期备份网站文件

## 📱 CDN 配置（可选）

如果使用 CDN 加速：

### Cloudflare（免费）
1. 注册 Cloudflare 账号
2. 添加你的域名
3. 修改 DNS 服务器
4. 启用缓存和压缩

### 配置建议
- 缓存级别: 标准
- 自动压缩: 启用
- Brotli 压缩: 启用
- HTTP/2: 启用

## 📈 持续优化

部署后定期检查：
1. 页面加载速度
2. 用户访问数据
3. 错误日志
4. 资源使用情况

## 💡 额外优化建议

### 如果服务器配置很低（512MB内存）
1. 减少花瓣数量到 5-10 个
2. 禁用所有粒子效果
3. 使用静态图片替代 Canvas
4. 移除 AOS 动画库
5. 考虑使用静态托管服务

### 极致优化版本
如果需要最小化版本，可以：
1. 移除所有 Canvas 动画
2. 使用纯 CSS 动画
3. 移除第三方库
4. 压缩所有资源
5. 使用 WebP 图片格式

## 🎯 部署检查清单

部署前确认：
- [ ] 所有文件已上传
- [ ] 配置文件已设置
- [ ] Gzip 压缩已启用
- [ ] 缓存策略已配置
- [ ] 性能测试已通过
- [ ] 移动端测试已通过
- [ ] 跨浏览器测试已通过
- [ ] 安全头已设置
- [ ] 错误页面已配置
- [ ] 备份已完成

## 📞 技术支持

如有问题，可以：
1. 查看浏览器控制台错误
2. 检查服务器日志
3. 使用性能分析工具
4. 参考 OPTIMIZATION.md 文档
