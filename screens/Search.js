import { View, Text, AppState } from 'react-native';
import { useState, useEffect, useRef, React } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Searchbar from '../compoments/SearchBar';
import SearchList from '../compoments/SearchList';
import { getDataUsers } from '../api/Api_Firebase';
import { useRoute } from '@react-navigation/native';
import { handlerOnline } from '../api/Api_Firebase';

export default function Search() {
  const currentState = useRef(AppState.currentState);
  const [searchdatas, setSearchdatas] = useState([]);
  const [datas, setDatas] = useState([]);
  const route = useRoute();
  const UserData = route.params.userdata;
  const uid = UserData.uid;

  useEffect(() => {
    getDataUsers(setDatas, uid);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", changedState => {
      currentState.current = changedState;
      handlerOnline(currentState.current);
      console.log(currentState.current);
    });

    return () => {
      subscription.remove();
    };
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