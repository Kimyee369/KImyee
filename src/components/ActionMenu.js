import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ActionMenu = ({visible, onClose, onFavorite, onDownload, isFavorited}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(100);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.quad),
      });
      translateY.value = withTiming(100, {
        duration: 200,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [visible, opacity, translateY]);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const menuStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.menu, menuStyle]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onFavorite}
              activeOpacity={0.7}>
              <Text style={styles.menuIcon}>
                {isFavorited ? '💔' : '❤️'}
              </Text>
              <Text style={styles.menuText}>
                {isFavorited ? '取消收藏' : '收藏'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onDownload}
              activeOpacity={0.7}>
              <Text style={styles.menuIcon}>📥</Text>
              <Text style={styles.menuText}>下载</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 20,
    marginBottom: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
    minWidth: 200,
    backdropFilter: 'blur(10px)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 5,
  },
});

export default ActionMenu;