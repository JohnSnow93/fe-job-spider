// 将数据转换为echarts所需格式

const data = require('./result/bossZhipinResult.js');
const {salaryLevelArray, yearLevelArray} = require('./utils');

function getChartA(data) {
  const districtArray = data.map(i => i.district);
  const options = [];

  let dataSortByDistrict = {};
  districtArray.forEach((district) => {
    dataSortByDistrict[district] = data.filter(i => i.district === district);
  });

  for (let i in dataSortByDistrict) {
    let dataCollection = dataSortByDistrict[i];
    let dataSortByYear = [];
    yearLevelArray.forEach((yearDefine) => {
      let certainYearData = dataCollection.filter(i => i.year === yearDefine);
      dataSortByYear.push(certainYearData);
    });
    let series = [];
    dataSortByYear.forEach((dataArray) => {
      let line = salaryLevelArray.map((salaryLevelDefine) => {
        return dataArray.filter(item => item.salaryLevel === salaryLevelDefine).length;
      });
      series.push({data: line})
    });
    // let dataSortBySalary = salaryLevelArray.forEach((i) => {
    //
    // });

    options.push({
      title: {text: i},
      series,
    });
  }
  return options;
}

let e = getChartA(data);
console.log(e)
