#!/bin/bash

echo "🚀 开始设置美女图库 APP 项目..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "📦 安装依赖包..."
npm install

echo "🔧 设置 iOS 依赖 (如果在 macOS 上)..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v pod &> /dev/null; then
        cd ios && pod install && cd ..
        echo "✅ iOS 依赖安装完成"
    else
        echo "⚠️  CocoaPods 未安装，跳过 iOS 依赖安装"
    fi
fi

echo "📱 项目设置完成！"
echo ""
echo "🎯 运行命令："
echo "  Android: npm run android"
echo "  iOS:     npm run ios"
echo "  启动服务: npm start"
echo ""
echo "📖 更多信息请查看 README.md"