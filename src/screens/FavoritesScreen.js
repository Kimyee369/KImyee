import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
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
import FavoriteDetailModal from '../components/FavoriteDetailModal';

const {width: screenWidth} = Dimensions.get('window');
const ITEM_SIZE = (screenWidth - 40) / 3; // 九宫格，每行3个，考虑间距

const FavoritesScreen = ({onSwipeRight}) => {
  const [favoritesList, setFavoritesList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const {getFavoritesList, removeFromFavorites} = useFavorites();
  const translateX = useSharedValue(0);

  useEffect(() => {
    const list = getFavoritesList();
    setFavoritesList(list);
  }, [getFavoritesList]);

  // 水平滑动手势处理
  const horizontalGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const shouldSwipeRight = event.translationX > 100 && event.velocityX > 500;
      
      if (shouldSwipeRight) {
        runOnJS(onSwipeRight)();
      }
      
      translateX.value = withSpring(0);
    },
  });

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  // 点击缩略图查看大图
  const handleImagePress = (image, index) => {
    setSelectedImage({...image, index});
    setShowDetailModal(true);
  };

  // 长按删除收藏
  const handleLongPress = async (imageUrl) => {
    await removeFromFavorites(imageUrl);
    const updatedList = getFavoritesList();
    setFavoritesList(updatedList);
    Toast.show({
      type: 'success',
      text1: '已取消收藏',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  // 关闭详情模态框
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedImage(null);
    // 刷新收藏列表，以防在详情页面有删除操作
    const updatedList = getFavoritesList();
    setFavoritesList(updatedList);
  };

  // 渲染九宫格项目
  const renderFavoriteItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleImagePress(item, index)}
      onLongPress={() => handleLongPress(item.url)}>
      <FastImage
        source={{uri: item.url}}
        style={styles.thumbnailImage}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  );

  return (
    <PanGestureHandler
      onGestureEvent={horizontalGestureHandler}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-50, 50]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的收藏</Text>
          <Text style={styles.headerSubtitle}>
            {favoritesList.length} 张图片
          </Text>
        </View>
        
        {favoritesList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无收藏图片</Text>
            <Text style={styles.emptySubtext}>右滑返回首页浏览图片</Text>
          </View>
        ) : (
          <FlatList
            data={favoritesList}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        {showDetailModal && selectedImage && (
          <FavoriteDetailModal
            visible={showDetailModal}
            image={selectedImage}
            favoritesList={favoritesList}
            onClose={closeDetailModal}
          />
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  gridContainer: {
    padding: 10,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FavoritesScreen;