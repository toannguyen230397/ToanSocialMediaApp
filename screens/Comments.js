import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Keyboard, Dimensions } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../compoments/Appbar';
import ReadMore from '@fawazahmed/react-native-read-more';
import { LinearGradient } from 'expo-linear-gradient';
import { getDataComment, handlerComment, handlerNotification } from '../api/Api_Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTimestamp } from '../function/helper_function';

export default function Comments() {
  const [input, setInput] = useState('');
  const [datas, setDatas] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [avatar, setAvatar] = useState('');
  const { width, height } = Dimensions.get('window');
  const postid = route.params.postid;
  const Selectuid = route.params.uid;
  const title = route.params.title;

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
    getDataComment(setDatas, postid);
  }, []);

  const buttonPress = () => {
    if(input.trim() == '')
    {
      setInput('');
      Keyboard.dismiss();
    }
    else
    {
      handlerComment(postid, uid, input);
      if(Selectuid != uid)
      {
        handlerNotification(uid, Selectuid, 'đã bình luận một bài viết của bạn: '+title, postid, 'comment');
      }
      setInput('');
      Keyboard.dismiss();
    }
  }

  const renderComment = (data) => (
    <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => {navigation.navigate('Userprofile', {uid: data.item.uid, name: data.item.name, avatar: data.item.avatar})}}>
        {data.item.avatar == ''
        ?<Image style={{ width: 30, height: 30, borderRadius: 100 }} source={require('../assets/avatar.jpg')} />
        :<Image style={{ width: 30, height: 30, borderRadius: 100 }} source={{ uri: data.item.avatar }} />
        }
      </TouchableOpacity>
      <View style={{ marginLeft: 5, width: '90%', backgroundColor: '#edf0ef', borderRadius: 10, padding: 8 }}>
        <Text style={{ fontWeight: 'bold' }}>{data.item.name}</Text>
        <ReadMore numberOfLines={10} seeMoreText={"Xem Thêm"} seeMoreStyle={{ color: '#a9abaa' }} seeLessText={"Đóng Lại"} seeLessStyle={{ color: '#a9abaa' }}>
          {data.item.title}
        </ReadMore>
        <Text style={{ color: '#a9abaa', textAlign: 'right' }}>{formatTimestamp(data.item.posttime)}</Text>
      </View>
    </View>
  )
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AppBar title='Comments'
          lefticon={require('../assets/icon/back.png')}
          lefticonpress={navigation.goBack}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={datas}
            renderItem={renderComment}
          />
        </View>
        <View style={{ justifyContent: 'flex-end' }}>
          <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 60, flexDirection: 'row' }}>
            <View style={{ flex: 9, justifyContent: 'center', marginLeft: 5 }}>
              <View style={{ backgroundColor: 'white', height: 50, paddingLeft: 10, borderRadius: 10, borderWidth: 1, justifyContent: 'center', borderColor: '#03a5fc' }}>
                <TextInput
                  value={input}
                  placeholder='Nhập bình luận...'
                  onChangeText={(text) => { setInput(text) }}
                />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => buttonPress()}>
                <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/send.png')} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  )
}