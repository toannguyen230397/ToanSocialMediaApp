import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRoute } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { getDataDetaiFeed, handlerLike, handlerNoLike, handlerNotification } from '../api/Api_Firebase';
import { BlurView } from 'expo-blur';
import { formatTimestamp } from '../function/helper_function';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailImage() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [datas, setDatas] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const images = route.params.images.map((url) => ({ url }));
    const currentIndex = route.params.index;
    const [show, setShow] = useState(true);
    const [uid, setUid] = useState('');

    const getData = async () => {
      try {
        const storedUid = await AsyncStorage.getItem('uid');      
        setUid(storedUid || '');
      } catch (error) {
        console.log('Đã xảy ra lỗi:', error);
      }
    };

    useEffect(() => {
      getDataDetaiFeed(setDatas, route.params.postid);
      getData();
    }, []);

    const renderFooter = () => {
      if(show && datas.length > 0)
      {
        let hasLike = datas[0].like.some((like) => like.includes(uid));

        const likeHandler = () => {
          if (hasLike) {
            handlerNoLike(datas[0].postid, uid);
          } else {
            handlerLike(datas[0].postid, uid);
            if(datas[0].postby != uid)
            {
              handlerNotification(uid, datas[0].postby, 'đã thích một bài viết của bạn: '+datas[0].title, datas[0].postid, 'like');
            }
          }
        };

        return <BlurView intensity={50} tint={'dark'} style={{width: windowWidth, padding: 10}}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#edf0ef' }}>
            <View>
              <Text style={{ color: 'white' }}>{datas[0].name}</Text>
              <Text style={{ color: 'white' }}>{datas[0].title}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: 'white', opacity: 0.5, fontSize: 10 }}>{formatTimestamp(datas[0].posttime)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
              <Text style={{ color: 'white', opacity: 0.5 }}>{datas[0].like.length} người thả tim</Text>
              <Text style={{ color: 'white', opacity: 0.5 }}>{datas[0].comment.length}  bình luận</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
            <TouchableOpacity onPress={() => likeHandler()}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{width: 15, height: 15}} source={hasLike ? require('../assets/icon/Heart.png') : require('../assets/icon/NoHeart2.png')} />
                <Text style={{ color: 'white' }}> Thả tim</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('Comments', {postid: datas[0].postid, uid: datas[0].uid, title: datas[0].title})}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{width: 15, height: 15}} source={require('../assets/icon/Comment3.png')} />
                <Text style={{ color: 'white' }}> Bình luận</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Friend', {screen: 'share', uid: uid, title: datas[0].title, postid: datas[0].postid, postby: datas[0].postby})}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{width: 15, height: 15}} source={require('../assets/icon/Share3.png')} />
                <Text style={{ color: 'white' }}> Chia sẻ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </BlurView>
      }
      else
      {
        null
      }
    }

  return (
    <View style={{flex: 1}}>
      <ImageViewer
        imageUrls={images}
        index={currentIndex}
        onClick={() => {
          setShow(!show);
        }}
        renderFooter={renderFooter}
      />
    </View>
  )
}