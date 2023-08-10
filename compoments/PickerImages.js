import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import { ShowToast } from '../function/helper_function';

export default function PickerImages({setImages, setIsLoading}) {

  const pickImage = async () => {
    setIsLoading(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    if(result.assets != null)
    {
      let selectedImages = result.assets.map((asset) => asset.uri);
      if (selectedImages.length > 10) {
        ShowToast('error', 'Thông báo', 'Chỉ được chọn tối đa 10 hình');
        selectedImages = selectedImages.slice(0, 10);
      }
      setImages(selectedImages);
      setIsLoading(false);
    }else if(result.assets == null)
    {
      setIsLoading(false);
    }
  };  

  return (
    <TouchableOpacity onPress={pickImage}>
        <Image style={{ width: 30, height: 30 }} source={require('../assets/icon/gallery.png')} />
    </TouchableOpacity>
  )
}