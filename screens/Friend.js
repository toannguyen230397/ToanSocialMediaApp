import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect, React } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Searchbar from '../compoments/SearchBar';
import FriendList from '../compoments/FriendList';
import { getDataFriendlist } from '../api/Api_Firebase';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function Friend() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchdatas, setSearchdatas] = useState([]);
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    getDataFriendlist(setDatas, route.params.uid);
  }, []);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Searchbar datas={datas} setSearchdatas={setSearchdatas} type={'friend'}/>
        <FriendList searchdatas={searchdatas == '' ? datas : searchdatas} screen={route.params.screen} title={route.params.title} postid={route.params.postid} postby={route.params.postby}/>
        <Toast/>
      </SafeAreaView>
    </View> 
  )
}