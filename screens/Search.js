import { View, Text } from 'react-native';
import { useState, useEffect, React } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Searchbar from '../compoments/SearchBar';
import SearchList from '../compoments/SearchList';
import { getDataUsers } from '../api/Api_Firebase';
import { useRoute } from '@react-navigation/native';

export default function Search() {
  const [searchdatas, setSearchdatas] = useState([]);
  const [datas, setDatas] = useState([]);
  const route = useRoute();
  const UserData = route.params.userdata;
  const uid = UserData.uid;
  useEffect(() => {
    getDataUsers(setDatas, uid);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Searchbar datas={datas} setSearchdatas={setSearchdatas} />
        <SearchList searchdatas={searchdatas} />
      </View>
    </SafeAreaView>
  )
}