# 美女图库 APP

一个基于 React Native 开发的美女图片浏览应用，支持 Android 和 iOS 平台。

## 📱 功能特性

### 🏠 首页（主图片浏览）
- **全屏图片浏览** - 图片铺满屏幕，无黑边
- **上下滑动切换** - 向上滑动查看下一张，向下滑动查看历史图片
- **左滑进入收藏页** - 流畅的手势切换
- **长按呼出菜单** - 收藏/取消收藏、下载图片
- **随机图片加载** - 不重复显示，遍历完所有图片后重新打乱

### ❤️ 收藏页
- **九宫格布局** - 美观的缩略图展示
- **点击查看大图** - 一键进入全屏模式
- **长按删除收藏** - 无需二次确认，快速删除
- **大图浏览模式**：
  - 左右滑动退出到收藏页
  - 上下滑动按收藏顺序切换图片
  - 长按呼出菜单（取消收藏、下载）

### 🎯 交互反馈
- 收藏成功：显示"已收藏"提示
- 取消收藏：显示"已取消收藏"提示
- 下载成功：显示"已保存到相册"提示
- 所有操作都有即时的视觉反馈

## 🛠 技术栈

- **React Native** - 跨平台移动应用框架
- **React Native Reanimated** - 高性能动画库
- **React Native Gesture Handler** - 手势处理
- **React Native Fast Image** - 优化的图片组件
- **AsyncStorage** - 本地数据存储
- **React Native FS** - 文件系统操作
- **React Native Permissions** - 权限管理

## 🚀 快速开始

### 环境要求
- Node.js >= 14
- React Native CLI
- Android Studio (Android 开发)
- Xcode (iOS 开发)

### 安装依赖
```bash
npm install
```

### Android 运行
```bash
npm run android
```

### iOS 运行
```bash
cd ios && pod install && cd ..
npm run ios
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ActionMenu.js   # 长按菜单组件
│   └── FavoriteDetailModal.js # 收藏详情模态框
├── context/            # Context 状态管理
│   ├── ImageContext.js # 图片数据管理
│   └── FavoritesContext.js # 收藏功能管理
├── screens/            # 页面组件
│   ├── HomeScreen.js   # 首页
│   └── FavoritesScreen.js # 收藏页
├── utils/              # 工具函数
│   └── downloadUtils.js # 下载工具
└── App.js              # 主应用组件
```

## 🎨 设计特色

- **沉浸式体验** - 全屏显示，隐藏状态栏
- **流畅动画** - 使用 Reanimated 实现 60fps 动画
- **手势友好** - 直观的滑动交互
- **性能优化** - 图片预加载和缓存机制
- **本地存储** - 收藏数据持久化保存

## 📱 支持平台

- ✅ Android 5.0+ (API Level 21+)
- ✅ iOS 11.0+

## 🔧 开发说明

### 图片数据源
当前使用 Picsum Photos 作为演示数据源。在生产环境中，可以替换为实际的 API 接口。

### 权限配置
- Android：存储权限、网络权限
- iOS：照片库访问权限

### 自定义配置
可以在 `src/context/ImageContext.js` 中修改图片数据源和加载逻辑。

## 🐛 已知问题

- 图片下载功能需要相应的存储权限
- 在某些设备上可能需要调整手势识别阈值

## 🔄 版本历史

### v1.0.0
- ✨ 首页图片浏览功能
- ✨ 收藏功能
- ✨ 九宫格收藏页
- ✨ 图片下载功能
- ✨ 流畅的手势交互

## 📄 许可证

MIT License