import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, Keyboard} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import styles from '../styles/LoginsStyles';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Firebase_Login } from '../api/Api_Firebase';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Login() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const buttonPress = () => {
      Firebase_Login(email, password, navigation, Alert, setLoading, setEmail, setPassword);
      Keyboard.dismiss();
    }
    
  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flex: 1, height: windowHeight, justifyContent: 'flex-end'}}>
        <View style={{flex: 2, justifyContent: 'flex-end'}}>
          <View style={{padding: 20}}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Đăng Nhập</Text>
          </View>
        </View>
        <View style={{width: windowWidth, flex: 8, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center'}}>
          <View style={{margin: 20, marginTop: 50, width: windowWidth * 0.8}}> 
            <View style={{backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10}}>
              <TextInput
                value={email}
                placeholder='Email'
                onChangeText={(text) => { setEmail(text) }}
              >
              </TextInput>
            </View>
            <View style={{marginTop: 10, backgroundColor: '#E0E0E0', borderRadius: 10, padding: 10}}>
              <TextInput
                value={password}
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={(text) => { setPassword(text) }}
              >
              </TextInput>
            </View>
            <TouchableOpacity onPress={() => buttonPress(email, password)}>
              <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 2}} end={{x: 0, y: 0}} style={{marginTop: 30, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontWeight: '500', color: 'white'}}>Đăng nhập</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 10, flexDirection: 'row'}}>
              <Text style={{color: '#a9abaa'}}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <View style={{paddingLeft: 5}}>
                  <Text>Đăng Ký</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{width:300,height:300,opacity:0.7}} source={require('../assets/logo.png')}/>
            </View>
          </View>
        </View>
        {loading === true ? <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center'}}><ActivityIndicator size={'large'} /></View> : null}
        <Toast />
      </LinearGradient>
    </SafeAreaView>
  )
}