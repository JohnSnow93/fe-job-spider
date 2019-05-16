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

  const option = {
    baseOption: {
      title: {
        text: '前端职位薪水',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: yearLevelArray,
        right: 'right',
        top: '5%'
      },
      timeline: {
        data: districtArray,
        axisType: 'category',
        autoPlay: true
      },
      grid: {
        bottom: 80,
      },
      yAxis: {
        name: '月薪',
        data: salaryLevelArray
      },
      xAxis: {
        name: '数量'
      },
      media: [
        // query 1
        {
          query: {
            maxAspectRatio: 1
          },
          option: {

            grid: {
              // left: 'center',
              top: '100',
              width: '80%',
              height: '60%'
            },
            legend: {
              left: '0',
              top: '6%',
              orient: 'horizontal'
            },
            timeline: {
              left: '10%',
              bottom: 0
            }

          }
        },
        //query 2
        {
          query: {
            minAspectRatio: 1
          },
          option: {
            grid: {
              left: 'center',
              top: 130,
              width: '60%',
              height: '60%'

            },
            legend: {
              right: '20%'
            },
            timeline: {
              bottom: 30
            }
          }
        }
      ],
      series: yearLevelArray.map(i => ({ name: i, type: 'bar', stack: '1' }))
    },
    options,
  };

  return option;
}

module.exports = function () {
  return getChartA(data);
};
