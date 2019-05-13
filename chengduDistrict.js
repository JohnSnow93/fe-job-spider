const request = require("request-promise");
const qs = require('qs');

const areaList = [{"name":"彭州市","adcode":"510182"},{"name":"都江堰市","adcode":"510181"},{"name":"青白江区","adcode":"510113"},{"name":"崇州市","adcode":"510184"},{"name":"大邑县","adcode":"510129"},{"name":"蒲江县","adcode":"510131"},{"name":"简阳市","adcode":"510185"},{"name":"金堂县","adcode":"510121"},{"name":"新津县","adcode":"510132"},{"name":"邛崃市","adcode":"510183"},{"name":"青羊区","adcode":"510105"},{"name":"温江区","adcode":"510115"},{"name":"金牛区","adcode":"510106"},{"name":"双流区","adcode":"510116"},{"name":"武侯区","adcode":"510107"},{"name":"郫都区","adcode":"510117"},{"name":"新都区","adcode":"510114"},{"name":"龙泉驿区","adcode":"510112"},{"name":"成华区","adcode":"510108"},{"name":"锦江区","adcode":"510104"}];

const districtNameList = areaList.map(i => i.name);

async function getDistrict(locationStr = ""){
  let district = '';
  for (let i = 0; i < districtNameList.length; i++) {
    if (locationStr.includes(districtNameList[i])){
      district = districtNameList[i];
      break;
    }
  }

  if(district) return Promise.resolve(district);
  else {
    try {
      const res = await request.get(`https://restapi.amap.com/v3/geocode/geo?${qs.stringify({
        key: 'b7a6dcbb3689af18c7f8b245be0df37b',
        address: locationStr,
        city: '成都'
      })}`, {
        json: true,
      });
      if(res.status === '1' && res.geocodes.length > 0){
        return Promise.resolve(res.geocodes[0].district);
      }
    } catch (e) {
      console.log(e);
      return Promise.resolve(null);
    }
  }
}

module.exports = {
  areaList: districtNameList,
  getDistrict,
};
