# 美女图库 APP - 安装和运行指南

## 🚀 快速开始

### 环境要求

#### 基本要求
- **Node.js** >= 14 (推荐使用 LTS 版本)
- **npm** 或 **yarn**
- **Git**

#### Android 开发环境
- **Android Studio** (最新版本)
- **Android SDK** (API Level 21+)
- **Java Development Kit (JDK)** 11 或更高版本
- **Android Virtual Device (AVD)** 或真实设备

#### iOS 开发环境 (仅限 macOS)
- **Xcode** 12 或更高版本
- **iOS Simulator** 或真实设备
- **CocoaPods**

### 📦 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd BeautyGalleryApp
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **iOS 额外配置** (仅限 macOS)
   ```bash
   cd ios
   pod install
   cd ..
   ```

### 📱 运行应用

#### Android

1. **启动 Android 模拟器**
   - 打开 Android Studio
   - 启动 AVD Manager
   - 创建并启动一个虚拟设备

2. **运行应用**
   ```bash
   npm run android
   ```

#### iOS (仅限 macOS)

1. **运行应用**
   ```bash
   npm run ios
   ```

### 🛠 开发模式

#### 启动 Metro 服务器
```bash
npm start
```

#### 重新加载应用
- **Android**: 按 `R` 键两次，或摇晃设备
- **iOS**: 按 `Cmd + R`，或摇晃设备

#### 打开开发者菜单
- **Android**: 按 `Ctrl + M` (Windows/Linux) 或 `Cmd + M` (macOS)
- **iOS**: 按 `Cmd + D`

### 🔧 故障排除

#### 常见问题

1. **Metro 服务器启动失败**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android 构建失败**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS 构建失败**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npm run ios
   ```

4. **依赖问题**
   ```bash
   rm -rf node_modules
   npm install
   ```

#### 权限问题

**Android**
- 确保在设备设置中启用了"未知来源"安装
- 检查存储权限是否已授权

**iOS**
- 确保开发者账户已配置
- 检查照片库访问权限

### 📋 功能测试清单

- [ ] 首页图片加载正常
- [ ] 上下滑动切换图片
- [ ] 左滑进入收藏页
- [ ] 长按弹出菜单
- [ ] 收藏功能正常
- [ ] 下载功能正常
- [ ] 收藏页九宫格显示
- [ ] 点击缩略图查看大图
- [ ] 大图页面手势操作

### 🎯 性能优化建议

1. **图片缓存**
   - FastImage 自动处理图片缓存
   - 可以调整缓存策略

2. **内存管理**
   - 避免同时加载过多大图
   - 及时释放不需要的资源

3. **网络优化**
   - 使用 CDN 加速图片加载
   - 实现图片懒加载

### 📝 开发说明

#### 修改图片源
编辑 `src/context/ImageContext.js` 中的 `DEMO_IMAGES` 数组

#### 自定义主题
修改各组件中的 `styles` 对象

#### 添加新功能
1. 在 `src/components/` 中创建新组件
2. 在 `src/screens/` 中添加新页面
3. 更新 `src/App.js` 中的导航逻辑

### 🚀 部署

#### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK 文件位置: `android/app/build/outputs/apk/release/`

#### iOS Archive
1. 在 Xcode 中打开 `ios/BeautyGalleryApp.xcworkspace`
2. 选择 Product → Archive
3. 按照 App Store Connect 流程上传

### 📞 技术支持

如果遇到问题，请检查：
1. Node.js 和 npm 版本
2. React Native 环境配置
3. 模拟器/设备连接状态
4. 防火墙和网络设置

---

**祝开发愉快！** 🎉