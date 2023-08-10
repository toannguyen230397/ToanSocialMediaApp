import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, Modal, Alert, Keyboard } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import styles from '../styles/Register_EditProfile';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../compoments/Appbar';
import Dropdown from '../compoments/Dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { BlurView } from 'expo-blur';
import { handerEditProfile } from '../api/Api_Firebase';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';

export default function EditProfile() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPasswrod] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [province_code, setProvince_code] = useState(null);
  const [district_code, setDistrict_code] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [flag, setFlag] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDrawer = () => (
    navigation.openDrawer()
  )

  const handerClose = () => {
    setIsVisible(false);
  }

  const buttonPress = () => {
    Keyboard.dismiss();
    handerEditProfile(email, password, avatar, name, newPassword, province, province_code, district, district_code, selectedId, Alert, navigation, setLoading);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.assets != null) {
      setAvatar(result.assets[0].uri);
    }
  };

  const VerifyModal = () => {
    return <View>
      <TouchableOpacity onPress={() => { setIsVisible(true) }}>
        <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 2 }} end={{ x: 0, y: 0 }} style={{ marginTop: 20, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Thay đổi</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <BlurView intensity={100} style={{ flex: 1 }} tint={'dark'}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', height: 50, marginBottom: 10, justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                  <Text style={{ fontWeight: '500', color: 'white', textAlign: 'center' }}>Nhập Password để xác minh</Text>
                </LinearGradient>
                <View style={styles.bodyTextInput}>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => { setPassword(text) }}
                  >
                  </TextInput>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', margin: 10 }}>
                  <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <LinearGradient colors={['#f20537', '#f5600a']} start={{ x: 0, y: 2 }} end={{ x: 0, y: 0 }} style={{ width: '80%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                      <TouchableOpacity onPress={() => handerClose()}>
                        <Text style={{ fontWeight: '500', color: 'white' }}>Hủy bỏ</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 2 }} end={{ x: 0, y: 0 }} style={{ width: '80%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                      <TouchableOpacity onPress={() => buttonPress()}>
                        <Text style={{ fontWeight: '500', color: 'white' }}>Xác nhận</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
            {loading == true
            ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute'}}><ActivityIndicator size={'large'}/></View>
            : null
            }
          </View>
        </BlurView>
      </Modal>
    </View>
  }

  const getData = async () => {
    try {
      const storedUid = await AsyncStorage.getItem('uid');
      const storedName = await AsyncStorage.getItem('name');
      const storedAvatar = await AsyncStorage.getItem('avatar');
      const storedGioitinh = await AsyncStorage.getItem('gioitinh');
      const storedprovince = await AsyncStorage.getItem('province');
      const storedprovince_code = await AsyncStorage.getItem('province_code');
      const storeddistrict = await AsyncStorage.getItem('district');
      const storeddistrict_code = await AsyncStorage.getItem('district_code');
      setEmail(storedUid || '');
      setName(storedName || '');
      setAvatar(storedAvatar || '');
      setSelectedId(Number(storedGioitinh));
      setProvince(storedprovince || '');
      setProvince_code(Number(storedprovince_code));
      setDistrict(storeddistrict || '');
      setDistrict_code(Number(storeddistrict_code));
      setFlag(false);
      console.log('EditProfile get data from AsyncStorage successful!');
    } catch (error) {
      console.log('Đã xảy ra lỗi:', error);
    }
  };

  const radioButtons = useMemo(() => ([
    {
      id: 1, // acts as primary key, should be unique and non-empty string
      label: 'Nam',
      value: 'Nam'
    },
    {
      id: 0,
      label: 'Nữ',
      value: 'Nữ'
    }
  ]), []);

  const render = () => {
    if (flag == false) {
      return <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, width: windowWidth, height: windowHeight }}>
        <AppBar title='Register'
          lefticon={require('../assets/icon/back.png')}
          lefticonpress={navigation.goBack}
        />
        <View style={{ flex: 2 }}>
        </View>
        <View style={{ flex: 8, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center' }}>
          <View style={{ width: windowWidth * 0.8, marginTop: 100 }}>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10 }}>
              <TextInput
                value={email}
                placeholder='Email'
                editable={false}
              >
              </TextInput>
            </View>
            <View style={{ marginTop: 10, backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10 }}>
              <TextInput
                value={name}
                onChangeText={(text) => { setName(text) }}
              >
              </TextInput>
            </View>
            <View style={{ marginTop: 10, backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10 }}>
              <TextInput
                placeholder='**********'
                secureTextEntry={true}
                onChangeText={(text) => { setNewPasswrod(text) }}
              >
              </TextInput>
            </View>
            <View style={{ marginTop: 10 }}>
              <Dropdown province_code={province_code} setProvince_code={setProvince_code} setProvince={setProvince} district_code={district_code} setDistrict_code={setDistrict_code} setDistrict={setDistrict} />
            </View>
            <View style={{ marginTop: 10, height: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, flexDirection: 'row' }}>
              <Text>Giới tính: </Text>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={setSelectedId}
                selectedId={selectedId}
                layout='row'
              />
            </View>
            {VerifyModal()}
            <View style={{position: 'absolute', width: '100%', alignItems: 'center', padding: 10, top: -190 }}>
              <TouchableOpacity onPress={() => pickImage()}>
                {avatar == ''
                  ?
                  <Image style={{ width: windowWidth * 0.4, height: windowHeight * 0.2, borderRadius: 100, borderColor: '#edf0ef', borderWidth: 3 }} source={require('../assets/avatar.jpg')} />
                  :
                  <Image style={{ width: windowWidth * 0.4, height: windowHeight * 0.2, borderRadius: 100, borderColor: '#edf0ef', borderWidth: 3 }} source={{ uri: avatar }} />
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    }
    else {
      return <View style={{ flex: 1, width: windowWidth, height: windowHeight, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {render()}
    </SafeAreaView>
  )
}