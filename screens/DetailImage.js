import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRoute } from '@react-navigation/native';

export default function DetailImage() {
    const route = useRoute();
    const images = route.params.images.map((url) => ({ url }));
    const currentIndex = route.params.index;
  return (
    <View style={{flex: 1}}>
      <ImageViewer
        imageUrls={images}
        index={currentIndex}
        enableSwipeDown={true}
        onSwipeDown={() => console.log('Swipe down')}
      />
    </View>
  )
}