// 将数据转换为echarts所需格式

const data = require('./result/bossZhipinResult.js');
const {salaryLevelArray, yearLevelArray} = require('./utils');

function getChartA(data) {
  const districtArray = Array.from(new Set(data.map(i => i.district)));
  const options = [];

  let dataSortByDistrict = {};
  districtArray.forEach((district) => {
    dataSortByDistrict[district] = data.filter(i => i.district === district);
  });

  let s = 0;
  for (let i in dataSortByDistrict) {
    let dataCollection = dataSortByDistrict[i];
    let dataSortByYear = [];
    yearLevelArray.forEach((yearDefine) => {
      let certainYearData = dataCollection.filter(i => i.year === yearDefine);
      dataSortByYear.push(certainYearData);
    });
    let series = [];

    dataSortByYear.forEach((dataArray) => {
      debugger;
      let line = salaryLevelArray.map((salaryLevelDefine) => {
        // console.log(dataArray)
        let length = dataArray.filter(item => {
          return item.salaryLevel === salaryLevelDefine
        }).length;
        if(length >0) s+=length;
        return length;
      });
      series.push({data: line})
    });

    options.push({
      title: {text: i},
      series,
    });
  }
  console.log(s)
  return options;
}

let e = getChartA(data);
// console.log(JSON.stringify(e))
