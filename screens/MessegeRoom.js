import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, TextInput, Keyboard, AppState, BackHandler } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { createMessegeRoom, handlerMessege, handlerUpdateMemberOnline, handlerReadMessege } from '../api/Api_Firebase';
import { getDataListMesseges } from '../api/Api_Firebase';
import { formatTimestamp } from '../function/helper_function';

export default function MessegeRoom() {
    const currentState = useRef(AppState.currentState);
    const route = useRoute();
    const navigation = useNavigation();
    const [input, setInput] = useState('');
    const [datas, setDatas] = useState([]);
    const [membersOnline, setMembersOnline] = useState([]);
    const uid = route.params.uid;
    const Selectuid = route.params.Selectuid;

    useEffect(() => {
        const subscription = AppState.addEventListener("change", changedState => {
          currentState.current = changedState;
          if(currentState.current == 'active')
          {
            handlerUpdateMemberOnline(route.params.roomid || createChatRoomId(uid, Selectuid), uid, 'active');
            console.log('User in room now');
          }
          else
          {
            handlerUpdateMemberOnline(route.params.roomid || createChatRoomId(uid, Selectuid), uid, 'background');
            console.log('User not in room');
          }
        });
    
        return () => {
          subscription.remove();
        };
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
          );
      
          return () => backHandler.remove();
    }, []);

    useEffect(() => {
        createMessegeRoom(route.params.roomid || createChatRoomId(uid, Selectuid), uid, Selectuid);
        getDataListMesseges(setDatas, setMembersOnline, route.params.roomid || createChatRoomId(uid, Selectuid));
        handlerUpdateMemberOnline(route.params.roomid || createChatRoomId(uid, Selectuid), uid, 'active');
        handlerReadMessege(route.params.roomid || createChatRoomId(uid, Selectuid), uid);
    }, []);

    const backAction = () => {
        handlerUpdateMemberOnline(route.params.roomid || createChatRoomId(uid, Selectuid), uid, 'background');
        console.log('User not in room');
        navigation.goBack();
        return true;
    };

    function createChatRoomId(currentUser, partnerUser) {
        // Sắp xếp user IDs theo thứ tự bảng chữ cái
        const sortedUserIds = [currentUser, partnerUser].sort();

        // Ghép user IDs thành ID phòng chat
        const chatRoomId = sortedUserIds.join('_');

        console.log(chatRoomId);
        return chatRoomId;
    }

    const renderItems = (data) => {
        const readedData = data.item.readed;
        if (data.item.uid == uid) {
            return <View style={{ alignSelf: 'flex-end', margin: 10 }}>
                <View style={{ backgroundColor: '#00d4ff', padding: 10, borderRadius: 10, maxWidth: '50%' }}>
                    <Text style={{ color: 'white', textAlign: 'right' }}>{data.item.messege}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {readedData.includes(Selectuid)
                        ? <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../assets/icon/seen.png')}/>
                        : null
                        }
                        <Text style={{ color: '#edf0ef', fontSize: 8, textAlign: 'right' }}>{formatTimestamp(data.item.posttime)}</Text>
                    </View>
                </View>
            </View>
        }
        else {
            return <View style={{ alignSelf: 'flex-start', margin: 10 }}>
                <View style={{ backgroundColor: '#edf0ef', padding: 10, borderRadius: 10, maxWidth: '50%' }}>
                    <Text>{data.item.messege}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'grey', fontSize: 8}}>{formatTimestamp(data.item.posttime)}</Text>
                    </View>
                </View>
            </View>
        }
    }

    const buttonPress = () => {
        handlerMessege(route.params.roomid || createChatRoomId(uid, Selectuid), uid, input, 'Text', membersOnline);
        setInput('');
        Keyboard.dismiss();
    }

    const backHandler = () => {
        handlerUpdateMemberOnline(route.params.roomid || createChatRoomId(uid, Selectuid), uid, 'background');
        console.log('User not in room');
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center', padding: 10
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{width: 50, height: 50, borderRadius: 100}}>
                            {route.params.Selectavatar == '' 
                            ? <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={require('../assets/avatar.jpg')}/>
                            : <Image style={{width: '100%', height: '100%', borderRadius: 100}} source={{uri: route.params.Selectavatar}}/>
                            }
                            {route.params.online == true
                            ? <View style={{position: 'absolute', width: 10, height: 10, borderRadius: 100, backgroundColor: '#13c40a', bottom: 0, right: 0}}></View>
                            : null
                            }
                        </View>
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{route.params.Selectname}</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => backHandler()}>
                            <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/back.png')} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                    <FlatList
                        removeClippedSubviews={true}
                        inverted={true}
                        showsVerticalScrollIndicator={false}
                        data={datas}
                        renderItem={renderItems}
                    />
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 60, flexDirection: 'row' }}>
                        <View style={{ flex: 9, justifyContent: 'center', marginLeft: 5 }}>
                            <View style={{ backgroundColor: 'white', height: 50, paddingLeft: 10, borderRadius: 10, borderWidth: 1, justifyContent: 'center', borderColor: '#03a5fc' }}>
                                <TextInput
                                    value={input}
                                    placeholder='Nhập tin nhắn...'
                                    onChangeText={(text) => { setInput(text) }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => buttonPress()}>
                                <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/send.png')} />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </SafeAreaView>
    )
}
