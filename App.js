import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, AppState } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Search from './screens/Search';
import Userprofile from './screens/Userprofile';
import Message from './screens/Message';
import Detail from './screens/Detail';
import DetailImage from './screens/DetailImage';
import Friend from './screens/Friend';
import Album from './screens/Album';
import EditProfile from './screens/EditProfile';
import Comments from './screens/Comments';
import CustomDrawer from './compoments/CustomDrawer';
import MessegeRoom from './screens/MessegeRoom';
import Notification from './screens/Notification';
import CreatePost from './screens/CreatePost';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handlerOnline } from './api/Api_Firebase';

export default function App() {
  const currentState = useRef(AppState.currentState);
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  const handerAppState = async() => {
  AppState.addEventListener("change", changedState => {
    currentState.current = changedState;
    handlerOnline(currentState.current);
    console.log(currentState.current);
  });
  }

  useEffect(() => {
    handerAppState();
    AsyncStorage.clear();
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    },
  };

  const Root = () => {
    const route = useRoute();
    return (
      <Drawer.Navigator screenOptions={{ headerShown: false, drawerLabelStyle: {marginLeft: -25} }} drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen name='Trang chủ' component={Home} initialParams={{userdata: route.params.userdata}} options={{ drawerIcon: () => ( <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={require('./assets/icon/home.png')} /> ), unmountOnBlur: true}} />
        <Drawer.Screen name='Tìm bạn bè' component={Search} initialParams={{userdata: route.params.userdata}} options={{ drawerIcon: () => ( <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={require('./assets/search.png')} /> ), unmountOnBlur: true}} />
        <Drawer.Screen name='Message' component={Message} initialParams={{userdata: route.params.userdata}} options={{ drawerIcon: () => ( <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={require('./assets/icon/message.png')} /> ), unmountOnBlur: true}} />
        <Drawer.Screen name='Sửa thông tin' component={EditProfile} options={{ drawerIcon: () => ( <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={require('./assets/icon/userprofile.png')} /> ), unmountOnBlur: true}} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar backgroundColor='#00d4ff'/>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Root' component={Root} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Search' component={Search} />
        <Stack.Screen name='Detail' component={Detail} />
        <Stack.Screen name='DetailImage' component={DetailImage} />
        <Stack.Screen name='Userprofile' component={Userprofile} />
        <Stack.Screen name='Friend' component={Friend} />
        <Stack.Screen name='Album' component={Album} />
        <Stack.Screen name='Comments' component={Comments} />
        <Stack.Screen name='CustomDrawer' component={CustomDrawer} />
        <Stack.Screen name='MessegeRoom' component={MessegeRoom} />
        <Stack.Screen name='Notification' component={Notification} />
        <Stack.Screen name='CreatePost' component={CreatePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
