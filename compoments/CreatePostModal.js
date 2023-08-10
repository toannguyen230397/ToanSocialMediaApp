import { View, Text, Modal, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { useState, React } from 'react'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import PickerImages from './PickerImages'
import { Firebase_CreatePost } from '../api/Api_Firebase'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export default function CreatePostModal({ type, uid, name, avatar }) {
  const [isLoading, setIsLoading] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [childIsVisible, setChildIsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [feeling, setFelling] = useState('');

  const removeItem = (item) => {
    const updatedItems = images.filter((i) => i !== item);
    setImages(updatedItems);
  };

  const buttonPress = () => {
    Firebase_CreatePost(titleInput, images, uid, feeling);
    handerClose();
  }

  const handerClose = () => {
    setIsVisible(false);
    setTitleInput('');
    setImages([]);
    setFelling('');
  }

  const RenderImages = (data) => (
    <View style={{padding: 5}}>
      <Image style={{width: 100, height: 100, borderRadius: 10}} source={{uri: data.item}}/>
      <View style={{position: 'absolute', right: 0}}>
        <TouchableOpacity onPress={() => {removeItem(data.item)}}>
          <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/remove.png')} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const ListEmpty  = () => {
    if(isLoading == true){
      return <View>
        <ActivityIndicator size={'large'}/>
      </View>
    }
  }

  const childModal = () => {
    const handerChose = (felling) => {
      setFelling('Đang cảm thấy '+felling);
      setChildIsVisible(false);
    }
    return <View>
     <TouchableOpacity onPress={() => {setChildIsVisible(true)}}>
        <View style={{ backgroundColor: 'orange', padding: 5, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Cảm Xúc</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={childIsVisible} animationType="slide" transparent={true}>
        <BlurView intensity={100} style={{ flex: 1 }} tint={'dark'}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10}}>
              <LinearGradient colors={['#090979', '#00d4ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, height: 30, padding: 5, justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => {setChildIsVisible(false)}}>
                  <View style={{alignSelf: 'flex-end'}}>
                    <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/close.png')} />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
              <View style={{alignItems: 'center', justifyContent: 'center', padding: 10, flexDirection: 'row'}}>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('🥰')}>
                    <Text style={{fontSize: 30}}>🥰</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😆')}>
                    <Text style={{fontSize: 30}}>😆</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😲')}>
                    <Text style={{fontSize: 30}}>😲</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😢')}>
                    <Text style={{fontSize: 30}}>😢</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 5}}>
                  <TouchableOpacity onPress={() => handerChose('😡')}>
                    <Text style={{fontSize: 30}}>😡</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  }


  return (
    <View>
      <TouchableOpacity onPress={() => {setIsVisible(true)}}>
        {type == 'text' ?
          <Text style={{ color: '#a9abaa' }}>Bạn đang nghĩ gì...</Text> :
          <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/gallery.png')} />
        }
      </TouchableOpacity>
      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <BlurView intensity={100} style={{ flex: 1 }} tint={'dark'}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', width: '80%', borderWidth: 1, borderRadius: 10, borderColor: '#edf0ef' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {avatar == ''
                    ? <Image style={{ width: 30, height: 30, borderRadius: 100 }} source={require('../assets/avatar.jpg')} />
                    : <Image style={{ width: 30, height: 30, borderRadius: 100 }} source={{ uri: avatar }} />
                  }
                  <View style={{ marginLeft: 10}}>
                    <Text>{name}</Text>
                    {feeling != ''
                    ? <Text style={{color: '#a9abaa'}}>{feeling}</Text>
                    : null
                    }
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={() => handerClose()}>
                    <Image style={{ width: 20, height: 20 }} source={require('../assets/icon/close2.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#edf0ef', height: 300 }}>
                <TextInput
                  style={{
                    padding: 10,
                    backgroundColor: 'white',
                    textAlignVertical: 'top'
                  }}
                  multiline={true}
                  value={titleInput}
                  placeholder='Viết cảm nghĩ của bạn...'
                  onChangeText={(text) => { setTitleInput(text) }}
                />
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderBottomWidth: 1, borderColor: '#edf0ef' }}>
                <View style={{ paddingRight: 10 }}>
                  <PickerImages setImages={setImages} setIsLoading={setIsLoading}/>
                </View>
                {childModal()}
              </View>
              <View style={isLoading ? { width: '100%', justifyContent: 'center', alignItems: 'center' } : null}>
                <FlatList
                  ListEmptyComponent={ListEmpty}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={images}
                  renderItem={RenderImages}
                />
              </View>
              <TouchableOpacity onPress={() => buttonPress()}>
                  <LinearGradient colors={['#090979', '#00d4ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{ backgroundColor: '#03a5fc', padding: 20, alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    {titleInput.length > 0 ?
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Đăng Bài</Text> :
                      <Text> </Text>
                    }
                  </LinearGradient>
              </TouchableOpacity>
            </View>
            <Toast/>
          </View>
        </BlurView>
      </Modal>
    </View>
  )
}