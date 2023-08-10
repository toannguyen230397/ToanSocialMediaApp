import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../compoments/Appbar';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { handlerReadNotification, responeFriendRequest } from '../api/Api_Firebase';
import { formatTimestamp } from '../function/helper_function';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

export default function Notification() {
  const navigation = useNavigation();
  const route = useRoute();
  const [datas, setDatas] = useState(route.params.data);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    handlerReadNotification(route.params.uid);
  }, []);

  const argeeHandler = async (postid, uid2, uid2Name) => {
    const updatedDatas = datas.filter((item) => item.postid !== postid);
    await responeFriendRequest('argee', route.params.uid, uid2, uid2Name, postid, setIsLoading);
    setDatas(updatedDatas);
  };

  const refuseHandler = async (postid, uid2, uid2Name) => {
    const updatedDatas = datas.filter((item) => item.postid !== postid);
    await responeFriendRequest('refuse', route.params.uid, uid2, uid2Name, postid, setIsLoading);
    setDatas(updatedDatas);
  };

  const renderItem = (data) => {
    if (data.item.type == 'friendRequest') {
      return <View style={{ flexDirection: 'row', padding: 10, backgroundColor: data.item.readed == false ? '#edf0ef' : 'white' }}>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          {data.item.sendbyAvatar == ''
            ? <Image style={{ width: 50, height: 50, borderRadius: 100, margin: 5 }} source={require('../assets/avatar.jpg')} />
            : <Image style={{ width: 50, height: 50, borderRadius: 100, margin: 5 }} source={{ uri: data.item.sendbyAvatar }} />
          }
          <View style={{ position: 'absolute', flexDirection: 'row', right: 0, bottom: 0 }}>
            <Image style={{ width: 30, height: 30, borderRadius: 100, margin: 5 }} source={require('../assets/icon/AddFriend.png')} />
          </View>
        </View>
        <View style={{ flex: 8, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0ef' }}>
          <Text numberOfLines={3} ><Text style={{ fontWeight: 'bold' }}>{data.item.sendbyName}</Text> {data.item.title}</Text>
          <Text style={{ color: '#a9abaa' }}>{formatTimestamp(data.item.posttime)}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 4 }} onPress={() => argeeHandler(data.item.postid, data.item.sendby, data.item.sendbyName)}>
              <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ flex: 4, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 10, padding: 10 }}>
                <Text style={{ color: 'white' }}>Xác nhận</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 4 }} onPress={() => refuseHandler(data.item.postid, data.item.sendby, data.item.sendbyName)}>
              <LinearGradient colors={['#f20537', '#f5600a']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 10, padding: 10 }}>
                <Text style={{ color: 'white' }}>Hủy bỏ</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    }
    else if (data.item.type == 'responeRequest') {
      return <View style={{ flexDirection: 'row', padding: 10, backgroundColor: data.item.readed == false ? '#edf0ef' : 'white' }}>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          {data.item.sendbyAvatar == ''
            ? <Image style={{ width: 50, height: 50, borderRadius: 100, margin: 5 }} source={require('../assets/avatar.jpg')} />
            : <Image style={{ width: 50, height: 50, borderRadius: 100, margin: 5 }} source={{ uri: data.item.sendbyAvatar }} />
          }
        </View>
        <View style={{ flex: 8, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0ef' }}>
          <Text numberOfLines={3} ><Text style={{ fontWeight: 'bold' }}>{data.item.sendbyName}</Text> {data.item.title}</Text>
          <Text style={{ color: '#a9abaa' }}>{formatTimestamp(data.item.posttime)}</Text>
        </View>
      </View>
    }
    else {
      return <TouchableOpacity onPress={() => navigation.navigate('Detail', { postid: data.item.postid })}>
        <View style={{ flexDirection: 'row', padding: 10, backgroundColor: data.item.readed == false ? '#edf0ef' : 'white' }}>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            {data.item.sendbyAvatar == ''
              ? <Image style={{ width: 50, height: 50, borderRadius: 100, margin: 5 }} source={require('../assets/avatar.jpg')} />
              : <Image style={{ width: 50, height: 50, borderRadius: 100, margin: 5 }} source={{ uri: data.item.sendbyAvatar }} />
            }
            <View style={{ position: 'absolute', flexDirection: 'row', right: 0, bottom: 0 }}>
              {data.item.type == 'like'
                ? <Image style={{ width: 30, height: 30, borderRadius: 100, margin: 5 }} source={require('../assets/icon/Heart.png')} />
                : data.item.type == 'comment'
                  ? <Image style={{ width: 30, height: 30, borderRadius: 100, margin: 5 }} source={require('../assets/icon/Comment2.png')} />
                  : data.item.type == 'share'
                  ? <Image style={{ width: 30, height: 30, borderRadius: 100, margin: 5 }} source={require('../assets/icon/Share2.png')} />
                  : null
              }
            </View>
          </View>

          <View style={{ flex: 8, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0ef' }}>
            <Text numberOfLines={3} ><Text style={{ fontWeight: 'bold' }}>{data.item.sendbyName}</Text> {data.item.title}</Text>
            <Text style={{ color: '#a9abaa' }}>{formatTimestamp(data.item.posttime)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AppBar title='Notification'
          lefticon={require('../assets/icon/back.png')}
          lefticonpress={() => navigation.goBack()}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={datas}
          renderItem={renderItem}
        />
        {isloading == true
          ? <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center' }}><ActivityIndicator size={'large'} /></View>
          : null
        }
      </View>
      <Toast />
    </SafeAreaView>
  )
}