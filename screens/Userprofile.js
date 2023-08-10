import { View, Text, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect, React } from 'react';
import AppBar from '../compoments/Appbar';
import Newfeeds from '../compoments/Newfeeds';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDataUserFeeds, checkFriendship, getDataUser, handlerFriendRequest, handlerUnfriend } from '../api/Api_Firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Toast from 'react-native-toast-message';


export default function Userprofile({Selectuid, Selectname, Selectavatar}) {
  const navigation = useNavigation();
  const route = useRoute();
  const [refresh, setRefresh] = useState(false);
  const [datas, setDatas] = useState([]);
  const [userDatas, setUserDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState('');
  const isFocused = useIsFocused();
  const [isVisible, setIsVisible] = useState(false);

  const getData = async () => {
    try {
      const storedUid = await AsyncStorage.getItem('uid');
      setUid(storedUid);
      checkFriendship(storedUid, route.params.Selectuid, setStatus);
    } catch (error) {
      console.log('Đã xảy ra lỗi:', error);
    }
  };

  const onRefresh = async () => {
    setDatas([]);
    getDataUserFeeds(setDatas, route.params.Selectuid);
  }

  useEffect(() => {
    getData();
    getDataUser(setUserDatas, route.params.Selectuid, setIsLoading);
    getDataUserFeeds(setDatas, route.params.Selectuid);
  }, [isFocused]);

  const buttonPress = () => {
    if(status == 'Bạn bè')
    {
      setIsVisible(true);
    }
    else
    {
      handlerFriendRequest(status, route.params.Selectuid, uid);
    } 
  }
  
  const unfreidnPress = async() => {
    await handlerUnfriend(uid, route.params.Selectuid, setLoading);
    setIsVisible(false);
  }

  const VerifyModal = () => {
    return <View>
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <BlurView intensity={100} style={{ flex: 1 }} tint={'dark'}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10}}>
              <View style={{ alignItems: 'center' }}>
                <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: '100%', height: 50, marginBottom: 10, justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                  <Text style={{ fontWeight: '500', color: 'white', textAlign: 'center' }}>Hủy Kết Bạn</Text>
                </LinearGradient>
                <View style={{ width: '100%', flexDirection: 'row', margin: 10}}>
                  <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <LinearGradient colors={['#f20537', '#f5600a']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{width: '80%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                      <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <Text style={{fontWeight: '500', color: 'white' }}>Hủy bỏ</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={{flex: 5, justifyContent: 'center',alignItems: 'center'}}>
                    <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{width: '80%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                    <TouchableOpacity onPress={() => unfreidnPress()}>
                        <Text style={{fontWeight: '500', color: 'white' }}>Xác nhận</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {loading == true
          ? <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center' }}><ActivityIndicator size={'large'} /></View>
          : null
          }
        </BlurView>
      </Modal>
    </View>
  }

  const listHeader = () => (
    <View style={{flex: 1}}>
      <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10}}>
      <TouchableOpacity onPress={() => navigation.navigate('DetailImage', {images: [userDatas[0].avatar]})}>
        {userDatas[0].avatar == ''
        ?<Image style={{ width: 200, height: 200, borderRadius: 100, borderColor: 'white', borderWidth: 3 }} source={require('../assets/avatar.jpg')}/>
        :<Image style={{ width: 200, height: 200, borderRadius: 100, borderColor: 'white', borderWidth: 3 }} source={{uri: userDatas[0].avatar}}/>
        }
      </TouchableOpacity>
      <View style={{marginTop: 10}}>
        <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>{userDatas[0].name}</Text>
        <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>{route.params.Selectuid}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{ width: 13, height: 13}} source={require('../assets/icon/location.png')}/>
          <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>{userDatas[0].province}, {userDatas[0].district}</Text>
        </View>
      </View>
      <View style={{margin: 30, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View elevation={5} style={{justifyContent: 'center', alignItems: 'center', flex: 5, height: 50, borderRadius: 50, margin: 5, backgroundColor: 'white'}}>
              <TouchableOpacity onPress={() => navigation.navigate('Friend', {screen: 'user', uid: route.params.Selectuid})}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/friend.png')} />
                  <Text>Bạn bè</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View elevation={5} style={{justifyContent: 'center', alignItems: 'center', flex: 5, height: 50, borderRadius: 50, margin: 5, backgroundColor: 'white'}}>
              <TouchableOpacity onPress={() => navigation.navigate('Album', {uid: route.params.Selectuid})}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/album.png')} />
                  <Text> Hình Ảnh</Text>
                </View>
              </TouchableOpacity>
            </View>
      </View>
    </LinearGradient>
    {route.params.Selectuid == uid
    ? <View elevation={5} style={{ width: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 10}}>
        <Text> </Text>
      </View>
    : <View elevation={5} style={{ width: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 10}}>
        <TouchableOpacity onPress={() => buttonPress()}><Text style={{fontSize: 20, fontWeight: 'bold',}}>{status}</Text></TouchableOpacity>
      </View>
    }  
    </View>
  )

  const Render = () => {
    if(isLoading == true)
    {
      return null;
    }
    else
    {
      return <View style={{ flex: 1, backgroundColor: '#edf0ef'}}>
        <AppBar
          lefticon={require('../assets/icon/back.png')}
          lefticonpress={navigation.goBack}
        />
        <Newfeeds datas={datas} setDatas={setDatas} listHeader={listHeader} uid={route.params.Selectuid} refresh={refresh} onRefresh={onRefresh}/>
        {VerifyModal()}
        <Toast/>
      </View>
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {Render()}
    </SafeAreaView>
  )
}
