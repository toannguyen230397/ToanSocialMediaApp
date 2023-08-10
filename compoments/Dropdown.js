import { View } from 'react-native'
import { useState, useEffect, React } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { Api_Provinces, Api_Districts } from '../api/Api_Provinces'

export default function Dropdown({ setProvince, setProvince_code, setDistrict, setDistrict_code, province_code, district_code}) {
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const [provinceData, setProvinceData] = useState([]);
  const [valueProvince, setValueProvince] = useState(province_code);
  

  const [districtData, setDistrictData] = useState([]);
  const [valueDistrict, setValueDistrict] = useState(district_code);

  useEffect(() => {
    Api_Provinces(setProvinceData);
    Api_Districts(province_code, setDistrictData);
  }, []);
  
  
    return (
      <View style={{flexDirection: 'row', width: '100%'}}>
        <View style={{ flex: 5}}>
          <DropDownPicker
            // listMode='MODAL'
            // modalAnimationType="slide"
            listMode="SCROLLVIEW"
            scrollViewProps={{
                      nestedScrollEnabled: true,
              }}
            
            dropDownContainerStyle={{
                position: 'relative',
                top: 0
            }}
            open={provinceOpen}
            value={valueProvince}
            items={provinceData}
            setOpen={setProvinceOpen}
            setValue={setValueProvince}
            setItems={setProvinceData}
            placeholder={'Chọn tỉnh'}
            searchable={true}
            searchPlaceholder={'Nhập tên tỉnh cần tìm'}
            onSelectItem={item => {
              setProvince(item.label);
              setProvince_code(item.value);
              setDistrict('');
              setDistrict_code('');
              Api_Districts(item.value, setDistrictData);
            }}
          />
        </View>
        <View style={{ flex: 5, paddingLeft: 5}}>
          <DropDownPicker
            // listMode='MODAL'
            // modalAnimationType="slide"
            listMode="SCROLLVIEW"
            scrollViewProps={{
                      nestedScrollEnabled: true,
              }}
            
            dropDownContainerStyle={{
                position: 'relative',
                top: 0
            }}
            open={districtOpen}
            value={valueDistrict}
            items={districtData}
            setOpen={setDistrictOpen}
            setValue={setValueDistrict}
            setItems={setDistrictData}
            placeholder={'Chọn quận / huyện'}
            searchable={true}
            searchPlaceholder={'Nhập tên quận / huyện cần tìm'}
            onSelectItem={item => {
              setDistrict(item.label);
              setDistrict_code(item.value);
            }}
          />
        </View>
    </View>
    );
}