import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function AppBar(props) {
    return (
        <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
            <TouchableOpacity onPress={props.lefticonpress}>
                <View style={{marginLeft: 10}}>
                    <Image style={styles.header_image} source={props.lefticon}></Image>
                </View>
            </TouchableOpacity>
            <Text style={styles.header_text}>{props.title}</Text>
            <TouchableOpacity onPress={props.righticonpress}>
                <View style={{marginRight: 10}}>
                    <Image style={styles.header_image} source={props.righticon}></Image>
                </View>
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles=StyleSheet.create({
    header: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    header_image: {
        width:24,
        height: 24,
    },
    header_text: {
        color: 'white',
        fontSize: 16,
        fontWeight: "500"
    }
})