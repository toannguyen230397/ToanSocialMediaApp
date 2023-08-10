import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePost() {
  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
            <Text>CreatePost</Text>
        </View>
    </SafeAreaView>
  )
}