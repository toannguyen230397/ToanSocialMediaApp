export const Api_Districts = (value, setDatas) => {
  fetch('https://provinces.open-api.vn/api/d/')
  .then(response => response.json())
  .then(jsonResponse => {
      const TPData = jsonResponse.filter(item => item.province_code === value).map(filterdata => {
        return {
          value: filterdata.code,
          label: filterdata.name
        };
      });
      setDatas(TPData);
  })
  .catch(error => console.log(error))
};

export const Api_Provinces = (setDatas) => {
  fetch('https://provinces.open-api.vn/api/p')
      .then(response => response.json())
      .then(jsonResponse => {
        const TinhData = jsonResponse.map(item => ({
          value: item.code,
          label: item.name
        }));
        setDatas(TinhData);
      })
      .catch(error => console.log(error));
}
