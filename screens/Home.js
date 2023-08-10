import { View, Image, StyleSheet, TouchableOpacity, Text, Alert, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useEffect, useState, React } from 'react';
import Newfeeds from '../compoments/Newfeeds';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDataNewFeeds, getDataFriendlist, getDataNotification, Firebase_CreatePost } from '../api/Api_Firebase';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import PickerImages from '../compoments/PickerImages'

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [datas, setDatas] = useState([]);
  const [friendDatas, setFriendDatas] = useState([]);
  const [notification, setNotification] = useState([]);
  const [notificationlength, setNotificationLength] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const UserData = route.params.userdata;
  const uid = UserData.uid;
  const name = UserData.name;
  const avatar = UserData.avatar;
  const gioitinh = UserData.sex;
  const province = UserData.province;
  const province_code = UserData.province_code;
  const district = UserData.district;
  const district_code = UserData.district_code;

  const [isLoading, setIsLoading] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [childIsVisible, setChildIsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [feeling, setFelling] = useState('');

  const removeItem = (item) => {
    const updatedItems = images.filter((i) => i !== item);
    setImages(updatedItems);
  };

  const buttonPress = () => {
    Firebase_CreatePost(titleInput, images, uid, feeling);
    handerClose();
  }

  const handerClose = () => {
    setIsVisible(false);
    setTitleInput('');
    setImages([]);
    setFelling('');
  }

  const RenderImages = (data) => (
    <View style={{padding: 5}}>
      <Image style={{width: 100, height: 100, borderRadius: 10}} source={{uri: data.item}}/>
      <View style={{position: 'absolute', right: 0}}>
        <TouchableOpacity onPress={() => {removeItem(data.item)}}>
          <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/remove.png')} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const ListEmpty  = () => {
    if(isLoading == true){
      return <View>
        <ActivityIndicator size={'large'}/>
      </View>
    }
  }

  const childModal = () => {
    const handerChose = (felling) => {
      setFelling('Đang cảm thấy '+felling);
      setChildIsVisible(false);
    }
    return <View>
     <TouchableOpacity onPress={() => {setChildIsVisible(true)}}>
        <View style={{ backgroundColor: 'orange', padding: 5, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cảm Xúc</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={childIsVisible} animationType="fade" transparent={true}>
        <BlurView intensity={100} style={{ flex: 1 }} tint={'dark'}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10}}>
              <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, height: 30, padding: 5, justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => {setChildIsVisible(false)}}>
                  <View style={{alignSelf: 'flex-end'}}>
                    <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/close.png')} />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
              <View style={{alignItems: 'center', justifyContent: 'center', padding: 10, flexDirection: 'row'}}>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('🥰')}>
                    <Text style={{fontSize: 30}}>🥰</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😆')}>
                    <Text style={{fontSize: 30}}>😆</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😲')}>
                    <Text style={{fontSize: 30}}>😲</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😢')}>
                    <Text style={{fontSize: 30}}>😢</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😡')}>
                    <Text style={{fontSize: 30}}>😡</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  }

  const PostModal = () => {
    return <View>
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <BlurView intensity={100} style={{ flex: 1 }} tint={'dark'}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', width: '80%', borderWidth: 1, borderRadius: 10, borderColor: '#edf0ef' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {avatar == ''
                  ? <Image style={{ width: 30, height: 30, borderRadius: 100 }} source={require('../assets/avatar.jpg')} />
                  : <Image style={{ width: 30, height: 30, borderRadius: 100 }} source={{ uri: avatar }} />
                }
                <View style={{ marginLeft: 10}}>
                  <Text>{name}</Text>
                  {feeling != ''
                  ? <Text style={{color: '#a9abaa'}}>{feeling}</Text>
                  : null
                  }
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={() => handerClose()}>
                  <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/close2.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#edf0ef', height: 300 }}>
              <TextInput
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  textAlignVertical: 'top'
                }}
                multiline={true}
                value={titleInput}
                placeholder='Viết cảm nghĩ của bạn...'
                onChangeText={(text) => { setTitleInput(text) }}
              />
            </View>
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderBottomWidth: 1, borderColor: '#edf0ef' }}>
              <View style={{ paddingRight: 10 }}>
                <PickerImages setImages={setImages} setIsLoading={setIsLoading}/>
              </View>
              {childModal()}
            </View>
            <View style={isLoading ? { width: '100%', justifyContent: 'center', alignItems: 'center' } : null}>
              <FlatList
                ListEmptyComponent={ListEmpty}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={images}
                renderItem={RenderImages}
              />
            </View>
            <TouchableOpacity onPress={() => buttonPress()}>
                <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{ backgroundColor: '#03a5fc', padding: 20, alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                  {titleInput.length > 0 ?
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Đăng Bài</Text> :
                    <Text> </Text>
                  }
                </LinearGradient>
            </TouchableOpacity>
          </View>
          <Toast/>
        </View>
      </BlurView>
    </Modal>
  </View>
  }

  const openDrawer = () => (
    navigation.openDrawer()
  )
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('uid', uid);
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('avatar', avatar);
      await AsyncStorage.setItem('gioitinh', gioitinh.toString());
      await AsyncStorage.setItem('province', province.toString());
      await AsyncStorage.setItem('province_code', province_code.toString());
      await AsyncStorage.setItem('district', district.toString());
      await AsyncStorage.setItem('district_code', district_code.toString());
      console.log('Home.js lưu trữ data user thành công!');
    } catch (error) {
      console.log('Đã xảy ra lỗi:', error);
    }
  }

  const onRefresh = async () => {
    setDatas([]);
    getDataNewFeeds(setDatas);
  }

  useEffect(() => {
    saveData();
    getDataNewFeeds(setDatas);
    getDataFriendlist(setFriendDatas, uid);
    getDataNotification(setNotification, setNotificationLength, uid);
  }, []);

  const renderItem = (data) => (
    <TouchableOpacity onPress={() => { navigation.navigate('Userprofile', { Selectuid: data.item.uid }) }}>
      <View style={{width: 50, height: 50, borderRadius: 100, marginRight: 10}}>
        {data.item.avatar == '' 
        ? <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={require('../assets/avatar.jpg')}/>
        : <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={{uri: data.item.avatar}}/>
        }
        {data.item.online == true
        ? <View style={{position: 'absolute', width: 10, height: 10, borderRadius: 100, backgroundColor: '#13c40a', bottom: 0, right: 0}}></View>
        : null
        }
      </View>
    </TouchableOpacity>
  )

  const listHeader = () => (
    <View>
      <View elevation={5} style={{ backgroundColor: 'white' }}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flex: 8, flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center' }}>
              {avatar == ''
                ? <Image style={{ width: 30, height: 30, borderRadius: 100 }} source={require('../assets/avatar.jpg')} />
                : <Image style={{ width: 30, height: 30, borderRadius: 100 }} source={{ uri: avatar }} />
              }
            </View>
            <View style={{ marginLeft: 5, paddingLeft: 10, width: '90%', height: 50, borderRadius: 10, borderWidth: 2, borderColor: 'grey', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Text style={{ color: '#a9abaa' }}>Bạn đang nghĩ gì...</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/gallery.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {friendDatas.length > 0
      ? <View elevation={5} style={{flex: 1, marginTop: 10, backgroundColor: 'white', padding: 10}}>
          <FlatList
            horizontal
            showsVerticalScrollIndicator={false}
            data={friendDatas}
            renderItem={renderItem}
          />
        </View>
      : null
      }
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#edf0ef' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
          <TouchableOpacity onPress={() => openDrawer()}>
            <View style={{ marginLeft: 10 }}>
              <Image style={styles.header_image} source={require('../assets/icon/menu.png')}></Image>
            </View>
          </TouchableOpacity>
          <Text style={styles.header_text}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification', { data: notification, uid: uid })}>
            <View style={{ marginRight: 10 }}>
              <Image style={styles.header_image} source={require('../assets/icon/notification.png')}></Image>
            </View>
            {notificationlength > 0
            ? <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', width: 20, height: 20, backgroundColor: 'red', borderRadius: 100}}>
                <Text style={{color: 'white', fontSize: 8}}>{notificationlength < 10 ? notificationlength : +10}</Text>
              </View>
            : null
            }
          </TouchableOpacity>
        </LinearGradient>
        <Newfeeds datas={datas} setDatas={setDatas} listHeader={listHeader} uid={uid} refresh={refresh} onRefresh={onRefresh} />
        {PostModal()}
        <Toast/>
      </SafeAreaView>
    </View>
  )
}

const styles=StyleSheet.create({
  header: {
      height: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'center',
  },
  header_image: {
      width:30,
      height: 30,
  },
  header_text: {
      color: 'white',
      fontSize: 16,
      fontWeight: "500"
  }
})