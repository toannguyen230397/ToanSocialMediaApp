import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { handlerOnline } from '../api/Api_Firebase';

export default function CustomDrawer(props) {
    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const navigation = useNavigation();

    const getData = async () => {
      try {
        const storedUid = await AsyncStorage.getItem('uid');
        const storedName = await AsyncStorage.getItem('name');
        const storedAvatar = await AsyncStorage.getItem('avatar');
        setUid(storedUid || '');
        setName(storedName || '');
        setAvatar(storedAvatar || '');
        console.log('CustomDrawer get data from AsyncStorage successful!');
      } catch (error) {
        console.log('Đã xảy ra lỗi:', error);
      }
    };
  
    useEffect(() => {
      getData();
    }, []);

    const handlerLogout = async() => {
      handlerOnline('logout');
      await AsyncStorage.clear();
      navigation.replace('Login');
    }

    const LogoutPress = () => {
        Alert.alert("Thông báo!", "Bạn muốn đăng xuất khỏi tài khoản không?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => handlerLogout() }
        ]);
      };
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#00d4ff'}}>
        <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{padding: 10}}>
            {avatar == ''
            ?
            <TouchableOpacity onPress={() => navigation.navigate('Userprofile', {Selectuid: uid})}>
              <Image style={{width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: 'white'}} source={require('../assets/avatar.jpg')}/>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>{name}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => navigation.navigate('Userprofile', {Selectuid: uid})}>
              <Image style={{width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: 'white'}} source={{uri: avatar}}/>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>{name}</Text>
            </TouchableOpacity>}
          </View>
        </LinearGradient>
        <View style={{backgroundColor: 'white'}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity onPress={LogoutPress}>
        <View style={{padding: 20, borderTopWidth: 1, borderColor: '#edf0ef', flexDirection: 'row'}}>
          <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/logout.png')} />
          <View style={{paddingLeft: 10}}>
            <Text style={{fontWeight: 'bold', color: 'grey'}}>Log Out</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}