import { View, Text, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function Test() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image style={{width:300,height:300,opacity:0.7}} source={require('../assets/logo.png')}/>
    </View>
  )
}