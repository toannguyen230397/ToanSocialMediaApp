import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState, React } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HeaderDrawer() {
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
    } catch (error) {
      console.log('Đã xảy ra lỗi:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
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
    
  )
}