import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function SearchList({searchdatas}) {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const ListEmpty  = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: width, height: height}}>
        <Text>nhập tên hoặc Email người cần tìm</Text>
        <View style={{ width: '50%', height: 200, marginTop: 10}}>
          <Image style={{ flex: 1, width: '100%', resizeMode: 'stretch' }} source={require('../assets/search.png')} />
        </View>
    </View>
  )

  const renderSearch = (data) => (
    <TouchableOpacity onPress={() => {navigation.navigate('Userprofile', {Selectuid: data.item.uid})}}>
      <View style={{flexDirection: 'row', margin: 10}}>
        <View style={{flex: 2, justifyContent: 'center'}}>
          {data.item.avatar == ''
          ? <Image style={{width: 50, height: 50, borderRadius: 100, margin: 5}} source={require('../assets/avatar.jpg')}/>
          : <Image style={{width: 50, height: 50, borderRadius: 100, margin: 5}} source={{uri: data.item.avatar}}/>
          }
        </View>
        <View style={{flex: 8, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#a9abaa'}}>
          <Text style={{fontWeight: 'bold'}}>{data.item.name}</Text>
          <Text style={{color: '#a9abaa'}}>{data.item.uid}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
          showsVerticalScrollIndicator={false}
          data={searchdatas}
          renderItem={renderSearch}
          ListEmptyComponent={ListEmpty}
    />
  )
}