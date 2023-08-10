import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, {useState} from 'react'
import FbGrid from "react-native-fb-image-grid"
import styles from '../styles/Newfeeds_Style'
import NewfeedsTop from './NewfeedsTop'
import { useNavigation } from '@react-navigation/native'
import { handlerLike, handlerNoLike, handlerNotification } from '../api/Api_Firebase'

export default function Newfeeds({datas, setDatas, listHeader, uid, refresh, onRefresh}) {
    const navigation = useNavigation();

    const ListEmpty  = () => (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#edf0ef'}}>
        <View style={{ width: '100%', height: 200, marginTop: 10}}>
          <Image style={{ flex: 1, width: '100%', resizeMode: 'stretch', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={require('../assets/LoadingFeeds.jpg')} />
        </View>
        <View style={{ width: '100%', height: 200, marginTop: 10}}>
          <Image style={{ flex: 1, width: '100%', resizeMode: 'stretch', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={require('../assets/LoadingFeeds.jpg')} />
        </View>
        <View style={{ width: '100%', height: 200, marginTop: 10}}>
          <Image style={{ flex: 1, width: '100%', resizeMode: 'stretch', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={require('../assets/LoadingFeeds.jpg')} />
        </View>
        <View style={{ width: '100%', height: 200, marginTop: 10}}>
          <Image style={{ flex: 1, width: '100%', resizeMode: 'stretch', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={require('../assets/LoadingFeeds.jpg')} />
        </View>
      </View>
    )

    const likeHandler = (postid, selectedUid, title) => {
      const newData = datas.map((item) => {
        if (item.postid === postid) {
          const like = [...item.like];
  
          if (like.includes(uid)) {
            const updatedLike = like.filter((id) => id !== uid);
            item.like = updatedLike;
            handlerNoLike(postid, uid);
          } else {
            item.like.push(uid);
            handlerLike(postid, uid);
            if(selectedUid != uid)
            {
              handlerNotification(uid, selectedUid, 'đã thích một bài viết của bạn: '+title, postid, 'like');
            }
          }
        }
        return item;
      });
  
      setDatas(newData);
    };

    const renderNewFeeds = (data) => {
      let hasLike = data.item.like.some((like) => like.includes(uid));

      return(
        <View elevation={5} style={styles.container}>
          <NewfeedsTop avatar={data.item.avatar} name={data.item.name} uid={data.item.uid} feeling={data.item.feeling} title={data.item.title} posttime={data.item.posttime}/>
          {data.item.image == '' ? 
          null : 
          <View style={styles.newfeeds_content_image}>
            <FbGrid
              images={data.item.image}
              onPress={(url, index, event) => {
                navigation.navigate('DetailImage', {images: data.item.image, index: index});
              }}      
            />    
          </View>
          }
          <View style={styles.newfeeds_container_button}>
            <View style={{flexDirection: 'row', padding: 5}}>
              <View style={styles.newfeeds_heart_button}>
                {/* đặt hàm likeHander ở đây */}
                <TouchableOpacity onPress={() => likeHandler(data.item.postid, data.item.uid, data.item.title)}> 
                  <Image style={styles.newfeeds_icon_button} source={hasLike == true
      ? require('../assets/icon/Heart.png')
      : require('../assets/icon/NoHeart.png')} />
                </TouchableOpacity>
                <Text>{data.item.like.length}</Text>
              </View>
              <View style={styles.newfeeds_comments_button}>
                <TouchableOpacity onPress={() => {navigation.navigate('Comments', {postid: data.item.postid, uid: data.item.uid, title: data.item.title})}}>
                  <Image style={styles.newfeeds_icon_button} source={require('../assets/icon/Comment.png')} />
                </TouchableOpacity>
                <Text>{data.item.comment.length}</Text>
              </View>
            </View>
            <View style={styles.newfeeds_share_button}>
              <TouchableOpacity onPress={() => navigation.navigate('Friend', {screen: 'share', uid: uid, title: data.item.title, postid: data.item.postid, postby: data.item.postby})}>
                <Image style={styles.newfeeds_icon_button} source={require('../assets/icon/Share.png')} />
              </TouchableOpacity>  
            </View>
          </View>
        </View>
      )
    }

    return (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={datas}
          renderItem={renderNewFeeds}
          ListHeaderComponent={listHeader}
          removeClippedSubviews={true}
          ListEmptyComponent={ListEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          } 
        />
    )
}