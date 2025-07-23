import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
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

import {useImages} from '../context/ImageContext';
import {useFavorites} from '../context/FavoritesContext';
import ActionMenu from '../components/ActionMenu';
import {downloadImage} from '../utils/downloadUtils';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const HomeScreen = ({onSwipeLeft}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  const {getCurrentImage, goToNext, goToPrev, preloadImages} = useImages();
  const {isFavorite, toggleFavorite} = useFavorites();
  
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const longPressRef = useRef();
  const panRef = useRef();

  useEffect(() => {
    const current = getCurrentImage();
    if (current) {
      setCurrentImageUrl(current);
    }
  }, [getCurrentImage]);

  // 预加载图片
  useEffect(() => {
    preloadImages();
  }, [currentImageUrl]);

  // 垂直滑动手势处理
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

  // 水平滑动手势处理
  const horizontalGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const shouldSwipeLeft = event.translationX < -100 && event.velocityX < -500;
      
      if (shouldSwipeLeft) {
        runOnJS(onSwipeLeft)();
      }
      
      translateX.value = withSpring(0);
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
        {translateY: translateY.value},
        {translateX: translateX.value},
      ],
    };
  });

  // 处理收藏
  const handleFavorite = async () => {
    if (currentImageUrl) {
      const added = await toggleFavorite(currentImageUrl);
      Toast.show({
        type: 'success',
        text1: added ? '已收藏' : '已取消收藏',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
    setShowMenu(false);
  };

  // 处理下载
  const handleDownload = async () => {
    if (currentImageUrl) {
      try {
        await downloadImage(currentImageUrl);
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

  if (!currentImageUrl) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <LongPressGestureHandler
        ref={longPressRef}
        onHandlerStateChange={longPressHandler}
        minDurationMs={500}>
        <Animated.View style={styles.container}>
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={verticalGestureHandler}
            activeOffsetY={[-10, 10]}
            failOffsetX={[-50, 50]}
            simultaneousHandlers={longPressRef}>
            <Animated.View style={styles.container}>
              <PanGestureHandler
                onGestureEvent={horizontalGestureHandler}
                activeOffsetX={[-10, 10]}
                failOffsetY={[-50, 50]}>
                <Animated.View style={[styles.container, animatedStyle]}>
                  <FastImage
                    source={{uri: currentImageUrl}}
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
          onFavorite={handleFavorite}
          onDownload={handleDownload}
          isFavorited={isFavorite(currentImageUrl)}
        />
      )}
    </View>
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

export default HomeScreen;