# 我想见貂蝉的个人博客

一个现代化、精美的个人博客网站，分享编程技术、历史研究和生活感悟。

## ✨ 特性

### 🎨 视觉设计
- 现代化的渐变色设计
- 流畅的动画效果
- 响应式布局，完美适配各种设备
- 7种主题可选（樱花粉、深色、浅色、海洋蓝、森林绿、活力橙、跟随系统）

### 🚀 功能特点
- **主题切换器** - 右下角调色板按钮，支持多种主题
- **动画效果** - AOS滚动动画、樱花飘落、粒子背景
- **博客系统** - 文章列表、分类、归档、详情页
- **搜索功能** - 侧边栏搜索框
- **响应式导航** - 移动端友好的菜单
- **回到顶部** - 平滑滚动到页面顶部

### 📱 页面结构
- **首页** (`index.html`) - 展示最新文章和分类
- **博客列表** (`blog.html`) - 所有文章列表，带侧边栏
- **归档页** (`archive.html`) - 按时间线展示文章
- **关于页** (`about.html`) - 个人介绍和联系方式
- **文章详情** (`blog-single.html`) - 单篇文章展示

## 📁 项目结构

```
blog_game/
├── css/
│   ├── style-premium.css      # 主样式文件
│   ├── blog-cards.css         # 博客卡片样式
│   ├── blog-list-fix.css      # 博客列表修复样式
│   └── theme-switcher.css     # 主题切换器样式
├── js/
│   └── main.js                # 主JavaScript文件
├── images/                    # 图片资源
├── index.html                 # 首页
├── blog.html                  # 博客列表页
├── archive.html               # 归档页
├── about.html                 # 关于页
├── blog-single.html           # 文章详情页
├── CHANGELOG.md               # 更新日志
└── README.md                  # 项目说明

```

## 🎨 CSS 文件说明

### style-premium.css
主样式文件，包含：
- CSS变量定义
- 基础样式重置
- 导航栏样式
- 页脚样式
- 通用组件样式
- 侧边栏样式
- 归档页样式

### blog-cards.css
博客卡片相关样式：
- 首页博客卡片（网格布局）
- 博客列表项（横向布局）
- 分类卡片
- Section标题样式
- 响应式布局

### blog-list-fix.css
博客列表页图片显示修复：
- 强制显示图片容器
- 确保图片正确渲染
- 使用 !important 覆盖冲突样式

### theme-switcher.css
主题切换器样式：
- 主题切换按钮
- 主题选择菜单
- 7种主题的颜色变量
- 暗色主题适配
- 特效样式（光标、进度条等）

## 🚀 使用方法

1. **直接打开**
   - 用浏览器打开 `index.html` 即可查看

2. **本地服务器**（推荐）
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx serve
   ```
   然后访问 `http://localhost:8000`

## 🎨 主题切换

点击右下角的调色板图标，选择你喜欢的主题：
- 🌸 **樱花粉** - 默认主题，温柔浪漫
- 🌙 **深色模式** - 护眼舒适
- ☀️ **浅色模式** - 简洁明亮
- 🌊 **海洋蓝** - 清新自然
- 🌲 **森林绿** - 生机盎然
- 🍊 **活力橙** - 热情活力
- ✨ **跟随系统** - 自动适配系统主题

主题选择会自动保存到本地存储。

## 🛠️ 技术栈

- **HTML5** - 语义化标签
- **CSS3** - Flexbox、Grid、CSS变量、动画
- **JavaScript (ES6+)** - 原生JS，无框架依赖
- **Font Awesome** - 图标库
- **AOS** - 滚动动画库

## 📝 自定义

### 修改颜色
编辑 `css/style-premium.css` 中的 CSS 变量：
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --accent: #f5576c;
}
```

### 添加文章
1. 在 `blog.html` 中添加文章列表项
2. 在 `archive.html` 中添加归档条目
3. 复制 `blog-single.html` 创建新的文章详情页

### 修改图片
替换 `images/` 文件夹中的图片文件，保持文件名一致。

## 📄 许可证

MIT License

## 👤 作者

**我想见貂蝉**
- 博客：分享编程技术与历史研究
- Email: woxiangjiandianchan@example.com

## 🙏 致谢

- Font Awesome - 图标支持
- AOS - 动画效果
- 所有开源社区的贡献者

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
