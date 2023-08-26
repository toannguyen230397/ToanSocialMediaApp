import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState,useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import NewfeedsTop from '../compoments/NewfeedsTop';
import AppBar from '../compoments/Appbar';
import { getDataDetaiFeed, handlerLike, handlerNoLike, handlerNotification } from '../api/Api_Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Detail() {
    const route = useRoute();
    const navigation = useNavigation();
    const [datas, setDatas] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
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
      getData();
      getDataDetaiFeed(setDatas, route.params.postid).then(() => {
        setLoading(false);
      });
    }, []);


    const listHeader = () => {
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

      return <View style= {{flex: 1}}>
        <View style={{paddingBottom: 5}}>
            <NewfeedsTop avatar={datas[0].avatar} name={datas[0].name} uid={datas[0].uid} feeling={datas[0].feeling} title={datas[0].title} posttime={datas[0].posttime} />
          </View>
          <View style={styles.newfeeds_container_button}>
            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={styles.newfeeds_heart_button}>
                <TouchableOpacity onPress={() => likeHandler()}> 
                  <Image style={styles.newfeeds_icon_button} source={hasLike == true
      ? require('../assets/icon/Heart.png')
      : require('../assets/icon/NoHeart.png')} />
                </TouchableOpacity>
                <Text>{datas[0].like.length}</Text>
              </View>
              <View style={styles.newfeeds_comments_button}>
                <TouchableOpacity onPress={() => {navigation.navigate('Comments', {postid: datas[0].postid, uid: datas[0].uid, title: datas[0].title})}}>
                  <Image style={styles.newfeeds_icon_button} source={require('../assets/icon/Comment.png')} />
                </TouchableOpacity>
                <Text>{datas[0].comment.length}</Text>
              </View>
            </View>
            <View style={styles.newfeeds_share_button}>
              <TouchableOpacity onPress={() => navigation.navigate('Friend', {screen: 'share', uid: uid, title: datas[0].title, postid: datas[0].postid, postby: datas[0].postby})}>
                <Image style={styles.newfeeds_icon_button} source={require('../assets/icon/Share.png')} />
              </TouchableOpacity>  
            </View>
          </View>
      </View>
    }

    const renderImage = (data) => (
        <View style={{padding: 5}}>
          <TouchableOpacity onPress={() => {navigation.navigate('DetailImage', {images: [data.item], index: 0, postid: datas[0].postid})}}>
              <Image style={{width: '100%', height: 300, borderRadius: 10}} source={{uri: data.item}}/>
          </TouchableOpacity>
        </View>
    )

    const render = () => {
      if(loading == false && datas.length > 0){
        return <View style={{flex: 1}}>
          <FlatList
          ListHeaderComponent={listHeader}
          showsVerticalScrollIndicator={false}
          data={datas[0].image}
          renderItem={renderImage}
          />
        </View>
      }else{
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
        </View>
      }
    }

    return (
    <SafeAreaView style={{flex: 1}}>
      <AppBar title='Detail'
          lefticon={require('../assets/icon/back.png')}
          lefticonpress={navigation.goBack}
      />
      {render()}
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
  newfeeds_container_button: {
      borderTopWidth: 1,
      borderRadius: 10,
      borderColor: '#a9abaa',
      flexDirection: 'row', 
      justifyContent: 'space-between'
  },
  newfeeds_icon_button:{
      width: 30, 
      height: 30
  },
  newfeeds_heart_button:{
      paddingLeft: 10,
      alignItems: 'center',
      justifyContent: 'center'
  },
  newfeeds_comments_button:{
      paddingLeft: 30,
      alignItems: 'center',
      justifyContent: 'center'
  },
  newfeeds_share_button:{
      paddingRight: 10, 
      justifyContent: 'center'
  }
})