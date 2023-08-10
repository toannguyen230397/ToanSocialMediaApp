import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import { useState, React } from 'react'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

export default function Searchbar({datas, setSearchdatas, type }) {
  const [searchInput, setSearchInput] = useState('');
  const navigation = useNavigation();
  const searchFilterFunction = (text) => {
    if (text) {
      const newData = datas.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const itemData2 = item.uid
          ? item.uid.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1 || itemData2.indexOf(textData) > -1;
      });
      setSearchdatas(newData);
      setSearchInput(text);
    } else {
      {type == 'friend' ? setSearchdatas(datas) : setSearchdatas([])};
      setSearchInput(text);
    }
  };
  return (
    <View>
          <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{height: 60, flexDirection: 'row'}}>
            <View style = {{flex: 1, marginLeft: 10, justifyContent: 'center'}}>
              {type == 'friend'
              ? <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/back.png')} />
                </TouchableOpacity>
              : <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/menu.png')} />
                </TouchableOpacity>
              }
            </View>
            <View style = {{flex: 9, justifyContent: 'center', marginRight: 5}}>
              <View style={{backgroundColor: 'white', height: 40, paddingLeft: 10, borderRadius: 10, borderWidth: 1, justifyContent: 'center', borderColor: '#03a5fc'}}>
                <TextInput
                  value={searchInput}
                  placeholder='Tìm kiếm...'
                  onChangeText={(text) => { searchFilterFunction(text) }}
                />
              </View>
            </View>
          </LinearGradient>
    </View>
  )
}