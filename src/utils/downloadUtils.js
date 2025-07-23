import {Platform, PermissionsAndroid, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// 请求存储权限
const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Android 13+ 使用新的权限模型
      const permission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      return permission === RESULTS.GRANTED;
    } else {
      // Android 12 及以下
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '存储权限',
            message: '需要存储权限来保存图片',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
  } else {
    // iOS 使用照片库权限
    const permission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
    return permission === RESULTS.GRANTED;
  }
};

// 生成唯一文件名
const generateFileName = (url) => {
  const timestamp = Date.now();
  const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
  return `beauty_${timestamp}.${extension}`;
};

// 下载图片
export const downloadImage = async (imageUrl) => {
  try {
    // 检查权限
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('没有存储权限');
    }

    const fileName = generateFileName(imageUrl);
    
    // 确定保存路径
    let downloadPath;
    if (Platform.OS === 'android') {
      // Android 保存到 Pictures 目录
      downloadPath = `${RNFS.PicturesDirectoryPath}/BeautyGallery/${fileName}`;
      
      // 确保目录存在
      const dirPath = `${RNFS.PicturesDirectoryPath}/BeautyGallery`;
      const dirExists = await RNFS.exists(dirPath);
      if (!dirExists) {
        await RNFS.mkdir(dirPath);
      }
    } else {
      // iOS 保存到文档目录
      downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }

    // 下载文件
    const downloadResult = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadPath,
      discretionary: true,
      cacheable: false,
    }).promise;

    if (downloadResult.statusCode === 200) {
      // Android 需要通知媒体扫描器
      if (Platform.OS === 'android') {
        try {
          await RNFS.scanFile(downloadPath);
        } catch (scanError) {
          console.warn('Media scan error:', scanError);
        }
      }
      
      return downloadPath;
    } else {
      throw new Error(`下载失败，状态码: ${downloadResult.statusCode}`);
    }
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

// 检查文件是否存在
export const checkFileExists = async (filePath) => {
  try {
    return await RNFS.exists(filePath);
  } catch (error) {
    console.error('File check error:', error);
    return false;
  }
};

// 删除文件
export const deleteFile = async (filePath) => {
  try {
    const exists = await RNFS.exists(filePath);
    if (exists) {
      await RNFS.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('File delete error:', error);
    return false;
  }
};