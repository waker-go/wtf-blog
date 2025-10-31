#!/bin/bash

# 网站部署脚本
# 使用方法: ./deploy.sh [服务器地址] [用户名] [目标路径]

echo "🚀 开始部署网站..."

# 检查参数
if [ $# -lt 3 ]; then
    echo "❌ 错误: 缺少参数"
    echo "使用方法: ./deploy.sh [服务器地址] [用户名] [目标路径]"
    echo "示例: ./deploy.sh example.com user /var/www/html"
    exit 1
fi

SERVER=$1
USER=$2
TARGET_PATH=$3

echo "📋 部署信息:"
echo "  服务器: $SERVER"
echo "  用户: $USER"
echo "  目标路径: $TARGET_PATH"
echo ""

# 确认部署
read -p "确认部署? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 部署已取消"
    exit 1
fi

# 排除的文件和目录
EXCLUDE_FILES=(
    "node_modules"
    ".git"
    ".gitignore"
    "*.md"
    "deploy.sh"
    "test-*.html"
    ".DS_Store"
    "*.log"
)

# 构建排除参数
EXCLUDE_PARAMS=""
for item in "${EXCLUDE_FILES[@]}"; do
    EXCLUDE_PARAMS="$EXCLUDE_PARAMS --exclude='$item'"
done

# 使用 rsync 上传文件
echo "📤 正在上传文件..."
eval rsync -avz --progress $EXCLUDE_PARAMS ./ $USER@$SERVER:$TARGET_PATH

if [ $? -eq 0 ]; then
    echo "✅ 文件上传成功!"
else
    echo "❌ 文件上传失败!"
    exit 1
fi

# 设置文件权限
echo "🔧 设置文件权限..."
ssh $USER@$SERVER "cd $TARGET_PATH && find . -type f -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;"

if [ $? -eq 0 ]; then
    echo "✅ 权限设置成功!"
else
    echo "⚠️  权限设置失败，请手动检查"
fi

# 检查服务器类型并重启服务
echo "🔄 检测服务器类型..."
ssh $USER@$SERVER "command -v nginx" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "检测到 Nginx 服务器"
    read -p "是否重启 Nginx? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ssh $USER@$SERVER "sudo systemctl restart nginx"
        echo "✅ Nginx 已重启"
    fi
fi

ssh $USER@$SERVER "command -v apache2" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "检测到 Apache 服务器"
    read -p "是否重启 Apache? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ssh $USER@$SERVER "sudo systemctl restart apache2"
        echo "✅ Apache 已重启"
    fi
fi

echo ""
echo "🎉 部署完成!"
echo "📊 建议进行以下检查:"
echo "  1. 访问网站确认正常运行"
echo "  2. 使用 PageSpeed Insights 测试性能"
echo "  3. 检查移动端显示效果"
echo "  4. 验证所有链接是否正常"
echo ""
echo "🔗 快速测试命令:"
echo "  curl -I http://$SERVER"
echo ""
