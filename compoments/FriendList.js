import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handlerNotification } from '../api/Api_Firebase';
import { ShowToast } from '../function/helper_function';

export default function FriendList({searchdatas, screen, title, postid, postby}) {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [avatar, setAvatar] = useState('');

  const getData = async () => {
    try {
      const storedUid = await AsyncStorage.getItem('uid');
      const storedName = await AsyncStorage.getItem('name');
      const storedAvatar = await AsyncStorage.getItem('avatar');
      setUid(storedUid || '');
      setName(storedName || '');
      setAvatar(storedAvatar || '');
    } catch (error) {
      console.log('Đã xảy ra lỗi:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handerPress = (Selectuid, Selectname, Selectavatar) => {
    if(screen == 'user')
    {
      navigation.navigate('Userprofile', {Selectuid: Selectuid, Selectname: Selectname, Selectavatar: Selectavatar})
    }
    else if(screen == 'chat')
    {
      navigation.navigate('MessegeRoom', {Selectuid: Selectuid, Selectname: Selectname, Selectavatar: Selectavatar, uid: uid})
    }
    else{
      if(Selectuid != postby)
      {
        handlerNotification(uid, Selectuid, 'đã chia sẻ một bài viết với bạn: '+title, postid, 'share');
        ShowToast('success', 'Thông báo', 'Chia sẻ thành công!');
        navigation.goBack();
      }else {
        ShowToast('error', 'Thông báo', 'Không thể chia sẻ bài viết này cho người đăng!');
      }
    }
  }

  const renderSearch = (data) => {
    return <TouchableOpacity onPress={() => handerPress(data.item.uid, data.item.name, data.item.avatar)}>
      <View style={{flexDirection: 'row', margin: 10, marginLeft: 0}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 50, height: 50, borderRadius: 100}}>
            {data.item.avatar == '' 
            ? <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={require('../assets/avatar.jpg')}/>
            : <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={{uri: data.item.avatar}}/>
            }
            {data.item.online == true
            ? <View style={{position: 'absolute', width: 10, height: 10, borderRadius: 100, backgroundColor: '#13c40a', bottom: 0, right: 0}}></View>
            : null
            }
          </View>
        </View>
        <View style={{flex: 8, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#a9abaa'}}>
          <Text style={{fontWeight: 'bold'}}>{data.item.name}</Text>
          <Text style={{color: '#a9abaa'}}>{data.item.uid}</Text>
        </View>
      </View>
    </TouchableOpacity>
  }

  return (
    <FlatList
          showsVerticalScrollIndicator={false}
          data={searchdatas}
          renderItem={renderSearch}
    />
  )
}