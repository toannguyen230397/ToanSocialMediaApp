import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles/Newfeeds_Style'
import ReadMore from '@fawazahmed/react-native-read-more'
import { useNavigation } from '@react-navigation/native'
import { formatTimestamp } from '../function/helper_function';

export default function NewfeedsTop({ avatar, name, uid, feeling, title, posttime }) {
  const navigation = useNavigation();
  return (
    <View style={styles.newfeeds_container}>
      <View style={styles.newfeeds}>
        <TouchableOpacity onPress={() => { navigation.navigate('Userprofile', { Selectuid: uid }) }}>
          {avatar == ''
            ? <Image style={styles.newfeeds_postby_avatar} source={require('../assets/avatar.jpg')} />
            : <Image style={styles.newfeeds_postby_avatar} source={{ uri: avatar }} />
          }
        </TouchableOpacity>
        <View style={styles.newfeeds_postby_name}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Userprofile', { Selectuid: uid }) }}>
              <Text>{name}</Text>
            </TouchableOpacity>
            {feeling
              ? <Text style={{ color: '#a9abaa' }}> - {feeling}</Text>
              : null
            }
          </View>
          <Text style={{ color: '#a9abaa' }}>{formatTimestamp(posttime)}</Text>
        </View>
      </View>
      <View style={styles.newfeeds_content_text}>
        <ReadMore numberOfLines={3} seeMoreText={"Xem Thêm"} seeMoreStyle={{ color: '#a9abaa' }} seeLessText={"Đóng Lại"} seeLessStyle={{ color: '#a9abaa' }}>
          {title}
        </ReadMore>
      </View>
    </View>
  )
}