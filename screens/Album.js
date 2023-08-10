import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../compoments/Appbar';
import { Dimensions } from 'react-native';
import { getDataAlbum } from '../api/Api_Firebase';
import { useRoute } from '@react-navigation/native';

export default function Album() {
  const windowWidth = Dimensions.get('window').width;
  const [datas, setDatas] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  
  useEffect(() => {
    getDataAlbum(setDatas , route.params.uid);
  }, []);

  const renderImage = (data) => (
    <View>
      <TouchableOpacity onPress={() => {navigation.navigate('DetailImage', {images: [data.item]})}}>
        <Image style={{width: windowWidth * 0.25, height: 100}} source={{uri: data.item}}/>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <AppBar title='Album'
            lefticon={require('../assets/icon/back.png')}
            lefticonpress={navigation.goBack}
        />
        <View style={{ flex: 1 }}>
          <FlatList
          numColumns={4}
          showsVerticalScrollIndicator={false}
          data={datas}
          renderItem={renderImage}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}