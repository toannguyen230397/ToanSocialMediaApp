import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AppBar from '../compoments/Appbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { getDataLastMesseges } from '../api/Api_Firebase';
import { formatTimestamp } from '../function/helper_function';

export default function Message() {
  const route = useRoute();
  const navigation = useNavigation();
  const UserData = route.params.userdata;
  const uid = UserData.uid;
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const openDrawer = () => (
    navigation.openDrawer()
  )

  useEffect(() => {
    getDataLastMesseges(setDatas, uid, setLoading);
  }, []);
  const renderMesseges = (data) => {
    const Selectuid = data.item.uid;
    const Selectavatar = data.item.avatar;
    const Selectname = data.item.name;

    if(data.item.lastmesseges.messege != null) {
      return <TouchableOpacity onPress={() => {navigation.navigate('MessegeRoom', {roomid: data.item.roomid, uid: uid, Selectuid: Selectuid, Selectname: Selectname, Selectavatar: Selectavatar, online: data.item.online})}}>
        <View style={{ flexDirection: 'row', padding: 10, marginLeft: 10, marginRight: 10, borderBottomWidth: 1, borderBottomColor: '#edf0ef'}}>
          <View style = {{flex: 7, flexDirection: 'row', alignItems: 'center'}}>
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
            <View style={{ marginLeft: 10, padding: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{data.item.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                {data.item.lastmesseges.uid == uid
                ? <Text style={{ color: '#a9abaa' }}>Bạn: </Text>
                : null
                }
                <View style={{width: '70%'}}>
                  <Text numberOfLines={1} style={{ color: '#a9abaa' }}>{data.item.lastmesseges.messege}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 3, justifyContent: 'center'}}>
            <Text style={{textAlign: 'right', color: '#a9abaa'}}>{formatTimestamp(data.item.lastmesseges.posttime)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    }
    else{
      return null;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AppBar title='Message'
          lefticon={require('../assets/icon/menu.png')}
          lefticonpress={openDrawer}
          righticon={require('../assets/icon/search.png')}
          righticonpress={() => {navigation.navigate('Friend', {screen: 'chat', uid: uid})}}
        />
        {loading == true
        ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size={'large'}/></View>
        : <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={datas}
              renderItem={renderMesseges}
            />
          </View>
        }
      </View>
    </SafeAreaView>
  )
}