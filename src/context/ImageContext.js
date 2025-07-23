import React, {createContext, useContext, useState, useEffect} from 'react';

const ImageContext = createContext();

// 模拟美女图片数据源 - 实际项目中应该从API获取
const DEMO_IMAGES = [
  'https://picsum.photos/400/800?random=1',
  'https://picsum.photos/400/800?random=2',
  'https://picsum.photos/400/800?random=3',
  'https://picsum.photos/400/800?random=4',
  'https://picsum.photos/400/800?random=5',
  'https://picsum.photos/400/800?random=6',
  'https://picsum.photos/400/800?random=7',
  'https://picsum.photos/400/800?random=8',
  'https://picsum.photos/400/800?random=9',
  'https://picsum.photos/400/800?random=10',
  'https://picsum.photos/400/800?random=11',
  'https://picsum.photos/400/800?random=12',
  'https://picsum.photos/400/800?random=13',
  'https://picsum.photos/400/800?random=14',
  'https://picsum.photos/400/800?random=15',
  'https://picsum.photos/400/800?random=16',
  'https://picsum.photos/400/800?random=17',
  'https://picsum.photos/400/800?random=18',
  'https://picsum.photos/400/800?random=19',
  'https://picsum.photos/400/800?random=20',
];

export const ImageProvider = ({children}) => {
  const [allImages] = useState(DEMO_IMAGES);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [viewedImages, setViewedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 初始化时打乱图片顺序
  useEffect(() => {
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    if (shuffled.length > 0) {
      setViewedImages([shuffled[0]]);
    }
  }, [allImages]);

  // 获取当前图片
  const getCurrentImage = () => {
    return viewedImages[currentIndex] || null;
  };

  // 获取下一张图片
  const getNextImage = () => {
    if (currentIndex < viewedImages.length - 1) {
      // 如果不是在最后一张，直接返回下一张已查看的图片
      return viewedImages[currentIndex + 1];
    } else {
      // 如果是最后一张，从未查看的图片中随机选择一张
      const unviewedImages = shuffledImages.filter(img => !viewedImages.includes(img));
      if (unviewedImages.length > 0) {
        return unviewedImages[0];
      } else {
        // 如果所有图片都已查看，重新打乱并开始新的循环
        const newShuffled = [...allImages].sort(() => Math.random() - 0.5);
        setShuffledImages(newShuffled);
        return newShuffled[0];
      }
    }
  };

  // 获取上一张图片
  const getPrevImage = () => {
    if (currentIndex > 0) {
      return viewedImages[currentIndex - 1];
    }
    return null;
  };

  // 切换到下一张图片
  const goToNext = () => {
    const nextImage = getNextImage();
    if (nextImage) {
      if (currentIndex < viewedImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setViewedImages(prev => [...prev, nextImage]);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  // 切换到上一张图片
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 预加载图片（用于优化性能）
  const preloadImages = () => {
    const current = getCurrentImage();
    const next = getNextImage();
    const prev = getPrevImage();
    
    return {
      current,
      next,
      prev,
    };
  };

  const value = {
    allImages,
    shuffledImages,
    viewedImages,
    currentIndex,
    getCurrentImage,
    getNextImage,
    getPrevImage,
    goToNext,
    goToPrev,
    preloadImages,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};