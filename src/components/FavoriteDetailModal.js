import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  PanGestureHandler,
  LongPressGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';

import {useFavorites} from '../context/FavoritesContext';
import ActionMenu from './ActionMenu';
import {downloadImage} from '../utils/downloadUtils';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const FavoriteDetailModal = ({visible, image, favoritesList, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  
  const {removeFromFavorites, isFavorite} = useFavorites();
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (image && favoritesList) {
      const index = favoritesList.findIndex(item => item.id === image.id);
      setCurrentIndex(index >= 0 ? index : 0);
      setCurrentImage(favoritesList[index >= 0 ? index : 0]);
    }
  }, [image, favoritesList]);

  // 水平滑动手势处理（退出）
  const horizontalGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const shouldClose = Math.abs(event.translationX) > 100 && Math.abs(event.velocityX) > 500;
      
      if (shouldClose) {
        runOnJS(onClose)();
      }
      
      translateX.value = withSpring(0);
    },
  });

  // 垂直滑动手势处理（切换图片）
  const verticalGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY;
    },
    onEnd: (event) => {
      const shouldGoNext = event.translationY < -50 && event.velocityY < -500;
      const shouldGoPrev = event.translationY > 50 && event.velocityY > 500;
      
      if (shouldGoNext) {
        runOnJS(goToNext)();
      } else if (shouldGoPrev) {
        runOnJS(goToPrev)();
      }
      
      translateY.value = withSpring(0);
    },
  });

  // 长按手势处理
  const longPressHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setShowMenu(true);
    }
  };

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  // 切换到下一张图片
  const goToNext = () => {
    if (currentIndex < favoritesList.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentImage(favoritesList[nextIndex]);
    }
  };

  // 切换到上一张图片
  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentImage(favoritesList[prevIndex]);
    }
  };

  // 处理取消收藏
  const handleRemoveFavorite = async () => {
    if (currentImage) {
      await removeFromFavorites(currentImage.url);
      Toast.show({
        type: 'success',
        text1: '已取消收藏',
        position: 'bottom',
        visibilityTime: 2000,
      });
      
      // 如果删除后列表为空，关闭模态框
      const updatedList = favoritesList.filter(item => item.url !== currentImage.url);
      if (updatedList.length === 0) {
        onClose();
      } else {
        // 调整当前索引
        let newIndex = currentIndex;
        if (currentIndex >= updatedList.length) {
          newIndex = updatedList.length - 1;
        }
        setCurrentIndex(newIndex);
        setCurrentImage(updatedList[newIndex]);
      }
    }
    setShowMenu(false);
  };

  // 处理下载
  const handleDownload = async () => {
    if (currentImage) {
      try {
        await downloadImage(currentImage.url);
        Toast.show({
          type: 'success',
          text1: '已保存到相册',
          position: 'bottom',
          visibilityTime: 2000,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: '保存失败',
          position: 'bottom',
          visibilityTime: 2000,
        });
      }
    }
    setShowMenu(false);
  };

  // 关闭菜单
  const closeMenu = () => {
    setShowMenu(false);
  };

  if (!currentImage) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent={true}>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <LongPressGestureHandler
          onHandlerStateChange={longPressHandler}
          minDurationMs={500}>
          <Animated.View style={styles.container}>
            <PanGestureHandler
              onGestureEvent={verticalGestureHandler}
              activeOffsetY={[-10, 10]}
              failOffsetX={[-50, 50]}>
              <Animated.View style={styles.container}>
                <PanGestureHandler
                  onGestureEvent={horizontalGestureHandler}
                  activeOffsetX={[-10, 10]}
                  failOffsetY={[-50, 50]}>
                  <Animated.View style={[styles.container, animatedStyle]}>
                    <FastImage
                      source={{uri: currentImage.url}}
                      style={styles.image}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </Animated.View>
                </PanGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </LongPressGestureHandler>
        
        {showMenu && (
          <ActionMenu
            visible={showMenu}
            onClose={closeMenu}
            onFavorite={handleRemoveFavorite}
            onDownload={handleDownload}
            isFavorited={true}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
  },
});

export default FavoriteDetailModal;