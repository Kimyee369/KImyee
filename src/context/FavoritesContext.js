import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = '@BeautyGallery_Favorites';

export const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  // 从本地存储加载收藏列表
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // 检查图片是否已收藏
  const isFavorite = (imageUrl) => {
    return favorites.some(fav => fav.url === imageUrl);
  };

  // 添加到收藏
  const addToFavorites = async (imageUrl) => {
    if (!isFavorite(imageUrl)) {
      const newFavorite = {
        url: imageUrl,
        id: Date.now().toString(),
        addedAt: new Date().toISOString(),
      };
      const newFavorites = [...favorites, newFavorite];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      return true;
    }
    return false;
  };

  // 从收藏中移除
  const removeFromFavorites = async (imageUrl) => {
    const newFavorites = favorites.filter(fav => fav.url !== imageUrl);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
    return true;
  };

  // 切换收藏状态
  const toggleFavorite = async (imageUrl) => {
    if (isFavorite(imageUrl)) {
      await removeFromFavorites(imageUrl);
      return false;
    } else {
      await addToFavorites(imageUrl);
      return true;
    }
  };

  // 获取收藏列表（按添加时间排序）
  const getFavoritesList = () => {
    return [...favorites].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  };

  // 清空所有收藏
  const clearAllFavorites = async () => {
    setFavorites([]);
    await saveFavorites([]);
  };

  const value = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoritesList,
    clearAllFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};