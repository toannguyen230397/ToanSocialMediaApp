import { View, Text, Image, TextInput, TouchableOpacity, BackHandler, Alert, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useMemo } from 'react';
import styles from '../styles/Register_EditProfile';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../compoments/Appbar';
import Dropdown from '../compoments/Dropdown';
import { RadioGroup } from 'react-native-radio-buttons-group';
import * as ImagePicker from 'expo-image-picker';
import { Firebase_Register } from '../api/Api_Firebase';
import { Dimensions } from 'react-native';

export default function Register() {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState('');
  const [province_code, setProvince_code] = useState('');
  const [district, setDistrict] = useState('');
  const [district_code, setDistrict_code] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();

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

  const buttonPress = () => {
    if (name == '' || province == '' || district == '' || selectedId == '') {
      Alert.alert("Thông báo", "Chưa nhập đủ thông tin");
    }
    else {
      Firebase_Register(email, password, name, avatar, selectedId, province, province_code, district, district_code, navigation, Alert, setLoading);
    }
  }

  const radioButtons = useMemo(() => ([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Nam',
      value: 'Nam'
    },
    {
      id: '0',
      label: 'Nữ',
      value: 'Nữ'
    }
  ]), []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, width: windowWidth, height: windowHeight }}>
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
                value={name}
                placeholder='Họ tên'
                onChangeText={(text) => { setName(text) }}
              >
              </TextInput>
            </View>
            <View style={{ marginTop: 10, backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10 }}>
              <TextInput
                value={email}
                placeholder='Email'
                onChangeText={(text) => { setEmail(text) }}
              >
              </TextInput>
            </View>
            <View style={{ marginTop: 10, backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10 }}>
              <TextInput
                value={password}
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={(text) => { setPassword(text) }}
              >
              </TextInput>
            </View>
            <View style={{ marginTop: 10 }}>
              <Dropdown setProvince={setProvince} setProvince_code={setProvince_code} setDistrict={setDistrict} setDistrict_code={setDistrict_code} />
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
            <TouchableOpacity onPress={() => buttonPress()}>
              <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 2 }} end={{ x: 0, y: 0 }} style={{ marginTop: 20, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: '500', color: 'white' }}>Đăng ký</Text>
              </LinearGradient>
            </TouchableOpacity>
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
        {loading === true ? <View style={{ width: windowWidth, height: windowHeight, position: 'absolute', justifyContent: 'center' }}><ActivityIndicator size={'large'} /></View> : null}
      </LinearGradient>
    </SafeAreaView>
  )
}